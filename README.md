# Kangpack - Fullstack E-Commerce Platform

This is a single-vendor e-commerce platform consisting of two main sub-projects:
- **[backend](file:///e:/workspace/Ecommerce%20Platform/kanpack/backend)**: Express/NodeJS server with TypeScript and MongoDB.
- **[frontend](file:///e:/workspace/Ecommerce%20Platform/kanpack/frontend)**: Next.js frontend with Tailwind CSS and React Query.

---

## 🚀 Getting Started

To simplify development and deployment, we have provided unified runner scripts in the root directory.

### Running with Git Bash, WSL, or Linux

You can use the bash script `run.sh`:

```bash
# Start both projects in development mode (with hot reloading and log aggregation)
./run.sh

# Install all dependencies for both backend and frontend
./run.sh install

# Build both projects for production
./run.sh build

# Start both projects in production mode (uses PM2 if installed, otherwise manual execution)
./run.sh prod

# Show help menu
./run.sh help
```

### Running with Windows PowerShell

You can use the PowerShell script `run.ps1` natively on Windows:

```powershell
# Start both projects in development mode (with log aggregation)
.\run.ps1

# Install dependencies for both projects
.\run.ps1 install

# Build both projects
.\run.ps1 build

# Start both projects in production mode
.\run.ps1 prod

# Show help menu
.\run.ps1 help
```

---

## 📁 Project Structure

- **`/backend`**:
  - `npm run dev`: Start development API server with TypeScript compilation on-the-fly (`ts-node-dev`).
  - `npm run build`: Compile TypeScript into production-ready JavaScript (`dist/`).
  - `npm run start`: Run production-compiled server.
- **`/frontend`**:
  - `npm run dev`: Start Next.js development server.
  - `npm run build`: Build Next.js app for production.
  - `npm run start`: Run Next.js production server.
- **`ecosystem.config.js`**: PM2 production process configuration.
