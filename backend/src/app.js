const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const stockRoutes = require("./routes/stockRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");

const app = express();

const allowedOrigins = new Set(
  String(process.env.ALLOWED_ORIGINS || "http://localhost:5173,https://stock-hive-five.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/watchlist", watchlistRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
