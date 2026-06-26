const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { findStock, nextId, readDb, writeDb } = require("../services/db");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = readDb();
  const items = db.watchlist
    .filter((item) => item.userId === req.user.id)
    .map((item) => {
      const stock = findStock(db, item.stockSymbol);
      return {
        ...item,
        price: stock?.price || item.price || 0,
        change: stock ? Number((stock.price - stock.previousClose).toFixed(2)) : 0,
        changePercent: stock ? Number((((stock.price - stock.previousClose) / stock.previousClose) * 100).toFixed(2)) : 0
      };
    });

  res.json({ items });
});

router.post("/", requireAuth, (req, res) => {
  const { symbol } = req.body;
  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }

  const db = readDb();
  const stock = findStock(db, symbol);
  if (!stock) {
    return res.status(404).json({ message: "Stock not found" });
  }

  const exists = db.watchlist.some((item) => item.userId === req.user.id && item.stockSymbol === stock.symbol);
  if (!exists) {
    db.watchlist.push({
      id: nextId("watch"),
      userId: req.user.id,
      stockSymbol: stock.symbol,
      companyName: stock.companyName,
      createdAt: new Date().toISOString()
    });
    writeDb(db);
  }

  res.json({ message: "Added to watchlist" });
});

router.delete("/:symbol", requireAuth, (req, res) => {
  const db = readDb();
  const before = db.watchlist.length;
  db.watchlist = db.watchlist.filter(
    (item) => !(item.userId === req.user.id && item.stockSymbol === req.params.symbol.toUpperCase())
  );
  if (db.watchlist.length !== before) {
    writeDb(db);
  }
  res.json({ message: "Removed from watchlist" });
});

module.exports = router;
