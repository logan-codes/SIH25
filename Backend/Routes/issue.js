import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { MemoryBlockstore } from 'blockstore-core/memory';
import { importer } from 'ipfs-unixfs-importer';
import { sha256 } from 'multiformats/hashes/sha2';
import QRCode from 'qrcode';
import { blockchainService } from '../Services/blockchain.js';
import { authenticateToken, authorizeRole } from '../Middleware/auth.js';

const router= express.Router();

router.use(cors());
router.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const issueDir = path.join(__dirname, 'filebase/issue');
if (!fs.existsSync(issueDir)) {
  fs.mkdirSync(issueDir, { recursive: true });
}

const issueUpload = multer({ dest: issueDir });

router.post('/', authenticateToken, issueUpload.single('file'), async (req, res) => {
  // Generating the certificate ID based on the time of request
  const certificateId = `CERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  // CID output structure
  const opts = {
    cidVersion: 1,
    rawLeaves: true,
    hasher: sha256
  };
  try {
    console.log('Issue request:', req.body);
    const { recipient, issuer} = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // implementing CID hashing algo
    const content = fs.createReadStream(file.path);
    const source = [{ path: file.path, content }];
    const blockstore = new MemoryBlockstore();
    var fileHash = "";
    for await (const entry of importer(source, blockstore, opts)) {
      fileHash = entry.cid.toString();
    }

    console.log(`File uploaded: ${file.originalname}, Hash: ${fileHash}`);
    // Move file to permanent location with hash as filename (no overwrite for issue)
    const filePath = path.join(issueDir, fileHash + path.extname(file.originalname));
    
    // Check if file already exists (prevent overwrite for issue)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(file.path); // Clean up temp file
      return res.status(409).json({ 
        error: 'Certificate with this content already exists',
        success: false,
        details: 'A certificate with identical content has already been issued'
      });
    }
    
    fs.copyFileSync(file.path, filePath, fs.constants.COPYFILE_EXCL);
    fs.unlinkSync(file.path); 
    const txHash = await blockchainService.issueCertificate(
          recipient,
          issuer,
          fileHash,
          new Date().toISOString()
        );
    const payload = "http://localhost:5173/verify?fileH="+ fileHash;
    // Generate QR code
    const qr = await QRCode.toDataURL(payload);
    res.json({ 
        success: true, 
        fileHash: fileHash,
        recipient: recipient, 
        issuer: issuer, 
        issued_on: new Date().toISOString(),
        qr:qr, 
        link:payload, 
    });
    console.log('QR code generated:', payload);
  } catch (err) {
    console.error('Issuing error:', err);
    
    // Handle different types of errors
    if (err.message.includes('Not connected to blockchain')) {
      return res.status(503).json({ 
        error: 'Blockchain service unavailable',
        success: false 
      });
    }
    
    if (err.message.includes('Failed to issue certificate')) {
      return res.status(500).json({ 
        error: 'Failed to issue certificate on blockchain',
        success: false,
        details: err.message
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error during certificate issuance',
      success: false,
      details: err.message
    });
  }
});

export default router;