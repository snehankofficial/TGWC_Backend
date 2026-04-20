#!/bin/bash

# 🚀 TGWC E-Commerce Setup Script for MilesWeb
# Run this script on the server via SSH after uploading files

echo "================================"
echo "🚀 TGWC Setup Script"
echo "================================"
echo ""

# Navigate to backend folder
echo "📁 Navigating to backend folder..."
cd backend || { echo "❌ backend folder not found!"; exit 1; }

echo "✓ In backend directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please copy .env.production to .env and update MongoDB URI"
    cp .env.production .env
    echo "✓ Created .env from .env.production template"
    echo "⚠️  EDIT .env with your MongoDB Atlas connection string!"
else
    echo "✓ .env file found"
fi
echo ""

# Install PM2 globally
echo "⚙️  Installing PM2 (process manager)..."
npm install -g pm2

if [ $? -eq 0 ]; then
    echo "✓ PM2 installed successfully"
else
    echo "❌ Failed to install PM2"
fi
echo ""

# Start application with PM2
echo "🚀 Starting Node.js application..."
pm2 start index.js --name "tgwc-api" --env production

if [ $? -eq 0 ]; then
    echo "✓ Application started successfully"
else
    echo "❌ Failed to start application"
    exit 1
fi
echo ""

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 startup
pm2 save
echo "✓ PM2 saved (will auto-restart on server reboot)"
echo ""

# Display status
echo "📊 Application Status:"
pm2 status
echo ""

# Show logs
echo "📝 Recent logs (Ctrl+C to exit):"
pm2 logs tgwc-api --lines 20

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next steps:"
echo "1. Verify MongoDB URI in .env"
echo "2. Check application logs: pm2 logs tgwc-api"
echo "3. Test API: curl https://gmrwater.com/api/products"
echo "4. Monitor: pm2 monit"
echo ""
