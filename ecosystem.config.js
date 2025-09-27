module.exports = {
  apps: [{
    name: 'codd-platform',
    script: 'server.js',
    cwd: '/var/www/codd-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/codd-platform-error.log',
    out_file: '/var/log/pm2/codd-platform-out.log',
    log_file: '/var/log/pm2/codd-platform.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
