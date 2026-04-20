import nodemailer from "nodemailer";

// Create email transporter
let transporter;

export function initializeEmailService() {
  try {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log("✓ Email service initialized successfully");
    return true;
  } catch (error) {
    console.error("✗ Failed to initialize email service:", error.message);
    return false;
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderData) {
  try {
    if (!transporter) {
      console.warn("Email service not initialized");
      return false;
    }

    const { email, customerName, orderId, razorpayPaymentId, totalAmount, cartItems } = orderData;

    // Create product list HTML
    const productsList = cartItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
          .header { background: #0d6b3e; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: white; padding: 20px; }
          .footer { background: #f0f0f0; padding: 15px; border-radius: 0 0 5px 5px; font-size: 12px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; }
          .order-summary { background: #f9f9f9; padding: 15px; border-left: 4px solid #0d6b3e; margin: 20px 0; }
          .total { font-size: 18px; font-weight: bold; color: #0d6b3e; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            
            <p>Your order has been successfully placed and payment has been received. We're excited to get your order ready!</p>
            
            <div class="order-summary">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
            
            <h3>Items Ordered:</h3>
            <table>
              <thead>
                <tr style="background: #f0f0f0;">
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productsList}
              </tbody>
            </table>
            
            <div class="total">
              Total Amount: ₹${totalAmount.toFixed(2)}
            </div>
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>What's Next?</strong><br>
              Your order will be processed and shipped soon. You'll receive a tracking number via email once it ships.
            </p>
            
            <p>If you have any questions, feel free to reply to this email or contact us at support@tgwc.com</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The Green Water Company (TGWC) Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2026 The Green Water Company. All rights reserved.</p>
            <p>This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmation #${orderId} - TGWC Shop`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Confirmation email sent to ${email}`);
    return true;

  } catch (error) {
    console.error("✗ Error sending email:", error.message);
    return false;
  }
}
