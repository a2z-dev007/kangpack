#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Color codes for output styling
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Root directory of the project
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo -e "${BOLD}${CYAN}====================================================${NC}"
echo -e "${BOLD}${CYAN}   🚀 Kangpack - Fullstack Launcher Script 🚀   ${NC}"
echo -e "${BOLD}${CYAN}====================================================${NC}"

# Parse commands
MODE="dev"
if [ "$1" == "prod" ] || [ "$1" == "--prod" ]; then
    MODE="prod"
elif [ "$1" == "install" ] || [ "$1" == "--install" ]; then
    MODE="install"
elif [ "$1" == "build" ] || [ "$1" == "--build" ]; then
    MODE="build"
elif [ "$1" == "help" ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev (default)   Start both backend and frontend in development mode"
    echo "  prod            Start both in production mode"
    echo "  install         Install dependencies in both backend and frontend"
    echo "  build           Build both projects"
    echo "  help            Show this help menu"
    exit 0
fi

# 1. Prerequisite checks
echo -e "\n${BOLD}${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install Node.js (v18+) to run this project.${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js: $(node -v)"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed.${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} npm: $(npm -v)"

# Action implementation based on selected mode
if [ "$MODE" == "install" ]; then
    echo -e "\n${BOLD}${YELLOW}📦 Installing clean dependencies...${NC}"
    echo -e "${BLUE}[BACKEND] Installing backend dependencies...${NC}"
    (cd backend && npm install)
    echo -e "${GREEN}[FRONTEND] Installing frontend dependencies...${NC}"
    (cd frontend && npm install)
    echo -e "${BOLD}${GREEN}✓ Installation complete!${NC}"
    exit 0
fi

if [ "$MODE" == "build" ]; then
    echo -e "\n${BOLD}${YELLOW}🔨 Building both projects...${NC}"
    echo -e "${BLUE}[BACKEND] Building backend...${NC}"
    (cd backend && npm run build)
    echo -e "${GREEN}[FRONTEND] Building frontend...${NC}"
    (cd frontend && npm run build)
    echo -e "${BOLD}${GREEN}✓ Build complete!${NC}"
    exit 0
fi

# 2. Setup environment files if missing
echo -e "\n${BOLD}${YELLOW}⚙️ Checking configuration files...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "  ${YELLOW}⚠️  backend/.env not found. Copying from .env.example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp "backend/.env.example" "backend/.env"
        echo -e "  ${GREEN}✓ Created backend/.env. Please configure it with database credentials.${NC}"
    else
        echo -e "  ${RED}❌ Error: backend/.env.example not found. Cannot auto-create backend/.env.${NC}"
    fi
else
    echo -e "  ${GREEN}✓${NC} backend/.env exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "  ${YELLOW}⚠️  frontend/.env.local not found. Copying from .env.example...${NC}"
    if [ -f "frontend/.env.example" ]; then
        cp "frontend/.env.example" "frontend/.env.local"
        echo -e "  ${GREEN}✓ Created frontend/.env.local.${NC}"
    else
        echo -e "  ${RED}❌ Error: frontend/.env.example not found. Cannot auto-create frontend/.env.local.${NC}"
    fi
else
    echo -e "  ${GREEN}✓${NC} frontend/.env.local exists"
fi

# 3. Check and install dependencies if missing
check_and_install_deps() {
    local dir=$1
    local name=$2
    if [ ! -d "$dir/node_modules" ]; then
        echo -e "\n${YELLOW}📦 Directory $dir/node_modules not found.${NC}"
        echo -e "Installing dependencies for ${BOLD}$name${NC}... This may take a moment."
        (cd "$dir" && npm install)
        echo -e "${GREEN}✓ Dependencies for $name installed successfully.${NC}"
    else
        echo -e "  ${GREEN}✓${NC} $name dependencies already installed"
    fi
}

check_and_install_deps "backend" "Backend"
check_and_install_deps "frontend" "Frontend"

# Cleanup function to kill background processes on exit
cleanup() {
    echo -e "\n\n${BOLD}${YELLOW}🛑 Shutting down servers gracefully...${NC}"
    if [ -n "$BACKEND_PID" ]; then
        echo -e "Stopping Backend (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        echo -e "Stopping Frontend (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo -e "${BOLD}${GREEN}✨ Both servers stopped. Goodbye!${NC}"
    exit 0
}

# Trap Ctrl+C (SIGINT) and termination signals (SIGTERM)
trap cleanup SIGINT SIGTERM

if [ "$MODE" == "prod" ]; then
    # Production Launch
    if command -v pm2 &> /dev/null; then
        echo -e "\n${BOLD}${GREEN}🚀 Starting both servers with PM2 (using ecosystem.config.js)...${NC}"
        pm2 start ecosystem.config.js
        pm2 status
        echo -e "${GREEN}✓ Done. Use 'pm2 log' to view logs or 'pm2 stop' to stop them.${NC}"
        exit 0
    else
        echo -e "\n${BOLD}${YELLOW}⚠️  PM2 not found. Starting production servers manually...${NC}"
        # Check if build output exists, if not build it
        if [ ! -d "backend/dist" ]; then
            echo -e "Backend build directory (dist) not found. Building backend..."
            (cd backend && npm run build)
        fi
        if [ ! -d "frontend/.next" ]; then
            echo -e "Frontend build directory (.next) not found. Building frontend..."
            (cd frontend && npm run build)
        fi

        echo -e "\n${BOLD}${GREEN}⚡ Starting production servers concurrently...${NC}"
        echo -e "${CYAN}Press Ctrl+C to stop both servers.${NC}\n"

        echo -e "${BLUE}[BACKEND] Starting production server...${NC}"
        cd "$ROOT_DIR/backend"
        npm run start &
        BACKEND_PID=$!

        echo -e "${GREEN}[FRONTEND] Starting production server...${NC}"
        cd "$ROOT_DIR/frontend"
        npm run start &
        FRONTEND_PID=$!

        cd "$ROOT_DIR"
        
        echo -e "\n${BOLD}${GREEN}🎉 Both production servers are running!${NC}"
        echo -e "  ${BLUE}● Backend PID: $BACKEND_PID${NC}"
        echo -e "  ${GREEN}● Frontend PID: $FRONTEND_PID${NC}"
        echo -e "  ${CYAN}● Keep this terminal open to see logs.${NC}\n"

        wait "$BACKEND_PID" "$FRONTEND_PID"
    fi
else
    # Development Launch
    echo -e "\n${BOLD}${GREEN}⚡ Starting Backend and Frontend development servers concurrently...${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop both servers.${NC}\n"

    # Start Backend
    echo -e "${BLUE}[BACKEND] Starting dev server...${NC}"
    cd "$ROOT_DIR/backend"
    npm run dev &
    BACKEND_PID=$!

    # Start Frontend
    echo -e "${GREEN}[FRONTEND] Starting dev server...${NC}"
    cd "$ROOT_DIR/frontend"
    npm run dev &
    FRONTEND_PID=$!

    cd "$ROOT_DIR"

    echo -e "\n${BOLD}${GREEN}🎉 Both development servers are running!${NC}"
    echo -e "  ${BLUE}● Backend PID: $BACKEND_PID${NC}"
    echo -e "  ${GREEN}● Frontend PID: $FRONTEND_PID${NC}"
    echo -e "  ${CYAN}● Keep this terminal open to see logs.${NC}\n"

    # Wait for both processes
    wait "$BACKEND_PID" "$FRONTEND_PID"
fi
