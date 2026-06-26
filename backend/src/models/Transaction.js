const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stockSymbol: { type: String, required: true, uppercase: true },
    companyName: { type: String, required: true },
    type: { type: String, enum: ["BUY", "SELL"], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "COMPLETED" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
