const fs = require('fs');
const path = require('path');

// Ensure root and backend logs directory exists before PM2 opens log descriptors
const rootDir = __dirname;
const logsDir = path.resolve(rootDir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

module.exports = {
  apps: [
    {
      name: "kangpack-backend",
      cwd: path.resolve(rootDir, "backend"),
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      min_uptime: "10s",
      max_restarts: 20,
      restart_delay: 5000,
      max_memory_restart: "350M",
      time: true,
      error_file: path.resolve(logsDir, "backend-error.log"),
      out_file: path.resolve(logsDir, "backend-out.log"),
      env: {
        NODE_ENV: "production",
        PORT: 8000
      }
    },
    {
      name: "kangpack-frontend",
      cwd: path.resolve(rootDir, "frontend/.next/standalone"),
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      min_uptime: "10s",
      max_restarts: 20,
      restart_delay: 5000,
      max_memory_restart: "600M",
      time: true,
      error_file: path.resolve(logsDir, "frontend-error.log"),
      out_file: path.resolve(logsDir, "frontend-out.log"),
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
};