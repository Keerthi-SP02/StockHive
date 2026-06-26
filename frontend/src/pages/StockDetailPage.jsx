import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { Sparkline } from "../components/Sparkline";
import { useToast } from "../context/ToastContext";

export function StockDetailPage() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stocks/${symbol}`);
      setStock(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [symbol]);

  async function buy() {
    try {
      await api.post("/portfolio/buy", { symbol, quantity: Number(quantity) });
      toast.notify("Purchase completed");
      load();
    } catch (error) {
      toast.notify(error.response?.data?.message || "Buy failed", "error");
    }
  }

  async function sell() {
    try {
      await api.post("/portfolio/sell", { symbol, quantity: Number(quantity) });
      toast.notify("Sale completed");
      load();
    } catch (error) {
      toast.notify(error.response?.data?.message || "Sell failed", "error");
    }
  }

  async function addWatchlist() {
    try {
      await api.post("/watchlist", { symbol });
      toast.notify("Added to watchlist");
    } catch (error) {
      toast.notify(error.response?.data?.message || "Could not add stock", "error");
    }
  }

  if (loading || !stock) {
    return <div className="panel">Loading stock...</div>;
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">{stock.sector}</p>
            <h2>
              {stock.companyName} <span className="muted">({stock.symbol})</span>
            </h2>
          </div>
          <Link className="link-btn" to="/stocks">
            Back
          </Link>
        </div>
        <div className="split">
          <div>
            <div className="metric-card compact">
              <span>Current price</span>
              <strong>₹{stock.price.toLocaleString("en-IN")}</strong>
              <small className={stock.change >= 0 ? "positive" : "negative"}>
                {stock.change >= 0 ? "+" : ""}
                {stock.change} ({stock.changePercent}%)
              </small>
            </div>
            <div className="trade-row">
              <label>
                Quantity
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </label>
              <div className="trade-actions">
                <button className="primary-btn" onClick={buy}>
                  Buy
                </button>
                <button className="ghost-btn" onClick={sell}>
                  Sell
                </button>
                <button className="ghost-btn" onClick={addWatchlist}>
                  Watchlist
                </button>
              </div>
            </div>
            <p className="muted">Total cost: ₹{Number(stock.price * Number(quantity || 0)).toLocaleString("en-IN")}</p>
            <p className="muted">Market cap: {stock.marketCap}</p>
          </div>
          <div>
            <h3>Price history</h3>
            <Sparkline data={stock.history.map((point) => point.price)} />
          </div>
        </div>
      </section>
    </div>
  );
}
