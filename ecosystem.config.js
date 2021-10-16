module.exports = {
  apps: [
    {
      name: 'xircle-server',
      script: './dist/src/main.js',
      instances: '1',
      env: {
        NODE_ENV: 'dev',
      },
      env_production: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
