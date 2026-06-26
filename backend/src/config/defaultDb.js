const seedStocks = require("./seedStocks");

function createHistory(price) {
  return Array.from({ length: 20 }, (_, index) => {
    const drift = 1 + (index - 10) * 0.0025;
    return {
      time: Date.now() - (19 - index) * 60 * 60 * 1000,
      price: Math.max(1, Number((price * drift).toFixed(2)))
    };
  });
}

module.exports = function createDefaultDb() {
  return {
    users: [],
    holdings: [],
    transactions: [],
    watchlist: [],
    stocks: seedStocks.map((stock) => {
      const price = Number((stock.basePrice * (0.985 + Math.random() * 0.03)).toFixed(2));
      return {
        ...stock,
        price,
        previousClose: Number((price / (0.995 + Math.random() * 0.01)).toFixed(2)),
        history: createHistory(price)
      };
    })
  };
};
