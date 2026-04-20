# Cart Checkout with Razorpay Integration - Setup Guide

## Overview
This is a complete cart checkout system with Razorpay payment integration for your TGWC e-commerce website.

## Features
✅ Shopping cart management with localStorage  
✅ Add/remove/update product quantities  
✅ Real-time cart total calculation  
✅ Razorpay payment integration  
✅ Order verification and storage  
✅ Customer information capture  

## Prerequisites
- Node.js v14+ installed
- MongoDB running locally or accessible
- Razorpay account (free sandbox account available)

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables
1. Create a `.env` file in the `backend` folder (copy from `.env.example`)
2. Add your Razorpay API keys:
   - Get them from: https://dashboard.razorpay.com/app/keys
   - Copy `Key ID` and `Key Secret`

```
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
```

### 1.3 Update Backend Code to Use .env
Update `routes/paymentRoutes.js` to load environment variables:

```javascript
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

### 1.4 Start Backend Server
```bash
npm start
```
Server will run on `http://localhost:5000`

## Step 2: Frontend Setup

### 2.1 Include Cart Script
Make sure `cart.html` includes these scripts:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="js/cart.js"></script>
```

### 2.2 API Configuration
In `cart.html`, the API URL is set to:
```javascript
const API_URL = "http://localhost:5000/api";
```
Change this if your backend runs on a different port/URL.

## Step 3: Adding Products to Cart

### From Your Shop Page
Add this functionality to your shop/product pages:

```javascript
function addToCart(productId, productName, price, imageUrl) {
    const product = {
        productId: productId,
        name: productName,
        price: parseFloat(price),
        image: imageUrl,
        quantity: 1
    };
    window.cart.addItem(product);
    alert(productName + ' added to cart!');
    // Optionally redirect to cart: window.location.href = 'cart.html';
}
```

## Step 4: API Endpoints

### Create Order
**POST** `/api/payment/create-order`
```json
{
  "totalAmount": 999.99,
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "cartItems": [
    {
      "productId": "123",
      "name": "Product",
      "price": 99.99,
      "quantity": 2
    }
  ]
}
```

### Verify Payment
**POST** `/api/payment/verify-payment`
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "address": "123 Main St, City",
  "cartItems": [...]
}
```

### Get Order Status
**GET** `/api/payment/order-status/:orderId`

## Testing with Razorpay Test Mode

### Test Card Numbers
- **Success**: 4111 1111 1111 1111
- **Any CVV and future expiry date**

### Test Credentials
- Email: any email (test@example.com)
- Phone: any 10 digit number (9999999999)

## File Structure
```
backend/
├── routes/
│   ├── paymentRoutes.js (NEW - Payment endpoints)
│   ├── productRoutes.js (Existing)
│   └── orderRoutes.js (Existing)
├── models/
│   ├── Order.js (Existing - Updated)
│   └── Product.js (Existing)
├── index.js (Updated - Added payment routes)
├── package.json (Updated - Added Razorpay)
├── .env.example (NEW)
└── .env (Create from .env.example)

new/
├── js/
│   ├── cart.js (NEW - Cart management)
│   └── load.js (Existing)
├── new/
│   ├── cart.html (Updated - Razorpay integration)
│   └── shop.html (Add products here)
└── assets/
```

## Troubleshooting

### Issue: "Razorpay is not defined"
**Solution**: Make sure Razorpay script is loaded before checkout form:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: "API call failed" or CORS error
**Solution**: 
1. Check backend is running: `npm start` in backend folder
2. Verify API_URL in cart.html matches backend URL
3. Check CORS is enabled in backend (it is by default)

### Issue: "Payment not verified"
**Solution**:
1. Check RAZORPAY_KEY_SECRET in .env file
2. Verify signature generation in backend
3. Check MongoDB connection

### Issue: Cart is empty when page reloads
**Solution**: This is normal behavior. Cart data is stored in localStorage but is cleared after successful payment.

## Production Checklist
- [ ] Update Razorpay keys (from test to live keys)
- [ ] Change API_URL to production backend URL
- [ ] Enable HTTPS for payment page
- [ ] Update MongoDB connection string
- [ ] Add proper error logging
- [ ] Add email notifications for orders
- [ ] Test with real payments on test mode first
- [ ] Set up order management dashboard

## Next Steps (Optional Enhancements)
1. **Email Notifications**: Send confirmation emails to customers
2. **Order Dashboard**: Create admin panel to manage orders
3. **Payment History**: Show user their past orders
4. **Inventory Management**: Reduce stock on successful payment
5. **Coupon System**: Add discount codes
6. **Multiple Payment Methods**: Add alternative payment gateways

## Support & Documentation
- Razorpay Docs: https://razorpay.com/docs/
- Node.js: https://nodejs.org/docs/
- MongoDB: https://docs.mongodb.com/

## License
Your project license here
