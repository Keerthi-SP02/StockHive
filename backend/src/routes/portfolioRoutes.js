const express = require("express");
const { requireAuth } = require("../middleware/auth");
const {
  calculatePortfolio,
  findStock,
  nextId,
  readDb,
  tickMarket,
  writeDb
} = require("../services/db");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const db = tickMarket(readDb());
  const summary = calculatePortfolio(db, req.user.id);
  res.json(summary);
});

router.post("/buy", requireAuth, (req, res) => {
  const { symbol, quantity } = req.body;
  const qty = Number(quantity);
  if (!symbol || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: "Valid symbol and quantity are required" });
  }

  const db = tickMarket(readDb());
  const user = db.users.find((item) => item.id === req.user.id);
  const stock = findStock(db, symbol);
  if (!stock) {
    return res.status(404).json({ message: "Stock not found" });
  }

  const total = Number((stock.price * qty).toFixed(2));
  if (user.balance < total) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  user.balance = Number((user.balance - total).toFixed(2));

  const holding = db.holdings.find((item) => item.userId === user.id && item.stockSymbol === stock.symbol);
  if (holding) {
    const existingCost = holding.quantity * holding.averageBuyPrice;
    const newCost = total;
    const newQuantity = holding.quantity + qty;
    holding.quantity = newQuantity;
    holding.averageBuyPrice = Number(((existingCost + newCost) / newQuantity).toFixed(2));
    holding.currentPrice = stock.price;
  } else {
    db.holdings.push({
      id: nextId("hold"),
      userId: user.id,
      stockSymbol: stock.symbol,
      companyName: stock.companyName,
      quantity: qty,
      averageBuyPrice: stock.price,
      currentPrice: stock.price
    });
  }

  db.transactions.unshift({
    id: nextId("txn"),
    userId: user.id,
    stockSymbol: stock.symbol,
    companyName: stock.companyName,
    type: "BUY",
    quantity: qty,
    price: stock.price,
    total,
    status: "COMPLETED",
    createdAt: new Date().toISOString()
  });

  writeDb(db);
  res.json({ message: "Stock purchased successfully", summary: calculatePortfolio(db, user.id) });
});

router.post("/sell", requireAuth, (req, res) => {
  const { symbol, quantity } = req.body;
  const qty = Number(quantity);
  if (!symbol || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ message: "Valid symbol and quantity are required" });
  }

  const db = tickMarket(readDb());
  const user = db.users.find((item) => item.id === req.user.id);
  const stock = findStock(db, symbol);
  if (!stock) {
    return res.status(404).json({ message: "Stock not found" });
  }

  const holding = db.holdings.find((item) => item.userId === user.id && item.stockSymbol === stock.symbol);
  if (!holding || holding.quantity < qty) {
    return res.status(400).json({ message: "Not enough shares to sell" });
  }

  const total = Number((stock.price * qty).toFixed(2));
  user.balance = Number((user.balance + total).toFixed(2));
  holding.quantity -= qty;
  if (holding.quantity === 0) {
    db.holdings = db.holdings.filter((item) => item !== holding);
  } else {
    holding.currentPrice = stock.price;
  }

  db.transactions.unshift({
    id: nextId("txn"),
    userId: user.id,
    stockSymbol: stock.symbol,
    companyName: stock.companyName,
    type: "SELL",
    quantity: qty,
    price: stock.price,
    total,
    status: "COMPLETED",
    createdAt: new Date().toISOString()
  });

  writeDb(db);
  res.json({ message: "Stock sold successfully", summary: calculatePortfolio(db, user.id) });
});

module.exports = router;
