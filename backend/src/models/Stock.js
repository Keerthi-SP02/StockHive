const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true },
    companyName: { type: String, required: true },
    logo: { type: String, default: "" },
    sector: { type: String, default: "" },
    marketCap: { type: String, default: "" },
    basePrice: { type: Number, required: true },
    price: { type: Number, required: true },
    previousClose: { type: Number, required: true },
    history: [
      {
        time: Number,
        price: Number
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
