import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// --- 1. IMPORT ALL MODELS ---
// Make sure your model files are in a 'models' folder
import { Account } from './models/Account.js';
import { UserProfile } from './models/UserProfile.js';
import { AdminProfile } from './models/AdminProfile.js';
import { Scheme } from './models/Scheme.js';
import { Application } from './models/Application.js';

// --- 2. CONFIGURATION ---
// Loads .env variables
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoUrl: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminSecretKey: process.env.ADMIN_SECRET_KEY,
};

// --- 3. INITIALIZE EXPRESS APP ---
const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend build in production (single deployable service)
// This will look for a built frontend at ../frontend/dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDist));
  // All other routes should serve the frontend index.html
  app.get('*', (req, res, next) => {
    // If the request starts with /api, skip and let API routes handle it
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// --- 4. AUTH MIDDLEWARE ---

// Checks if *any* user is logged in
async function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.sub, type: payload.type }; // 'sub' is the user ID
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Checks if the user is an 'admin'
async function adminOnly(req, res, next) {
  if (!req.user || req.user.type !== 'admin') {
     return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

// Checks if the user is a 'user'
async function userOnly(req, res, next) {
  if (!req.user || req.user.type !== 'user') {
     return res.status(403).json({ error: 'Forbidden: User access required' });
  }
  next();
}

// --- 5. ROUTES ---

// Health Check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// --- Auth Routes ---
function signToken(account) {
  return jwt.sign({ sub: account._id.toString(), type: account.type }, config.jwtSecret, { expiresIn: '7d' });
}

app.post('/api/auth/user/signup', async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Username, phone number, and password are required.' });
    }
    const email = `${phoneNumber}@scheme.gov.in`;
    const password_hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ email, phone_number: phoneNumber, password_hash, type: 'user' });
    await UserProfile.create({ userId: account._id, username, phone_number: phoneNumber });
    res.status(201).json({ message: 'User created successfully' });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'This phone number is already registered.' });
    }
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/user/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const email = `${phoneNumber}@scheme.gov.in`;
    const account = await Account.findOne({ email, type: 'user' });
    if (!account) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, account.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(account);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/admin/signup', async (req, res) => {
  try {
    const { username, phoneNumber, password, secretKey } = req.body;
    if (secretKey !== config.adminSecretKey) {
      return res.status(401).json({ error: 'Invalid Admin Secret Key. Access denied.' });
    }
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Username, phone number, and password are required.' });
    }
    const email = `admin_${phoneNumber}@scheme.gov.in`;
    const password_hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ email, phone_number: phoneNumber, password_hash, type: 'admin' });
    await AdminProfile.create({ adminId: account._id, username, phone_number: phoneNumber });
    const token = signToken(account);
    res.json({ token });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'This admin phone number is already registered.' });
    }
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const email = `admin_${phoneNumber}@scheme.gov.in`;
    const account = await Account.findOne({ email, type: 'admin' });
    if (!account) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, account.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken(account);
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// --- Scheme Routes ---
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find({ is_active: true });
    res.json(schemes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/schemes', authRequired, adminOnly, async (req, res) => {
  try {
    const newScheme = new Scheme(req.body);
    await newScheme.save();
    res.status(201).json(newScheme);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'A scheme with this name already exists.' });
    }
    res.status(400).json({ error: e.message });
  }
});

// --- Application Routes ---
app.post('/api/applications', authRequired, userOnly, async (req, res) => {
  try {
    const { schemeId, application_data } = req.body;
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    const newApplication = new Application({
      userId: userProfile._id,
      schemeId,
      application_data,
    });
    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ error: 'You have already applied for this scheme.' });
    }
    res.status(400).json({ error: e.message });
  }
});

// --- User "Me" Routes ---
app.get('/api/me/profile', authRequired, userOnly, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/me/applications', authRequired, userOnly, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    const applications = await Application.find({ userId: userProfile._id })
      .populate('schemeId', 'name category')
      .sort({ applied_at: -1 });
    
    // Rename 'schemeId' to 'schemes' to match your frontend
    const results = applications.map(app => {
      const appObj = app.toObject();
      appObj.schemes = appObj.schemeId;
      delete appObj.schemeId;
      return appObj;
    });
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Admin Routes ---
app.get('/api/admin/profile', authRequired, adminOnly, async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ adminId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Admin profile not found' });
    }
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/applications', authRequired, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('schemeId', 'name category')
      .populate('userId', 'username phone_number')
      .sort({ applied_at: -1 });
    
    // Rename fields to match your frontend
    const results = applications.map(app => {
      const appObj = app.toObject();
      appObj.schemes = appObj.schemeId;
      appObj.user_profiles = appObj.userId;
      delete appObj.schemeId;
      delete appObj.userId;
      return appObj;
    });
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/applications/:appId/approve', authRequired, adminOnly, async (req, res) => {
  try {
    const { appId } = req.params;
    const { admin_notes } = req.body;
    const application = await Application.findByIdAndUpdate(
      appId,
      { status: 'approved', reviewed_at: new Date(), admin_notes: admin_notes || 'Approved' },
      { new: true }
    );
    res.json(application);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/applications/:appId/reject', authRequired, adminOnly, async (req, res) => {
  try {
    const { appId } = req.params;
    const { admin_notes } = req.body;
    if (!admin_notes) {
      return res.status(400).json({ error: 'Rejection notes are required' });
    }
    const application = await Application.findByIdAndUpdate(
      appId,
      { status: 'rejected', reviewed_at: new Date(), admin_notes },
      { new: true }
    );
    res.json(application);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- 6. START SERVER ---
async function start() {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log('✅ MongoDB connected successfully.');
    app.listen(config.port, () => console.log(`🚀 API running on http://localhost:${config.port}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();