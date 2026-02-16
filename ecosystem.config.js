module.exports = {
  apps: [
    {
      name: "kangpack-backend",
      script: "backend/dist/server.js",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
  name: "kangpack-frontend",
  script: "frontend/.next/standalone/server.js", // Direct path
  env: {
    NODE_ENV: "production",
    PORT: 3000
  }
}
  ]
};
