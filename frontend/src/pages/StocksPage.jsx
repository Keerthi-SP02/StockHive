import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

export function StocksPage() {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (value = search) => {
    setLoading(true);
    const { data } = await api.get("/stocks", { params: { q: value } });
    setStocks(data.stocks);
    setLoading(false);
  };

  useAutoRefresh(() => load(search), 30000);

  useEffect(() => {
    load("");
  }, []);

  return (
    <div className="stack">
      <section className="panel">
        <div className="section-head">
          <h3>Live stock market</h3>
          <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by symbol or company" />
        </div>
        <div className="table-wrap">
          {loading ? (
            <p className="muted">Loading stocks...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Market Cap</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol}>
                    <td>{stock.companyName}</td>
                    <td>{stock.symbol}</td>
                    <td>₹{stock.price.toLocaleString("en-IN")}</td>
                    <td className={stock.change >= 0 ? "positive" : "negative"}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.changePercent}%
                    </td>
                    <td>{stock.marketCap}</td>
                    <td>
                      <Link className="link-btn" to={`/stocks/${stock.symbol}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
