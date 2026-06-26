import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

export function WatchlistPage() {
  const [items, setItems] = useState([]);
  const [symbol, setSymbol] = useState("");
  const toast = useToast();

  const load = async () => {
    const { data } = await api.get("/watchlist");
    setItems(data.items);
  };

  useAutoRefresh(load, 30000);

  useEffect(() => {
    load();
  }, []);

  async function addItem(event) {
    event.preventDefault();
    try {
      await api.post("/watchlist", { symbol });
      setSymbol("");
      toast.notify("Added to watchlist");
      load();
    } catch (error) {
      toast.notify(error.response?.data?.message || "Could not add", "error");
    }
  }

  async function removeItem(stockSymbol) {
    await api.delete(`/watchlist/${stockSymbol}`);
    toast.notify("Removed from watchlist");
    load();
  }

  return (
    <div className="stack">
      <section className="panel">
        <h3>Watchlist</h3>
        <form className="inline-form" onSubmit={addItem}>
          <input className="search" value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="Add symbol, like TCS" />
          <button className="primary-btn">Add</button>
        </form>
      </section>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Change</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.stockSymbol}</td>
                  <td>{item.companyName}</td>
                  <td>₹{item.price.toLocaleString("en-IN")}</td>
                  <td className={item.change >= 0 ? "positive" : "negative"}>
                    {item.change >= 0 ? "+" : ""}
                    {item.changePercent}%
                  </td>
                  <td>
                    <Link className="link-btn" to={`/stocks/${item.stockSymbol}`}>
                      Open
                    </Link>
                    <button className="ghost-btn inline" onClick={() => removeItem(item.stockSymbol)}>
                      Remove
                    </button>
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
