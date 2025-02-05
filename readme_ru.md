# IPFS File Uploader Service

Сервис для безопасной загрузки файлов в IPFS с автоматическим закреплением и проверкой содержимого.

## 📋 Содержание

- [Возможности](#-features)
- [Требования](#-requirements)
- [🚀 Быстрый старт](#-quick-start)
- [Установка](#installation)
- [Конфигурация](#configuration)
- [Запуск](#launch)
- [📡 Конечные точки API](#-api-endpoints)
- [🛠 Использование](#-usage)
- [🚨 Ошибки](#-errors)
- [📄 Лицензия](#-license)

## 🌟 Возможности

- Загрузка одного и нескольких файлов
- Проверка типа и размера файла
- Автоматическое закрепление IPFS
- Повторные попытки при ошибках закрепления
- Поддержка CORS
- Генерация шлюзовых ссылок

## ⚙ Требования

- Node.js v18+
- IPFS узел (Kubo RPC) с доступом API
- npm 7+

## 🚀 Быстрый старт

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/PortalCharge/portalcharge-storage.git
cd portalcharge-storage

# 2. Установите зависимости
npm install

# 3. Настройте узел IPFS
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'

```

### Конфигурация

Откройте config.js

```
api: {
keys: ['SECRET_KEY_1', 'SECRET_KEY_2']
},
ipfs: {
url: 'http://localhost:5001'
},
upload: {
maxFileSize: 10 * 1024 * 1024, // 10 МБ
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
retryDelay: 1000 // 1 секунда
}

```

Установите свой узел URL ipfs и добавьте свои ключи API

### Запуск

Просто запустите

```
npm start
```

### 📡 Конечные точки API

POST /upload
Загрузить один файл

Параметры:

* file: Файл для загрузки

POST /upload-multiple
Загрузить несколько files
Параметры:

* files: Массив файлов

### Использование

```
# Один файл
curl -X POST -F "file=@document.pdf" http://localhost:3000/upload

# Множественная загрузка
curl -X POST -F "files=@image1.jpg" -F "files=@image2.png" http://localhost:3000/upload-multiple
```

### 🚨 Ошибки

| Код | Сообщение |
| ------ | ------------------ |
| 400 | Файл не загружен |
| 400 | Недопустимый тип файла |
| 413 | Файл слишком большой |
| 500 | Внутренняя ошибка сервера |

# Лицензия

GNU GENERAL PUBLIC LICENSE
Версия 3, 29 июня 2007 г.

Авторские права (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
Каждому разрешено копировать и распространять дословные копии
этого лицензионного документа, но изменять его запрещено.