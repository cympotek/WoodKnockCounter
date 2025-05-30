import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { setupAuth, isAuthenticated } from '../server/replitAuth';
import { storage } from '../server/storage';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize auth (will be called once)
let authInitialized = false;

async function initializeAuth() {
  if (!authInitialized) {
    await setupAuth(app);
    authInitialized = true;
  }
}

// API Routes
app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.get('/api/taps/daily', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const today = new Date().toISOString().split('T')[0];
    
    const dailyTap = await storage.getDailyTap(userId, today);
    
    if (!dailyTap) {
      res.json({ date: today, tapCount: 0 });
    } else {
      res.json(dailyTap);
    }
  } catch (error) {
    console.error("Error fetching daily taps:", error);
    res.status(500).json({ message: "Failed to fetch daily taps" });
  }
});

app.post('/api/taps/batch', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { count } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    if (!count || count <= 0) {
      return res.status(400).json({ message: "Invalid tap count" });
    }
    
    let dailyTap = await storage.getDailyTap(userId, today);
    
    if (!dailyTap) {
      dailyTap = await storage.createOrUpdateDailyTap({
        userId,
        date: today,
        tapCount: count
      });
    } else {
      dailyTap = await storage.createOrUpdateDailyTap({
        userId,
        date: today,
        tapCount: dailyTap.tapCount + count
      });
    }
    
    await storage.createTapRecord({
      userId,
      date: today,
      tapCount: count
    });
    
    res.json(dailyTap);
  } catch (error) {
    console.error("Error recording batch taps:", error);
    res.status(500).json({ message: "Failed to record batch taps" });
  }
});

app.get('/api/settings', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const settings = await storage.getUserSettings(userId);
    
    if (!settings) {
      const defaultSettings = await storage.upsertUserSettings({
        userId,
        soundEnabled: true
      });
      res.json(defaultSettings);
    } else {
      res.json(settings);
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});

app.put('/api/settings', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { soundEnabled } = req.body;
    
    const settings = await storage.upsertUserSettings({
      userId,
      soundEnabled
    });
    
    res.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initializeAuth();
  return app(req, res);
}