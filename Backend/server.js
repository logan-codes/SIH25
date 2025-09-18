import express from 'express';
import QRCode from 'qrcode';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { blockchainService } from './Services/blockchain.js';
import { importer } from 'ipfs-unixfs-importer';
import { sha256 } from 'multiformats/hashes/sha2';
import { MemoryBlockstore } from 'blockstore-core';
import FormData from 'form-data';
import fetch from 'node-fetch';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Create separate directories for issue and verify files
const issueDir = path.join(__dirname, 'filebase/issue');
const verifyDir = path.join(__dirname, 'filebase/verify');

if (!fs.existsSync(issueDir)) {
  fs.mkdirSync(issueDir, { recursive: true });
}
if (!fs.existsSync(verifyDir)) {
  fs.mkdirSync(verifyDir, { recursive: true });
}

// Create separate multer instances for issue and verify
const issueUpload = multer({ dest: issueDir });
const verifyUpload = multer({ dest: verifyDir });

// Endpoint to issue a certificate
app.post('/api/issue', issueUpload.single('file'), async (req, res) => {
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
          fileHash
        );
    const payload = "http://localhost:5173/verify?certID="+ certificateId;
    // Generate QR code
    const qr = await QRCode.toDataURL(payload);
    res.json({ certID:certificateId, qr:qr, link:payload });
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

// Endpoint to verify a certificate
app.post('/api/verify', (req, res) => {
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

    // Step 1: Send file to AI API for template matching and feature extraction
    let aiResult = null;
    try {
      const aiFormData = new FormData();
      aiFormData.append('file', fs.createReadStream(file.path), file.originalname);
      
      const aiResponse = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        body: aiFormData
      });
      
      if (aiResponse.ok) {
        aiResult = await aiResponse.json();
        console.log('AI Analysis Result:', aiResult);
      } else {
        console.warn('AI API not available, proceeding with blockchain verification only');
      }
    } catch (aiError) {
      console.warn('AI API error:', aiError.message);
    }

    // Step 2: Check blockchain for certificate existence using CID hash
    let blockchainResult = null;
    try {
      blockchainResult = await blockchainService.verifyCertificate(fileHash);
      console.log('Blockchain verification result:', blockchainResult);
    } catch (blockchainError) {
      console.error('Blockchain verification error:', blockchainError.message);
      // Continue with AI analysis even if blockchain fails
    }
    
    // Step 3: Determine verification result
    const isAuthentic = blockchainResult !== null && blockchainResult.valid;
    const confidence = aiResult ? aiResult.score : (isAuthentic ? 100 : 0);
    
    // Step 4: Format response for frontend
    const response = {
      isAuthentic: isAuthentic,
      confidence: confidence,
      details: {
        fileHash: fileHash,
        recipient: blockchainResult?.recipient || 'Unknown',
        issuer: blockchainResult?.issued_by || 'Unknown',
        fileName: file.originalname,
        ...(aiResult?.keyFeatures || {})
      },
      checks: {
        blockchainVerification: isAuthentic,
        documentIntegrity: aiResult ? aiResult.score > 70 : false,
        templateMatch: aiResult ? aiResult.score > 80 : false,
        hashValidation: true
      },
      aiAnalysis: aiResult || null,
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

app.get('/api/test', async (req, res) => {
  return res.json({ message: 'Test endpoint hit successfully' });
});

// Debug endpoint to test file upload
app.post('/api/debug-upload', verifyUpload.single('certificate'), (req, res) => {
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

// Test endpoint to verify the AI API connection
app.get('/api/test-ai', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5000/api/match', {
      method: 'POST',
      body: new FormData() // Empty form data for testing
    });
    
    if (response.ok) {
      res.json({ 
        message: 'AI API is accessible',
        status: 'connected'
      });
    } else {
      res.json({ 
        message: 'AI API returned error',
        status: 'error',
        statusCode: response.status
      });
    }
  } catch (error) {
    res.json({ 
      message: 'AI API not accessible',
      status: 'disconnected',
      error: error.message
    });
  }
});



const PORT = 3001;

// Start the server and deploy contract
async function startServer() {
  try {
    console.log('Starting server...');
    console.log('Deploying contract...');
     // Deploy to localhost network to match server connection
     const { spawn } = await import('child_process');
    await new Promise((resolve, reject) => {
      const deployProcess = spawn('npx', ['hardhat', 'run', 'Services/deploy.js', '--network', 'localhost'], {
        stdio: 'inherit',
        shell: true
      });
      deployProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Deployment failed with code ${code}`));
        }
      });
    });
    console.log('Contract deployed successfully');
    
    // Read the contract address
    const contractInfo = JSON.parse(fs.readFileSync('./contract-address.json', 'utf8'));
    console.log('Contract address:', contractInfo.address);
    console.log('Contract owner:', contractInfo.owner);
    
    // Waiting a moment for the deployment to fully settle
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Connect to blockchain service
    console.log('Connecting to blockchain service...');
    const connected = await blockchainService.connect();
    if (!connected) {
      throw new Error('Failed to connect to blockchain service');
    }
    
    // Verify ownership
    const isOwner = await blockchainService.isOwner();
    console.log("Is owner:", isOwner);
    
    if (!isOwner) {
      console.warn('Warning: Server is not the contract owner. Certificate issuance may fail.');
    }
    
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log('Ready to issue and verify certificates!');
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
