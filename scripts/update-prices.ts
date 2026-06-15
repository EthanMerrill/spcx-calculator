/**
 * update-prices.ts
 * Fetches prices for SPCX & all ETFs from Alpha Vantage, then updates
 * src/data/etfs.ts in place with the new prices and a lastUpdated timestamp.
 *
 * Usage:
 *   npx tsx scripts/update-prices.ts
 *
 * Environment:
 *   ALPHA_VANTAGE_API_KEY  – required
 *   PRICES_DRY_RUN         – if "true", prints changes without writing
 */

import "dotenv/config";
import {writeFileSync} from "node:fs";
import {resolve, dirname} from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, "..", "src", "data", "etfs.ts");

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const DRY_RUN = process.env.PRICES_DRY_RUN === "true";
const BASE_URL = "https://www.alphavantage.co/query";

// Alpha Vantage free tier: 25 req/day, 5 req/min, 1 req/s
const REQUEST_DELAY_MS = 2_500;

// ---------------------------------------------------------------------------
// Read existing data from the TS file
// ---------------------------------------------------------------------------
interface EtfEntry {
	ticker: string;
	name: string;
	spcxWeight: number;
	spcxWeightLabel: string;
	currentPrice: number;
	indexRule: string;
}

async function readCurrentData(): Promise<{spcxPrice: number; etfs: EtfEntry[]}> {
	const mod = await import(DATA_FILE);
	return {
		spcxPrice: mod.SPCX_PRICE ?? 178.5,
		etfs: (mod.ETF_DATA ?? []) as EtfEntry[],
	};
}

// ---------------------------------------------------------------------------
// Alpha Vantage API
// ---------------------------------------------------------------------------
function sleep(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms));
}

async function fetchQuote(ticker: string): Promise<{price: number | null; date: string | null; error?: string}> {
	const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
	try {
		const res = await fetch(url);
		const json = await res.json();
		if (json.Note || json.Information) {
			const msg = json.Note ?? json.Information;
			if (/rate limit/i.test(msg)) return {price: null, date: null, error: `RATE_LIMIT: ${msg}`};
			return {price: null, date: null, error: `API_NOTE: ${msg}`};
		}
		const quote = json["Global Quote"];
		if (!quote || !quote["05. price"]) return {price: null, date: null, error: `NO_DATA: ${JSON.stringify(json).slice(0, 80)}`};
		const price = parseFloat(quote["05. price"]);
		const date = quote["07. latest trading day"] ?? null;
		return isNaN(price) ? {price: null, date: null, error: "PARSE_ERROR"} : {price, date};
	} catch (err) {
		return {price: null, date: null, error: String(err)};
	}
}

// ---------------------------------------------------------------------------
// Regenerate src/data/etfs.ts with updated prices
// ---------------------------------------------------------------------------
function regenerateFile(spcxPrice: number, etfs: EtfEntry[], lastUpdated: string): boolean {
	const etfEntries = etfs
		.map((e) => {
			const name = e.name.replace(/"/g, '\\"');
			const rule = e.indexRule.replace(/"/g, '\\"');
			return `\t{
\t\tticker: "${e.ticker}",
\t\tname: "${name}",
\t\tspcxWeight: ${e.spcxWeight},
\t\tspcxWeightLabel: ${JSON.stringify(e.spcxWeightLabel)},
\t\tcurrentPrice: ${e.currentPrice},
\t\tindexRule: ${JSON.stringify(e.indexRule)},
\t}`;
		})
		.join(",\n");

	const source = `export interface ETF {
\tticker: string;
\tname: string;
\tspcxWeight: number; // as a decimal, e.g. 0.0025 for 0.25%
\tspcxWeightLabel: string; // display string
\tcurrentPrice: number;
\tindexRule: string;
}

export const SPCX_PRICE = ${spcxPrice};

/** ISO 8601 timestamp of the last successful price update. */
export const LAST_UPDATED = "${lastUpdated}";

export const ETF_DATA: ETF[] = [
${etfEntries},
];
`;

	if (DRY_RUN) {
		console.log(`[DRY RUN] Would write ${DATA_FILE}`);
		return true;
	}

	writeFileSync(DATA_FILE, source, "utf-8");
	console.log(`✅ Updated ${DATA_FILE}`);
	return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
	if (!API_KEY) {
		console.error("❌ ALPHA_VANTAGE_API_KEY environment variable is required.");
		process.exit(1);
	}

	const {spcxPrice: oldSpcx, etfs} = await readCurrentData();
	const etfTickers = etfs.map((e) => e.ticker);
	const allTickers = ["SPCX", ...etfTickers];

	console.log(`🔑 Using API key: ${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);
	console.log(`📡 Fetching ${allTickers.length} tickers serially (1 req/s)…\n`);

	const prices = new Map<string, {price: number; date: string}>();
	const failures: string[] = [];

	for (let i = 0; i < allTickers.length; i++) {
		const ticker = allTickers[i];
		if (i > 0) await sleep(REQUEST_DELAY_MS);

		const r = {ticker, ...(await fetchQuote(ticker))};

		if (r.price !== null && r.date) {
			console.log(`  ✅ ${r.ticker.padEnd(6)} $${r.price.toFixed(2)}  (${r.date})`);
			prices.set(r.ticker, {price: r.price, date: r.date!});
		} else {
			console.log(`  ❌ ${r.ticker.padEnd(6)} ${r.error ?? "unknown"}`);
			if (r.error?.startsWith("RATE_LIMIT")) {
				console.log(`       Retrying ${r.ticker} after 60s…`);
				await sleep(60_000);
				const retry = await fetchQuote(r.ticker);
				if (retry.price !== null && retry.date) {
					console.log(`       ✅ ${r.ticker} $${retry.price.toFixed(2)} (retry ok)`);
					prices.set(r.ticker, {price: retry.price, date: retry.date!});
					continue;
				}
			}
			failures.push(r.ticker);
		}
	}

	// Update prices
	const newSpcx = prices.get("SPCX")?.price ?? oldSpcx;
	let changed = false;

	if (prices.has("SPCX") && Math.abs(newSpcx - oldSpcx) > 0.001) {
		console.log(`\n  SPCX_PRICE: ${oldSpcx} → ${newSpcx}`);
		changed = true;
	}

	for (const etf of etfs) {
		const p = prices.get(etf.ticker);
		if (p !== undefined) {
			const rounded = parseFloat(p.price.toFixed(2));
			if (Math.abs(etf.currentPrice - rounded) > 0.001) {
				console.log(`  ${etf.ticker}: ${etf.currentPrice} → ${rounded}`);
				etf.currentPrice = rounded;
				changed = true;
			}
		}
	}

	console.log(`\n📊 Got ${prices.size}/${allTickers.length} prices.`);

	if (!changed) {
		console.log("✅ All prices already up to date. Nothing to write.");
		if (failures.length > 0) {
			console.log(`⚠️  ${failures.length} ticker(s) could not be fetched (old values preserved).`);
		}
		return;
	}

	const now = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
	regenerateFile(newSpcx, etfs, now);

	if (failures.length > 0) {
		console.log(`⚠️  ${failures.length} ticker(s) could not be fetched (old values preserved).`);
		process.exit(0);
	}
}

main();
