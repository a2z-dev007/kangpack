module.exports = {
  apps: [
    {
      name: "kangpack-backend",
      cwd: "backend",
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: "350M",
      watch: false,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 8000
      },
      error_file: "logs/backend-error.log",
      out_file: "logs/backend-out.log",
      merge_logs: true
    },
    {
      name: "kangpack-frontend",
      cwd: "frontend/.next/standalone",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
      max_memory_restart: "600M",
      watch: false,
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      },
      error_file: "../../../logs/frontend-error.log",
      out_file: "../../../logs/frontend-out.log",
      merge_logs: true
    }
  ]
};