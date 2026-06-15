export interface ETF {
	ticker: string;
	name: string;
	spcxWeight: number; // as a decimal, e.g. 0.0025 for 0.25%
	spcxWeightLabel: string; // display string
	currentPrice: number; // USD placeholder
	indexRule: string;
}

export const SPCX_PRICE = 178.5;

/** ISO 8601 timestamp of the last successful price update. */
export const LAST_UPDATED = "2026-06-15T00:00:00Z";

export const ETF_DATA: ETF[] = [
	{
		ticker: "QQQ",
		name: "Invesco QQQ Trust",
		spcxWeight: 0.00275,
		spcxWeightLabel: "~0.25% – 0.30%",
		currentPrice: 721.34,
		indexRule: "Fast-tracked directly into the Nasdaq 100's top 40.",
	},
	{
		ticker: "MGK",
		name: "Vanguard Mega Cap Growth ETF",
		spcxWeight: 0.002,
		spcxWeightLabel: "~0.20%",
		currentPrice: 86.88,
		indexRule: "Added via the CRSP Mega Cap Growth rapid-entry protocol.",
	},
	{
		ticker: "IWF",
		name: "iShares Russell 1000 Growth ETF",
		spcxWeight: 0.0015,
		spcxWeightLabel: "~0.15%",
		currentPrice: 390.8,
		indexRule: "Captured via Russell's automatic IPO inclusion rules.",
	},
	{
		ticker: "VTI",
		name: "Vanguard Total Stock Market ETF",
		spcxWeight: 0.0008,
		spcxWeightLabel: "~0.08%",
		currentPrice: 366.36,
		indexRule: "Diluted across the entire investable U.S. stock market.",
	},
	{
		ticker: "VT",
		name: "Vanguard Total World ETF",
		spcxWeight: 0.0004,
		spcxWeightLabel: "~0.04%",
		currentPrice: 156.29,
		indexRule: "Diluted across all global public equities.",
	},
	{
		ticker: "XOVR",
		name: "ERShares Private-Public Crossover",
		spcxWeight: 0.1376,
		spcxWeightLabel: "13.76%",
		currentPrice: 19.96,
		indexRule: "Historically aggressive private-equity style allocation.",
	},
	{
		ticker: "NASA",
		name: "Tema Space Innovators ETF",
		spcxWeight: 0.065,
		spcxWeightLabel: "6.50%",
		currentPrice: 31.93,
		indexRule: "Holds SPCX as a top-4 holding alongside Rocket Lab.",
	},
	{
		ticker: "RONB",
		name: "Baron First Principles ETF",
		spcxWeight: 0.019,
		spcxWeightLabel: "1.90%",
		currentPrice: 24.7,
		indexRule: "Managed by Ron Baron, though their mutual fund (BPTIX) holds ~31%.",
	},
	{
		ticker: "AGIX",
		name: "KraneShares Public-Private AI & Tech",
		spcxWeight: 0.0201,
		spcxWeightLabel: "2.01%",
		currentPrice: 45.58,
		indexRule: "Spreads exposure between an old SPV vehicle (1.31%) and direct stock (0.70%).",
	},
	{
		ticker: "ARKK",
		name: "ARK Innovation ETF",
		spcxWeight: 0.018,
		spcxWeightLabel: "1.80%",
		currentPrice: 75.65,
		indexRule: "Cathie Wood actively purchased ~$444M in shares immediately following the IPO.",
	},
];
