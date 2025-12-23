import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

// In-memory user store (replace with database in production)
const users = ["admin", "issuer"].map((username, index) => ({
  id: (index + 1).toString(),
  username,
  password: bcrypt.hashSync('password', 10), // Default password for demo
  role: username === 'admin' ? 'admin' : 'issuer'
}));

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      role: role || 'user'
    };

    users.push(user);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

export default router;