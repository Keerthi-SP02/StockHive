import { useEffect, useState } from "react";
import api from "../api";
import { DonutChart } from "../components/DonutChart";
import { Sparkline } from "../components/Sparkline";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

export function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/portfolio");
      setPortfolio(data);
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(load, 30000);

  useEffect(() => {
    load();
  }, []);

  if (loading || !portfolio) {
    return <div className="panel">Loading portfolio...</div>;
  }

  const invested = portfolio.portfolioValue;
  const cash = portfolio.balance;
  const total = invested + cash;

  return (
    <div className="stack">
      <section className="card-grid">
        <div className="metric-card">
          <span>Balance</span>
          <strong>₹{portfolio.balance.toLocaleString("en-IN")}</strong>
        </div>
        <div className="metric-card">
          <span>Portfolio Value</span>
          <strong>₹{portfolio.portfolioValue.toLocaleString("en-IN")}</strong>
        </div>
        <div className="metric-card">
          <span>Overall P/L</span>
          <strong className={portfolio.overallProfitLoss >= 0 ? "positive" : "negative"}>
            ₹{portfolio.overallProfitLoss.toLocaleString("en-IN")}
          </strong>
        </div>
      </section>

      <section className="panel split">
        <div>
          <h3>Portfolio growth</h3>
          <Sparkline data={portfolio.history} />
        </div>
        <div>
          <h3>Allocation</h3>
          <DonutChart
            centerLabel={`₹${total.toLocaleString("en-IN")}`}
            slices={[
              { label: "Cash", value: cash, color: "#1d4ed8" },
              { label: "Invested", value: invested, color: "#16a34a" }
            ]}
          />
        </div>
      </section>

      <section className="panel">
        <h3>Holdings</h3>
        {!portfolio.holdings.length ? <p className="muted">No holdings yet. Buy a stock to see your portfolio chart change.</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Buy Price</th>
                <th>Current Price</th>
                <th>Investment</th>
                <th>Value</th>
                <th>P/L</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((item) => (
                <tr key={item.id}>
                  <td>{item.companyName}</td>
                  <td>{item.stockSymbol}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.averageBuyPrice.toLocaleString("en-IN")}</td>
                  <td>₹{item.currentPrice.toLocaleString("en-IN")}</td>
                  <td>₹{item.totalInvestment.toLocaleString("en-IN")}</td>
                  <td>₹{item.currentValue.toLocaleString("en-IN")}</td>
                  <td className={item.profitLoss >= 0 ? "positive" : "negative"}>₹{item.profitLoss.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
