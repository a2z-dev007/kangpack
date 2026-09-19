module.exports = {
  apps: [
    {
      name: "kangpack-backend",

      cwd: "/var/www/kangpack/backend",
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

      error_file: "/var/www/kangpack/logs/backend-error.log",
      out_file: "/var/www/kangpack/logs/backend-out.log",

      env: {
        NODE_ENV: "production",
        PORT: 8000
      }
    },

    {
      name: "kangpack-frontend",

      cwd: "/var/www/kangpack/frontend/.next/standalone",
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

      error_file: "/var/www/kangpack/logs/frontend-error.log",
      out_file: "/var/www/kangpack/logs/frontend-out.log",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
};