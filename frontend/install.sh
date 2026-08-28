#!/bin/bash

# Ecommerce Frontend Installation Script
# This script automates the setup process

set -e

echo "🚀 Ecommerce Frontend Installation"
echo "===================================="
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Setup environment file
echo "⚙️  Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo ""
    echo "📝 Please update .env.local with your configuration:"
    echo "   - NEXT_PUBLIC_API_URL (your backend API URL)"
    echo "   - NEXT_PUBLIC_APP_URL (your frontend URL)"
else
    echo "ℹ️  .env.local already exists, skipping..."
fi
echo ""

# Display next steps
echo "✨ Installation complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Update .env.local with your backend API URL"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 Documentation:"
echo "   - QUICK_START.md - Quick start guide"
echo "   - SETUP.md - Detailed setup instructions"
echo "   - README.md - Full documentation"
echo ""
echo "🎉 Happy coding!"
