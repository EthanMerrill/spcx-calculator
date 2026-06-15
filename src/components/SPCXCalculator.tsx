import {useState, useCallback} from "react";
import {ETF_DATA, SPCX_PRICE, type ETF} from "../data/etfs";

interface PortfolioRow {
	id: string;
	etf: ETF;
	shares: string;
	cashValue: string;
	// which field the user last edited
	lastEdited: "shares" | "cash";
}

function formatUSD(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}

function formatShares(value: number): string {
	return new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 4,
		maximumFractionDigits: 4,
	}).format(value);
}

export default function SPCXCalculator() {
	const [portfolio, setPortfolio] = useState<PortfolioRow[]>([]);

	const usedTickers = new Set(portfolio.map((r) => r.etf.ticker));
	const availableETFs = ETF_DATA.filter((e) => !usedTickers.has(e.ticker));

	const addETF = useCallback((ticker: string) => {
		const etf = ETF_DATA.find((e) => e.ticker === ticker);
		if (!etf) return;
		setPortfolio((prev) => [
			...prev,
			{
				id: crypto.randomUUID(),
				etf,
				shares: "",
				cashValue: "",
				lastEdited: "shares",
			},
		]);
	}, []);

	const updateRow = useCallback((id: string, field: "shares" | "cash", raw: string) => {
		setPortfolio((prev) =>
			prev.map((row) => {
				if (row.id !== id) return row;
				const price = row.etf.currentPrice;
				if (field === "shares") {
					const shares = parseFloat(raw);
					const cashValue = isNaN(shares) || raw === "" ? "" : String((shares * price).toFixed(2));
					return {...row, shares: raw, cashValue, lastEdited: "shares"};
				} else {
					const cash = parseFloat(raw);
					const shares = isNaN(cash) || raw === "" ? "" : String((cash / price).toFixed(6));
					return {...row, shares, cashValue: raw, lastEdited: "cash"};
				}
			}),
		);
	}, []);

	const removeRow = useCallback((id: string) => {
		setPortfolio((prev) => prev.filter((r) => r.id !== id));
	}, []);

	// Aggregate totals
	let totalCashInETFs = 0;
	let totalSPCXCash = 0;
	let totalSPCXShares = 0;

	const rows = portfolio.map((row) => {
		const cashVal = parseFloat(row.cashValue) || 0;
		const spcxCash = cashVal * row.etf.spcxWeight;
		const spcxShares = spcxCash / SPCX_PRICE;
		totalCashInETFs += cashVal;
		totalSPCXCash += spcxCash;
		totalSPCXShares += spcxShares;
		return {...row, cashVal, spcxCash, spcxShares};
	});

	return (
		<div className="calculator">
			{/* Add ETF Row */}
			<div className="add-row">
				<label className="add-label">Add an ETF holding</label>
				<div className="etf-select-wrap">
					<select
						value=""
						onChange={(e) => {
							if (e.target.value) addETF(e.target.value);
						}}
						className="etf-select"
						aria-label="Select an ETF to add">
						<option value="">Select an ETF…</option>
						{availableETFs.map((etf) => (
							<option key={etf.ticker} value={etf.ticker}>
								{etf.ticker} — {etf.name}
							</option>
						))}
					</select>
					<span className="etf-select-arrow">▼</span>
				</div>
				{availableETFs.length === 0 && <span className="all-added-hint">All ETFs added ✓</span>}
			</div>

			{/* Summary Card */}
			<div className="summary-card">
				<div className="summary-label">
					<span className="summary-icon">🚀</span>
					Total Indirect SpaceX (SPCX) Exposure
				</div>
				<div className="summary-metrics">
					<div className="summary-metric">
						<span className="metric-value">{formatUSD(totalSPCXCash)}</span>
						<span className="metric-label">Estimated SPCX Cash Value</span>
					</div>
					<div className="summary-divider" />
					<div className="summary-metric">
						<span className="metric-value">{formatShares(totalSPCXShares)}</span>
						<span className="metric-label">Equivalent SPCX Shares</span>
					</div>
					<div className="summary-divider" />
					<div className="summary-metric">
						<span className="metric-value">{formatUSD(totalCashInETFs)}</span>
						<span className="metric-label">Total ETF Portfolio Value</span>
					</div>
				</div>
				<div className="spcx-ref">
					Reference price: <strong>{formatUSD(SPCX_PRICE)}</strong> / SPCX share
				</div>
			</div>

			{/* Portfolio Table */}
			{portfolio.length === 0 ? (
				<div className="empty-state">
					<div className="empty-icon">🛸</div>
					<p>Add ETFs above to calculate your indirect SpaceX exposure.</p>
				</div>
			) : (
				<div className="table-wrapper">
					<table className="portfolio-table">
						<thead>
							<tr>
								<th>Ticker</th>
								<th>ETF Name</th>
								<th>Total Shares</th>
								<th>Total Cash Value</th>
								<th>SPCX Weight</th>
								<th className="highlight-header">
									<span>Estimated SPCX Exposure</span>
								</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.id}>
									<td>
										<span className="ticker-badge">{row.etf.ticker}</span>
									</td>
									<td className="etf-name-cell">
										<span>{row.etf.name}</span>
										<span className="etf-price">@ {formatUSD(row.etf.currentPrice)}</span>
									</td>
									<td>
										<input type="number" min="0" step="any" placeholder="0" value={row.shares} onChange={(e) => updateRow(row.id, "shares", e.target.value)} className="input-field" aria-label={`Shares of ${row.etf.ticker}`} />
									</td>
									<td>
										<div className="input-prefix-wrap">
											<span className="input-prefix">$</span>
											<input type="number" min="0" step="any" placeholder="0.00" value={row.cashValue} onChange={(e) => updateRow(row.id, "cash", e.target.value)} className="input-field with-prefix" aria-label={`Cash value in ${row.etf.ticker}`} />
										</div>
									</td>
									<td>
										<span className="weight-badge">{row.etf.spcxWeightLabel}</span>
									</td>
									<td className="highlight-cell">
										<div className="spcx-exposure">
											<div className="spcx-cash">{formatUSD(row.spcxCash)}</div>
											<div className="spcx-shares">{formatShares(row.spcxShares)} shares</div>
										</div>
									</td>
									<td>
										<button onClick={() => removeRow(row.id)} className="remove-btn" aria-label={`Remove ${row.etf.ticker}`}>
											✕
										</button>
									</td>
								</tr>
							))}
						</tbody>
						{rows.length > 1 && (
							<tfoot>
								<tr className="totals-row">
									<td colSpan={3}></td>
									<td>
										<strong>{formatUSD(totalCashInETFs)}</strong>
									</td>
									<td></td>
									<td className="highlight-cell">
										<div className="spcx-exposure">
											<div className="spcx-cash">{formatUSD(totalSPCXCash)}</div>
											<div className="spcx-shares">{formatShares(totalSPCXShares)} shares</div>
										</div>
									</td>
									<td></td>
								</tr>
							</tfoot>
						)}
					</table>
				</div>
			)}
		</div>
	);
}
