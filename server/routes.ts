import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import { insertTapRecordSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are now handled in simpleAuth.ts

  // Get daily tap count
  app.get("/api/taps/daily", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.userId;
      const today = new Date().toISOString().split('T')[0];
      
      const dailyTap = await storage.getDailyTap(userId, today);
      res.json({ 
        date: today,
        tapCount: dailyTap?.tapCount || 0 
      });
    } catch (error) {
      console.error("Error fetching daily taps:", error);
      res.status(500).json({ message: "Failed to fetch daily taps" });
    }
  });

  // Record a tap
  app.post("/api/taps", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.userId;
      const today = new Date().toISOString().split('T')[0];
      
      // Increment daily tap count
      const dailyTap = await storage.incrementDailyTap(userId, today);
      
      // Create individual tap record
      await storage.createTapRecord({
        userId,
        dailyTapId: dailyTap.id,
      });

      res.json({ 
        date: today,
        tapCount: dailyTap.tapCount 
      });
    } catch (error) {
      console.error("Error recording tap:", error);
      res.status(500).json({ message: "Failed to record tap" });
    }
  });

  // Record multiple taps in batch
  app.post("/api/taps/batch", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.userId;
      const today = new Date().toISOString().split('T')[0];
      const { count } = req.body;
      
      if (!count || count < 1) {
        return res.status(400).json({ message: "Invalid tap count" });
      }

      // Increment daily tap count by the batch amount
      let dailyTap = await storage.getDailyTap(userId, today);
      if (!dailyTap) {
        dailyTap = await storage.createOrUpdateDailyTap({
          userId,
          date: today,
          tapCount: count,
        });
      } else {
        dailyTap = await storage.createOrUpdateDailyTap({
          userId,
          date: today,
          tapCount: dailyTap.tapCount + count,
        });
      }

      // Create batch tap records
      const tapRecords = [];
      for (let i = 0; i < count; i++) {
        tapRecords.push({
          userId,
          dailyTapId: dailyTap.id,
        });
      }

      // Insert all tap records
      await Promise.all(
        tapRecords.map(record => storage.createTapRecord(record))
      );

      res.json({ 
        date: today,
        tapCount: dailyTap.tapCount,
        processed: count 
      });
    } catch (error) {
      console.error("Error recording batch taps:", error);
      res.status(500).json({ message: "Failed to record batch taps" });
    }
  });

  // Get user settings
  app.get("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.userId;
      
      let settings = await storage.getUserSettings(userId);
      if (!settings) {
        // Create default settings
        settings = await storage.upsertUserSettings({
          userId,
          soundEnabled: true,
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update user settings
  app.put("/api/settings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.userId;
      const validatedData = insertUserSettingsSchema.parse({
        ...req.body,
        userId,
      });
      
      const settings = await storage.upsertUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  // Get daily leaderboard
  app.get("/api/leaderboard/daily", async (req, res) => {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const limit = parseInt(req.query.limit as string) || 100;
      
      const leaderboard = await storage.getDailyLeaderboard(date, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch daily leaderboard" });
    }
  });

  // Get all-time leaderboard
  app.get("/api/leaderboard/all-time", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      
      const leaderboard = await storage.getAllTimeLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching all-time leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch all-time leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
