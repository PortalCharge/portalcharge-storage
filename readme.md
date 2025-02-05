# IPFS File Uploader Service

A service for securely uploading files to IPFS with automatic content pinning and validation.

## 📋 Contents

- [Features](#-features)
- [Requirements](#-requirements)
- [🚀 Quick Start](#-quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Launch](#launch)
- [📡 API Endpoints](#-api-endpoints)
- [🛠 Usage](#-usage)
- [🚨 Errors](#-errors)
- [📄 License](#-license)

## 🌟 Features

- Single and multiple file uploads
- File type and size validation
- Automatic IPFS pinning
- Retries on pinning errors
- CORS support
- Generate gateway-links

## ⚙ Requirements

- Node.js v18+
- IPFS node (Kubo RPC) with API access
- npm 7+

## 🚀 Quick start

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/PortalCharge/portalcharge-storage.git
cd portalcharge-storage

# 2. Install dependencies
npm install

# 3. Configure the IPFS node
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

```

### Configuration

Open config.js

```
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

```

Set your ipfs url node and add your api keys

### Launch

Just run

```
npm start
```

### 📡 API endpoints

POST /upload
Upload a single file

Parameters:

* file: File to upload

POST /upload-multiple
Upload multiple files
Parameters:

* files: Array of files

### Usage

```
# Single file
curl -X POST -F "file=@document.pdf" http://localhost:3000/upload

# Multiple upload
curl -X POST -F "files=@image1.jpg" -F "files=@image2.png" http://localhost:3000/upload-multiple
```

### 🚨 Errors


| Code | Mesage           |
| ------ | ------------------ |
| 400  | No file uploaded |
| 400  | Invalid file type |
| 413  | File too large	|
| 500  | Internal server error |

# License

                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.
