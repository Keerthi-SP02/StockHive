import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Sparkline } from "../components/Sparkline";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

export function DashboardPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [portfolioRes, stocksRes, watchlistRes] = await Promise.all([
        api.get("/portfolio"),
        api.get("/stocks"),
        api.get("/watchlist")
      ]);
      setPortfolio(portfolioRes.data);
      setStocks(stocksRes.data.stocks);
      setWatchlist(watchlistRes.data.items);
    } finally {
      setLoading(false);
    }
  };

  useAutoRefresh(load, 30000);

  useEffect(() => {
    load();
  }, []);

  if (loading || !portfolio) {
    return <div className="panel">Loading dashboard...</div>;
  }

  const cards = [
    { label: "Available Balance", value: `₹${portfolio.balance.toLocaleString("en-IN")}` },
    { label: "Portfolio Value", value: `₹${portfolio.portfolioValue.toLocaleString("en-IN")}` },
    { label: "Today's P/L", value: `₹${portfolio.todayProfitLoss.toLocaleString("en-IN")}` },
    { label: "Overall P/L", value: `₹${portfolio.overallProfitLoss.toLocaleString("en-IN")}` },
    { label: "Total Investment", value: `₹${portfolio.totalInvestment.toLocaleString("en-IN")}` }
  ];

  return (
    <div className="stack">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <p className="eyebrow">StockHive</p>
          <h2>Paper trading dashboard</h2>
          <p className="muted">Track your balance, holdings, and watchlist on a visible market-style backdrop.</p>
        </div>
        <div className="hero-badge">Live paper portfolio</div>
      </section>

      <section className="card-grid">
        {cards.map((card) => (
          <div className="metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        ))}
      </section>

      <section className="panel split">
        <div>
          <div className="section-head">
            <h3>Portfolio performance</h3>
            <Link to="/portfolio">View portfolio</Link>
          </div>
          <Sparkline data={portfolio.history} />
        </div>
        <div className="mini-list">
          <h3>Watchlist</h3>
          {watchlist.length ? (
            watchlist.slice(0, 5).map((item) => (
              <Link key={item.stockSymbol} className="mini-row" to={`/stocks/${item.stockSymbol}`}>
                <span>
                  <strong>{item.stockSymbol}</strong>
                  <small>{item.companyName}</small>
                </span>
                <b className={item.change >= 0 ? "positive" : "negative"}>₹{item.price.toLocaleString("en-IN")}</b>
              </Link>
            ))
          ) : (
            <p className="muted">Add a few stocks to your watchlist.</p>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h3>Market overview</h3>
          <Link to="/stocks">Browse stocks</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 5).map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>{stock.companyName}</td>
                  <td>₹{stock.price.toLocaleString("en-IN")}</td>
                  <td className={stock.change >= 0 ? "positive" : "negative"}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.changePercent}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
