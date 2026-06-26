import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { StockDetailPage } from "./pages/StockDetailPage";
import { StocksPage } from "./pages/StocksPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { WatchlistPage } from "./pages/WatchlistPage";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("sbstocks_theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sbstocks_theme", theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout theme={theme} setTheme={setTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="stocks" element={<StocksPage />} />
        <Route path="stocks/:symbol" element={<StockDetailPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="watchlist" element={<WatchlistPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
