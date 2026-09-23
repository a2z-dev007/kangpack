#!/bin/bash
set -e

echo "=================================================="
echo "🚀 Kangpack Production Deployment"
echo "=================================================="

# Ensure Node.js, npm, and PM2 are in PATH
export PATH=$PATH:/usr/local/bin:/usr/bin:$(npm config get prefix 2>/dev/null)/bin
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
fi

PROJECT_DIR="/var/www/kangpack"
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
else
    cd "$(dirname "$0")"
fi

echo "📂 Current Directory: $(pwd)"

# 1. Pull latest code from main
echo "📥 [1/5] Pulling latest code from origin/main..."
git fetch origin main
git reset --hard origin/main
# Preserve production env files and uploads
git clean -fd -e backend/.env.production -e frontend/.env.production -e backend/uploads/

# 2. Build Backend
echo "📦 [2/5] Building Backend..."
cd backend
npm install --prefer-offline --no-audit
npm run build
mkdir -p uploads logs
cd ..

# 3. Build Frontend
echo "⚡ [3/5] Building Frontend (Next.js Standalone)..."
cd frontend
npm install --prefer-offline --no-audit
NODE_OPTIONS="--max-old-space-size=1536" npm run build

# 4. Sync Standalone Static Files
echo "📂 [4/5] Synchronizing static assets into standalone..."
mkdir -p .next/standalone/.next
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

if [ -d ".next/standalone/frontend" ]; then
    mkdir -p .next/standalone/frontend/.next
    cp -r public .next/standalone/frontend/ 2>/dev/null || true
    cp -r .next/static .next/standalone/frontend/.next/ 2>/dev/null || true
fi
cd ..

# 5. Reload PM2
echo "♻️ [5/5] Reloading PM2 services with updated environment..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js
pm2 save

echo ""
echo "🏥 Running health checks..."
sleep 3
curl -s -I http://127.0.0.1:8000/api/v1/health | head -n 1 || true
curl -s -I http://127.0.0.1:3000 | head -n 1 || true

echo ""
echo "✅ Deployment completed successfully!"
echo "=================================================="
