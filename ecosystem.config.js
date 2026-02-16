module.exports = {
  apps: [
    {
      name: "kangpack-backend",
      script: "backend/dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "kangpack-frontend",
      script: "npm",
      args: "start",
      cwd: "frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
