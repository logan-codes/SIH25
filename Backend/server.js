import express from "express";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import { blockchainService } from "./Services/blockchain.js";
import apiRoutes from "./Routes/api.js";
import contactRoutes from "./Routes/contacts.js";
import testRoutes from "./Routes/test.js";
import authRoutes from "./Routes/auth.js";

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/contact", contactRoutes);
app.use("/test", testRoutes);

app.get("/api/test", async (req, res) => {
  return res.json({ message: "Test endpoint hit successfully" });
});

const PORT = 3001;

// Start the server and deploy contract
async function startServer() {
  try {
    console.log("Starting server...");
    console.log("Deploying contract...");
    // Deploy to localhost network to match server connection
    const { spawn } = await import("child_process");
    await new Promise((resolve, reject) => {
      const deployProcess = spawn(
        "npx",
        ["hardhat", "run", "Services/deploy.js", "--network", "localhost"],
        {
          stdio: "inherit",
          shell: true,
        }
      );
      deployProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Deployment failed with code ${code}`));
        }
      });
    });
    console.log("Contract deployed successfully");

    // Read the contract address
    const contractInfo = JSON.parse(
      fs.readFileSync("./contract-address.json", "utf8")
    );
    console.log("Contract address:", contractInfo.address);
    console.log("Contract owner:", contractInfo.owner);

    // Waiting a moment for the deployment to fully settle
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Connect to blockchain service
    console.log("Connecting to blockchain service...");
    const connected = await blockchainService.connect();
    if (!connected) {
      throw new Error("Failed to connect to blockchain service");
    }

    // Verify ownership
    const isOwner = await blockchainService.isOwner();
    console.log("Is owner:", isOwner);

    if (!isOwner) {
      console.warn(
        "Warning: Server is not the contract owner. Certificate issuance may fail."
      );
    }

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
      console.log("Ready to issue and verify certificates!");
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
