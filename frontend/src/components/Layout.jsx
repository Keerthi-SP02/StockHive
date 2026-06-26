import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/stocks", label: "Stocks" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/transactions", label: "Transactions" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/profile", label: "Profile" }
];

export function Layout({ theme, setTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          StockHive
        </Link>
        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <strong>{user?.name || "Guest"}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="ghost-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button className="ghost-btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Paper trading</p>
            <h1>Welcome back, {user?.name?.split(" ")[0] || "Trader"}</h1>
          </div>
          <div className="balance-pill">Balance: ₹{Number(user?.balance || 0).toLocaleString("en-IN")}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
