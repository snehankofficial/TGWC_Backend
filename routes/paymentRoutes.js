import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

const router = express.Router();

// Function to get Razorpay instance
function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured in environment variables");
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { totalAmount, customerName, email, phone, address, cartItems } = req.body;

    // Validate inputs
    if (!totalAmount || !customerName || !email || !phone || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Log for debugging
    console.log("Creating order with amount:", totalAmount);
    console.log("Razorpay Key ID env:", process.env.RAZORPAY_KEY_ID ? "✓ Present" : "✗ Missing");
    console.log("Razorpay Secret env:", process.env.RAZORPAY_KEY_SECRET ? "✓ Present" : "✗ Missing");

    // Check if credentials are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay credentials not configured");
      return res.status(500).json({ 
        success: false, 
        message: "Payment gateway not configured. Missing Razorpay credentials." 
      });
    }

    // Convert amount to paise (Razorpay accepts paise, not rupees)
    const amountInPaise = Math.round(totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    console.log("Order options:", options);

    // Initialize Razorpay with current environment variables
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Store order details temporarily (you may want to store in DB)
    res.json({
      success: true,
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ 
      success: false, 
      message: `Error creating order: ${error.message}` 
    });
  }
});

// Verify Payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerName, email, phone, address, cartItems } = req.body;

    // Validate secret is available
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret key not configured");
      return res.status(500).json({ 
        success: false, 
        message: "Payment verification failed - server configuration error" 
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Verifying payment signature...");
    console.log("Expected:", expectedSignature);
    console.log("Received:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.warn("Signature mismatch - payment verification failed");
      return res.status(400).json({ 
        success: false, 
        message: "Payment verification failed - signature mismatch" 
      });
    }

    console.log("Signature verified successfully!");

    // Payment verified, save order to database
    const newOrder = new Order({
      products: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      customerName,
      email,
      phone,
      address
    });

    await newOrder.save();

    console.log("Order saved with ID:", newOrder._id);

    // Send confirmation email
    const emailSent = await sendOrderConfirmationEmail({
      email,
      customerName,
      orderId: newOrder._id,
      razorpayPaymentId: razorpay_payment_id,
      totalAmount: newOrder.totalAmount,
      cartItems
    });

    res.json({
      success: true,
      message: "Payment verified and order created",
      orderId: newOrder._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      emailSent: emailSent
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ 
      success: false, 
      message: `Error verifying payment: ${error.message}` 
    });
  }
});

// Get Order Status
router.get("/order-status/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("products.productId");
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching order" 
    });
  }
});

export default router;
