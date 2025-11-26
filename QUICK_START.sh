#!/bin/bash

echo "🚀 Ghost Commit - Quick Start"
echo "=============================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and add your Stack Auth credentials:"
    echo "   - NEXT_PUBLIC_STACK_PROJECT_ID"
    echo "   - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY"
    echo "   - STACK_SECRET_SERVER_KEY"
    echo ""
    echo "Get your credentials from: https://app.stack-auth.com"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Stack Auth credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "Good luck at the hackathon! 🏆"
