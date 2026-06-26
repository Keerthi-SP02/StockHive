import { useEffect, useState } from "react";
import api from "../api";
import { DonutChart } from "../components/DonutChart";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

export function TransactionsPage() {
  const [data, setData] = useState({ items: [], totalPages: 1, page: 1 });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const load = async (page = data.page) => {
    const { data: response } = await api.get("/transactions", {
      params: { page, search, type, limit: 10 }
    });
    setData(response);
  };

  useAutoRefresh(() => load(data.page), 30000);

  useEffect(() => {
    load(1);
  }, [search, type]);

  const buyCount = data.items.filter((item) => item.type === "BUY").length;
  const sellCount = data.items.filter((item) => item.type === "SELL").length;

  return (
    <div className="stack">
      <section className="panel">
        <div className="section-head">
          <h3>Transaction history</h3>
          <div className="filters">
            <input className="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stock" />
            <select className="search" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Company</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.companyName}</td>
                  <td>{item.type}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toLocaleString("en-IN")}</td>
                  <td>₹{item.total.toLocaleString("en-IN")}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pager">
          <button className="ghost-btn" disabled={data.page <= 1} onClick={() => load(data.page - 1)}>
            Prev
          </button>
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <button className="ghost-btn" disabled={data.page >= data.totalPages} onClick={() => load(data.page + 1)}>
            Next
          </button>
        </div>
      </section>

      <section className="panel split">
        <div>
          <h3>Transaction mix</h3>
          <DonutChart
            centerLabel={`${data.items.length} txns`}
            slices={[
              { label: "Buy", value: buyCount, color: "#1d4ed8" },
              { label: "Sell", value: sellCount, color: "#16a34a" }
            ]}
          />
        </div>
        <div className="mini-list">
          <h3>Summary</h3>
          <div className="metric-card compact">
            <span>Buy orders</span>
            <strong>{buyCount}</strong>
          </div>
          <div className="metric-card compact">
            <span>Sell orders</span>
            <strong>{sellCount}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
