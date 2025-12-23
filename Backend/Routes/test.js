import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const router= express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create separate directories for issue and verify files
const issueDir = path.join(__dirname, 'filebase/issue');
const verifyDir = path.join(__dirname, 'filebase/verify');

// Create separate multer instances for issue and verify
const issueUpload = multer({ dest: issueDir });
const verifyUpload = multer({ dest: verifyDir });

// Debug endpoint to test file upload
router.post('/debug-upload', verifyUpload.single('certificate'), (req, res) => {
  console.log('Debug upload - Body:', req.body);
  console.log('Debug upload - File:', req.file);
  console.log('Debug upload - Headers:', req.headers);
  res.json({ 
    message: 'Debug upload received',
    body: req.body,
    file: req.file ? { name: req.file.originalname, size: req.file.size } : null,
    contentType: req.get('Content-Type')
  });
});

export default router;