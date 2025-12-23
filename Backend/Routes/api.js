import express from 'express';
import QRCode from 'qrcode';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { blockchainService } from '../Services/blockchain.js';
import { importer } from 'ipfs-unixfs-importer';
import { sha256 } from 'multiformats/hashes/sha2';
import { MemoryBlockstore } from 'blockstore-core';
import  issueRoutes from './issue.js';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use("/issue", issueRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create separate directories for issue and verify files
const verifyDir = path.join(__dirname, 'filebase/verify');


if (!fs.existsSync(verifyDir)) {
  fs.mkdirSync(verifyDir, { recursive: true });
}

const verifyUpload = multer({ dest: verifyDir });

// Endpoint to verify a certificate
router.post('/verify', (req, res) => {
  verifyUpload.single('certificate')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    }
    
    // CID output structure
    const opts = {
      cidVersion: 1,
      rawLeaves: true,
      hasher: sha256
    };
    
    try {
      console.log('Verification request body:', req.body);
      console.log('Verification request file:', req.file);
      console.log('Content-Type:', req.get('Content-Type'));
      console.log('Request headers:', req.headers);
      
      const file = req.file;
      if (!file) {
        console.log('No file found in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

    // Generate CID hash for the uploaded file
    const content = fs.createReadStream(file.path);
    const source = [{ path: file.path, content }];
    const blockstore = new MemoryBlockstore();
    var fileHash = "";
    for await (const entry of importer(source, blockstore, opts)) {
      fileHash = entry.cid.toString();
    }

    console.log(`File uploaded: ${file.originalname}, Hash: ${fileHash}`);

    // Step 1: Check blockchain for certificate existence using CID hash
    let blockchainResult = null;
    try {
      blockchainResult = await blockchainService.verifyCertificate(fileHash);
      console.log('Blockchain verification result:', blockchainResult);
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError.message);
      // Continue with AI analysis even if blockchain fails
    }
    
    // Step 2: Determine verification result
    const isAuthentic = blockchainResult !== null && blockchainResult.valid;
    
    // Step 3: Format response for frontend
    const response = {
      isAuthentic: isAuthentic,
      details: {
        fileHash: fileHash,
        recipient: blockchainResult?.recipient || 'Unknown',
        issuer: blockchainResult?.issuer || 'Unknown',
        issued_on: blockchainResult?.issued_on || 'Unknown',
      },
      checks: {
        blockchainVerification: isAuthentic,
        hashValidation: true
      },
      blockchainData: blockchainResult || null
    };

    // Optionally store verify file (allow overwrite for verify)
    const verifyFilePath = path.join(verifyDir, fileHash + path.extname(file.originalname));
    try {
      // Allow overwrite for verify files
      fs.copyFileSync(file.path, verifyFilePath);
      console.log(`Verify file stored: ${verifyFilePath}`);
    } catch (copyError) {
      console.warn('Failed to store verify file:', copyError.message);
    }
    
    // Clean up temporary file
    fs.unlinkSync(file.path);
    
    console.log('Verification completed:', response);
    res.json(response);
    
  } catch (err) {
    console.error('Verification error:', err);
    
    // Handle different types of errors
    if (err.message.includes('Not connected to blockchain')) {
      return res.status(503).json({ 
        error: 'Blockchain service unavailable',
        isAuthentic: false,
        confidence: 0,
        details: {
          fileHash: 'N/A',
          recipient: 'Unknown',
          issuer: 'Unknown',
          fileName: req.file?.originalname || 'Unknown'
        },
        checks: {
          blockchainVerification: false,
          documentIntegrity: false,
          templateMatch: false,
          hashValidation: false
        }
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error during verification',
      isAuthentic: false,
      confidence: 0,
      details: {
        fileHash: 'N/A',
        recipient: 'Unknown',
        issuer: 'Unknown',
        fileName: req.file?.originalname || 'Unknown'
      },
      checks: {
        blockchainVerification: false,
        documentIntegrity: false,
        templateMatch: false,
        hashValidation: false
      },
      errorMessage: err.message
    });
    }
  });
});


export default router;