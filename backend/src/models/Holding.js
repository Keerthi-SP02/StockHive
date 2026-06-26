const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stockSymbol: { type: String, required: true, uppercase: true },
    companyName: { type: String, required: true },
    quantity: { type: Number, required: true },
    averageBuyPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Holding", holdingSchema);
