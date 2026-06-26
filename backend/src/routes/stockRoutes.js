const express = require("express");
const { findStock, readDb, tickMarket } = require("../services/db");

const router = express.Router();

router.get("/", (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();
  const db = tickMarket(readDb());
  const stocks = db.stocks
    .filter((stock) => {
      if (!query) return true;
      return stock.symbol.toLowerCase().includes(query) || stock.companyName.toLowerCase().includes(query);
    })
    .map((stock) => ({
      symbol: stock.symbol,
      companyName: stock.companyName,
      logo: stock.logo,
      marketCap: stock.marketCap,
      sector: stock.sector,
      price: stock.price,
      previousClose: stock.previousClose,
      change: Number((stock.price - stock.previousClose).toFixed(2)),
      changePercent: Number((((stock.price - stock.previousClose) / stock.previousClose) * 100).toFixed(2))
    }));

  res.json({
    stocks,
    topGainers: [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    topLosers: [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3)
  });
});

router.get("/:symbol", (req, res) => {
  const db = tickMarket(readDb());
  const stock = findStock(db, req.params.symbol);
  if (!stock) {
    return res.status(404).json({ message: "Stock not found" });
  }

  res.json({
    symbol: stock.symbol,
    companyName: stock.companyName,
    logo: stock.logo,
    marketCap: stock.marketCap,
    sector: stock.sector,
    price: stock.price,
    previousClose: stock.previousClose,
    history: stock.history,
    change: Number((stock.price - stock.previousClose).toFixed(2)),
    changePercent: Number((((stock.price - stock.previousClose) / stock.previousClose) * 100).toFixed(2))
  });
});

module.exports = router;
