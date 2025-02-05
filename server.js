
import express from 'express';
import multer from 'multer';
import { create } from 'kubo-rpc-client';
import config from './config.js';
import mime from 'mime-types';


const app = express();
const ipfs = create(config.ipfs);


const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }
  
    if (!config.api.keys.includes(apiKey)) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
  
    next();
};
  

app.use(apiKeyAuth);


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.upload.maxFileSize }
});


app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.server.cors.allowedOrigins.join(','));
  res.header('Access-Control-Allow-Headers', config.server.cors.allowedHeaders.join(','));
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(413).json({ error: 'File too large' });
  }
  next(err);
});


const validateFile = (file) => {
  const ext = file.originalname.split('.').pop().toLowerCase();
  return config.upload.allowedExtensions.includes(ext) && 
         config.upload.allowedMimeTypes[file.mimetype];
};

// Enhanced pinning with retries and existence check
const pinWithRetry = async (cid, retries = config.pinning.retries) => {
  try {
    // Check existing pins
    const pins = await ipfs.pin.ls({ paths: cid });
    if (pins) return true;
  } catch (error) {
    // CID not pinned yet
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await ipfs.pin.add(cid);
      return true;
    } catch (error) {
      if (attempt === retries) {
        console.error(`Pinning failed after ${retries} attempts:`, error);
        return false;
      }
      await new Promise(resolve => 
        setTimeout(resolve, config.pinning.retryDelay * attempt)
      );
    }
  }
  return false;
};

// Routes
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!validateFile(req.file)) {
      return res.status(400).json({ 
        error: 'Invalid file type',
        allowedTypes: config.upload.allowedExtensions
      });
    }

    const addResult = await ipfs.add({
      content: req.file.buffer,
      path: req.file.originalname
    });
    
    const pinSuccess = await pinWithRetry(addResult.cid);
    
    res.json({
      cid: addResult.cid.toString(),
      name: req.file.originalname,
      size: req.file.size,
      pinned: pinSuccess,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/upload-multiple', upload.array('files'), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const invalidFiles = req.files.filter(f => !validateFile(f));
    if (invalidFiles.length) {
      return res.status(400).json({
        error: 'Invalid file types',
        allowedTypes: config.upload.allowedExtensions,
        invalidFiles: invalidFiles.map(f => f.originalname)
      });
    }

    const results = await Promise.all(
      req.files.map(async file => {
        const addResult = await ipfs.add({
          content: file.buffer,
          path: file.originalname
        });
        
        const pinSuccess = await pinWithRetry(addResult.cid);
        
        return {
          cid: addResult.cid.toString(),
          name: file.originalname,
          size: file.size,
          pinned: pinSuccess
        };
      })
    );

    res.json(results.map(result => ({
      ...result,
    })));
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/file/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      
      const stats = await ipfs.files.stat(`/ipfs/${cid}`);
  
      if (stats.type !== 'file') {
        return res.status(400).json({ error: 'Requested CID is not a file' });
      }
  
      
      const filename = stats.name || `file_${cid}`;
      const extParts = filename.split('.');
      const ext = extParts.length > 1 ? extParts.pop() : 'bin';
  
      
      const mimeType = mime.lookup(ext) || 'application/octet-stream';
  
      const content = [];
      for await (const chunk of ipfs.cat(cid)) {
        content.push(chunk);
      }
      
      const buffer = Buffer.concat(content);
  
      res.set({
        'Content-Type': mimeType,
        'Content-Length': buffer.length,
        'Content-Disposition': `attachment; filename="${filename}"`
      });
      
      res.send(buffer);
  
    } catch (error) {
      console.error('Download error:', error);
      
      if (error.message.includes('no such file')) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      if (error.message.includes('Not a file')) {
        return res.status(400).json({ error: 'Requested CID is not a file' });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
  console.log(`IPFS node: ${config.ipfs.url}`);
  console.log(`Allowed file types: ${config.upload.allowedExtensions.join(', ')}`);
});