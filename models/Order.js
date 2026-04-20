import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  totalAmount: Number,
  customerName: String,
  email: String,
  phone: String,
  address: String,
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);