import express from "express";
import { Product } from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ADD product (for admin)
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

export default router;