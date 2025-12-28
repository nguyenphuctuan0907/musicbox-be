// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'musicbox-api',
      cwd: './src',
      script: 'dist/src/main.js',
    },
    {
      name: 'zalo-bot',
      cwd: './zalo-bot',
      script: 'dist/zalo-bot/server.js',
    },
  ],
};
