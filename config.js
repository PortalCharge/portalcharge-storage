export default {
    api: {
        keys: ['SECRET_KEY_1', 'SECRET_KEY_2'] 
    },
    ipfs: {
      url: 'http://localhost:5001'
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedExtensions: ['png', 'svg', 'jpg', 'pdf', 'doc', 'docx', 'zip','json'],
      allowedMimeTypes: {
        'image/png': true,
        'image/svg+xml': true,
        'image/jpeg': true,
        'application/pdf': true,
        'application/msword': true,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
        'application/zip': true,
        'application/json': true,
        'application/octet-stream': true
      }
    },
    server: {
      port: 3000,
      cors: {
        allowedOrigins: ['*'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
      }
    },
    pinning: {
      retries: 3,
      retryDelay: 1000 // 1 second
    }
  };