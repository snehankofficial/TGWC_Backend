import express from "express";
import { Order } from "../models/Order.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { products, totalAmount, customerName, phone, address } = req.body;

  const order = new Order({
    orderId: uuidv4(),
    products,
    totalAmount,
    customerName,
    phone,
    address
  });

  await order.save();

  res.json({
    message: "Order placed successfully",
    orderId: order.orderId
  });
});

export default router;