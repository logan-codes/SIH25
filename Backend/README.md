# Authenticity Validator Backend

This is the backend for the Authenticity Validator project. It handles blockchain interactions, certificate storage, and machine learning-based document verification.

## Features

- Solidity smart contract for certificate registry
- Node.js server for API endpoints
- Python ML model for document verification
- File storage for issued and verified certificates

## Project Structure

```
Contracts/          # Solidity smart contracts
  CertificateRegistry.sol
Model/              # Python ML model and scripts
  app.py
  requirements.txt
  uploads/
Services/           # Blockchain interaction scripts
  blockchain.js
  deploy.js
artifacts/          # Compiled contract artifacts (auto-generated)
cache/              # Hardhat cache (auto-generated)
filebase/           # Stored certificate files
server.js           # Main Node.js backend server
hardhat.config.cjs  # Hardhat configuration
contract-address.json # Deployed contract address
```

## Getting Started

### 1. Install Node.js Dependencies

```sh
npm install
```

### 2. Install Python Dependencies

```sh
cd Model
pip install -r requirements.txt
```

### 3. Compile and Deploy Smart Contracts

```sh
npx hardhat compile
npx hardhat run Services/deploy.js --network <network>
```

### 4. Run the Backend Server

```sh
node server.js
```

### 5. Run the Python ML Model (if separate)

```sh
cd Model
python app.py
```

## Notes

- Update `contract-address.json` after deploying contracts.
- Ensure the backend server can communicate with the Python ML service (via HTTP or other IPC).
- Store sensitive keys and configuration in environment variables (not in code).

---

## License

MIT