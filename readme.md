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
- [🧪 Testing](#-testing)
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
git clone https://github.com/your-repo/ipfs-file-uploader.git
cd ipfs-file-uploader

# 2. Install dependencies
npm install

# 3. Configure the IPFS node
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

```