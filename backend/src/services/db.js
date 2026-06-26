const fs = require("fs");
const path = require("path");
const createDefaultDb = require("../config/defaultDb");

const dataFile = path.resolve(process.cwd(), process.env.DATA_FILE || "data/db.json");
let cache = null;

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readDb() {
  if (cache) {
    return cache;
  }

  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    cache = JSON.parse(raw);
  } catch (_error) {
    cache = createDefaultDb();
    writeDb(cache);
  }

  return cache;
}

function writeDb(db) {
  ensureDir(dataFile);
  cache = db;
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2), "utf8");
  return db;
}

function nextId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function findStock(db, symbol) {
  return db.stocks.find((stock) => stock.symbol.toUpperCase() === symbol.toUpperCase());
}

function tickMarket(db) {
  const now = Date.now();
  db.stocks = db.stocks.map((stock, index) => {
    const volatility = 0.01 + index * 0.001;
    const delta = (Math.random() - 0.5) * volatility;
    const previousClose = stock.price;
    const price = Number(Math.max(1, stock.price * (1 + delta)).toFixed(2));
    const history = [...(stock.history || []), { time: now, price }].slice(-30);
    return {
      ...stock,
      price,
      previousClose,
      history
    };
  });
  return db;
}

function calculatePortfolio(db, userId) {
  const holdings = db.holdings.filter((item) => item.userId === userId).map((holding) => {
    const stock = findStock(db, holding.stockSymbol);
    const currentPrice = stock ? stock.price : holding.currentPrice || holding.averageBuyPrice;
    const currentValue = Number((holding.quantity * currentPrice).toFixed(2));
    const totalInvestment = Number((holding.quantity * holding.averageBuyPrice).toFixed(2));
    const profitLoss = Number((currentValue - totalInvestment).toFixed(2));
    const dayChange = stock ? Number(((currentPrice - (stock.previousClose || currentPrice)) * holding.quantity).toFixed(2)) : 0;

    return {
      ...holding,
      companyName: stock?.companyName || holding.companyName,
      currentPrice,
      currentValue,
      totalInvestment,
      profitLoss,
      dayChange
    };
  });

  const totalInvestment = holdings.reduce((sum, item) => sum + item.totalInvestment, 0);
  const portfolioValue = holdings.reduce((sum, item) => sum + item.currentValue, 0);
  const overallProfitLoss = Number((portfolioValue - totalInvestment).toFixed(2));
  const todayProfitLoss = Number(holdings.reduce((sum, item) => sum + item.dayChange, 0).toFixed(2));
  const user = db.users.find((item) => item.id === userId);
  const balance = user ? Number(user.balance.toFixed(2)) : 0;

  const historyByIndex = [];
  const maxLength = Math.max(...holdings.map((item) => {
    const stock = findStock(db, item.stockSymbol);
    return stock?.history?.length || 0;
  }), 0);

  for (let i = Math.max(0, maxLength - 10); i < maxLength; i += 1) {
    const value = holdings.reduce((sum, item) => {
      const stock = findStock(db, item.stockSymbol);
      const point = stock?.history?.[i];
      const price = point ? point.price : item.currentPrice;
      return sum + (item.quantity * price);
    }, 0);
    historyByIndex.push(Number(value.toFixed(2)));
  }

  return {
    balance,
    holdings,
    totalInvestment: Number(totalInvestment.toFixed(2)),
    portfolioValue: Number(portfolioValue.toFixed(2)),
    overallProfitLoss,
    todayProfitLoss,
    history: historyByIndex
  };
}

module.exports = {
  dataFile,
  readDb,
  writeDb,
  nextId,
  sanitizeUser,
  findStock,
  tickMarket,
  calculatePortfolio
};
