const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { readDb } = require("../services/db");

const router = express.Router();

router.get("/", requireAuth, (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.max(5, Number(req.query.limit || 10));
  const search = (req.query.search || "").trim().toLowerCase();
  const type = (req.query.type || "").trim().toUpperCase();

  const db = readDb();
  let items = db.transactions.filter((txn) => txn.userId === req.user.id);

  if (search) {
    items = items.filter((txn) => txn.stockSymbol.toLowerCase().includes(search) || txn.companyName.toLowerCase().includes(search));
  }

  if (type === "BUY" || type === "SELL") {
    items = items.filter((txn) => txn.type === type);
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = items.slice((page - 1) * limit, page * limit);

  res.json({ items: paginated, page, limit, total, totalPages });
});

module.exports = router;
