@echo off
REM 🚀 TGWC E-Commerce Setup Script for Windows/Local Testing
REM Run this before uploading to production

echo ================================
echo 🚀 TGWC Local Setup Script
echo ================================
echo.

REM Navigate to backend folder
echo 📁 Navigating to backend folder...
cd backend
if %errorlevel% neq 0 (
    echo ❌ backend folder not found!
    exit /b 1
)

echo ✓ In backend directory: %cd%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Please create .env file with configuration
    copy .env.production .env
    echo ✓ Created .env from .env.production template
    echo ⚠️  EDIT .env with your settings!
) else (
    echo ✓ .env file found
)
echo.

REM Show instructions
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your values
echo 2. Make sure MongoDB is running
echo 3. Run: npm run start
echo 4. Open: http://localhost:5000
echo.
echo 📧 For email testing:
echo - Use your Gmail app password in .env
echo - Check console output for email sending status
echo.
pause
