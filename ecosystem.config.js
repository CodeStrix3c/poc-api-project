module.exports = {
  apps: [
    {
      name: "discussion-forum-api",
      script: "server-refactored.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
