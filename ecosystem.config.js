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
      cwd: "frontend/.next/standalone", // RUN FROM INSIDE STANDALONE
      script: "server.js",               // RUN THE SERVER DIRECTLY
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1"            // Important for some EC2 setups
      }
    }
  ]
};