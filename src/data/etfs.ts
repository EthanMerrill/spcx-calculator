export interface ETF {
	ticker: string;
	name: string;
	spcxWeight: number; // as a decimal, e.g. 0.0025 for 0.25%
	spcxWeightLabel: string; // display string
	currentPrice: number; // USD placeholder
	indexRule: string;
}

export const SPCX_PRICE = 136.53;

/** ISO 8601 timestamp of the last successful price update. */
export const LAST_UPDATED = "2026-07-16T14:20:00Z";

export const ETF_DATA: ETF[] = [
	{
		ticker: "QQQ",
		name: "Invesco QQQ Trust",
		spcxWeight: 0.0121,
		spcxWeightLabel: "1.21%",
		currentPrice: 721.34,
		indexRule: "Fast-tracked directly into the Nasdaq 100's top 40.",
	},
	{
		ticker: "QQQM",
		name: "Invesco NASDAQ 100 ETF",
		spcxWeight: 0.0121,
		spcxWeightLabel: "1.21%",
		currentPrice: 295.42,
		indexRule: "Tracks the exact same Nasdaq 100 index as QQQ, but heavily favored by buy-and-hold retail investors.",
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
		spcxWeight: 0.0022,
		spcxWeightLabel: "0.22%",
		currentPrice: 390.8,
		indexRule: "Captured via Russell's automatic IPO inclusion rules.",
	},
	{
		ticker: "VTI",
		name: "Vanguard Total Stock Market ETF",
		spcxWeight: 0.0014,
		spcxWeightLabel: "0.14%",
		currentPrice: 366.36,
		indexRule: "Diluted across the entire investable U.S. stock market.",
	},
	{
		ticker: "ITOT",
		name: "iShares Core S&P Total U.S. Stock Market ETF",
		spcxWeight: 0.0014,
		spcxWeightLabel: "0.14%",
		currentPrice: 104.56,
		indexRule: "Captures SPCX as part of the total investable U.S. equity market, matching VTI's exposure.",
	},
	{
		ticker: "VXF",
		name: "Vanguard Extended Market ETF",
		spcxWeight: 0.0115,
		spcxWeightLabel: "~1.15%",
		currentPrice: 180.2,
		indexRule: "Because SPCX is excluded from the S&P 500 due to negative earnings, it sits heavily in the extended market index.",
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
		ticker: "SCHV",
		name: "Schwab U.S. Large-Cap Value ETF",
		spcxWeight: 0.0007,
		spcxWeightLabel: "~0.07%",
		currentPrice: 82.14,
		indexRule: "SPCX's negative earnings heavily skewed its P/E ratio to the value side of the Dow Jones index scoring system.",
	},
	{
		ticker: "FELV",
		name: "Fidelity Enhanced Large Cap Value ETF",
		spcxWeight: 0.0005,
		spcxWeightLabel: "<0.10%",
		currentPrice: 41.24,
		indexRule: "Actively managed value ETF where managers specifically opted not to remove SPCX from the portfolio.",
	},
	{
		ticker: "XOVR",
		name: "ERShares Private-Public Crossover",
		spcxWeight: 0.1614,
		spcxWeightLabel: "16.14%",
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
		spcxWeight: 0.3164,
		spcxWeightLabel: "31.64%",
		currentPrice: 24.7,
		indexRule: "Managed by Ron Baron; functions almost as a high-conviction SPACEX/Tesla proxy due to the lack of index constraints.",
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
	{
		ticker: "YSPC",
		name: "YieldMax SPCX Option Income Strategy ETF",
		spcxWeight: 0,
		spcxWeightLabel: "Synthetic (Options)",
		currentPrice: 20.0,
		indexRule: "Does not invest directly in SPCX; pursues an options-based strategy to maximize income potential.",
	},
	{
		ticker: "SPAL",
		name: "GraniteShares 2x Long SpaceX Daily ETF",
		spcxWeight: 2.0,
		spcxWeightLabel: "200% (Leveraged)",
		currentPrice: 25.0,
		indexRule: "Utilizes swaps to provide 2 times (200%) the daily percentage change of SPCX.",
	},
	{
		ticker: "LOFF",
		name: "Direxion Daily SpaceX Bull 2X ETF",
		spcxWeight: 2.0,
		spcxWeightLabel: "200% (Leveraged)",
		currentPrice: 22.45,
		indexRule: "Single-stock leveraged ETF tracking 200% of the daily performance of SPCX.",
	},
	{
		ticker: "SPCH",
		name: "Leverage Shares 2x Long SPCX Daily ETF",
		spcxWeight: 2.0,
		spcxWeightLabel: "200% (Leveraged)",
		currentPrice: 9.93,
		indexRule: "Single-stock leveraged ETF backed by US Treasury obligations, strictly for active daily traders.",
	},
	{
		ticker: "SSPC",
		name: "Leverage Shares 2x Short SPCX Daily ETF",
		spcxWeight: -2.0,
		spcxWeightLabel: "-200% (Inverse)",
		currentPrice: 15.38,
		indexRule: "Uses derivatives to deliver -2x inverse daily exposure to SpaceX.",
	},
];
