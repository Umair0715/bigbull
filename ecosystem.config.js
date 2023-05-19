module.exports = { apps: [ { name: 'bigbull', script: 'server/server.js', 
      exec_mode: 'cluster', instances: 'max', listen_timeout: 50000, 
      wait_ready: true, env: {
        NODE_ENV: 'production', PORT: 3300 , HTTPS: true, 
        SSL_KEY: 'bigbullworld.key', SSL_CERT: 
        'bigbullworld.crt'
      }
    }
  ]
};
