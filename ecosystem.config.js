module.exports = {
  apps: [
    {
      name: "kangpack-backend",
      script: "dist/server.js", // path is relative to cwd
      cwd: "backend",          // Explicitly set the folder
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "kangpack-frontend",
      script: ".next/standalone/server.js", // path is relative to cwd
      cwd: "frontend",                      // Explicitly set the folder
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};