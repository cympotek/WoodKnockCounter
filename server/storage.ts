import {
  users,
  dailyTaps,
  tapRecords,
  userSettings,
  type User,
  type UpsertUser,
  type DailyTap,
  type InsertDailyTap,
  type TapRecord,
  type InsertTapRecord,
  type UserSettings,
  type InsertUserSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Daily taps operations
  getDailyTap(userId: string, date: string): Promise<DailyTap | undefined>;
  createOrUpdateDailyTap(data: InsertDailyTap): Promise<DailyTap>;
  incrementDailyTap(userId: string, date: string): Promise<DailyTap>;
  
  // Tap records operations
  createTapRecord(data: InsertTapRecord): Promise<TapRecord>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(data: InsertUserSettings): Promise<UserSettings>;
  
  // Leaderboard operations
  getDailyLeaderboard(date: string, limit?: number): Promise<Array<{
    user: User;
    tapCount: number;
    rank: number;
  }>>;
  
  getAllTimeLeaderboard(limit?: number): Promise<Array<{
    user: User;
    totalTaps: number;
    rank: number;
  }>>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Daily taps operations
  async getDailyTap(userId: string, date: string): Promise<DailyTap | undefined> {
    const [dailyTap] = await db
      .select()
      .from(dailyTaps)
      .where(and(eq(dailyTaps.userId, userId), eq(dailyTaps.date, date)));
    return dailyTap;
  }

  async createOrUpdateDailyTap(data: InsertDailyTap): Promise<DailyTap> {
    const [dailyTap] = await db
      .insert(dailyTaps)
      .values(data)
      .onConflictDoUpdate({
        target: dailyTaps.userId,
        set: {
          tapCount: data.tapCount,
          updatedAt: new Date(),
        },
        where: eq(dailyTaps.date, data.date),
      })
      .returning();
    return dailyTap;
  }

  async incrementDailyTap(userId: string, date: string): Promise<DailyTap> {
    // First, try to increment existing record
    const [updated] = await db
      .update(dailyTaps)
      .set({
        tapCount: sql`${dailyTaps.tapCount} + 1`,
        updatedAt: new Date(),
      })
      .where(and(eq(dailyTaps.userId, userId), eq(dailyTaps.date, date)))
      .returning();

    // If no record exists, create a new one
    if (!updated) {
      const [created] = await db
        .insert(dailyTaps)
        .values({
          userId,
          date,
          tapCount: 1,
        })
        .returning();
      return created;
    }

    return updated;
  }

  // Tap records operations
  async createTapRecord(data: InsertTapRecord): Promise<TapRecord> {
    const [tapRecord] = await db
      .insert(tapRecords)
      .values(data)
      .returning();
    return tapRecord;
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(data: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(data)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          soundEnabled: data.soundEnabled,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  // Leaderboard operations
  async getDailyLeaderboard(date: string, limit = 100): Promise<Array<{
    user: User;
    tapCount: number;
    rank: number;
  }>> {
    const results = await db
      .select({
        user: users,
        tapCount: dailyTaps.tapCount,
      })
      .from(dailyTaps)
      .innerJoin(users, eq(dailyTaps.userId, users.id))
      .where(eq(dailyTaps.date, date))
      .orderBy(desc(dailyTaps.tapCount))
      .limit(limit);

    return results.map((result, index) => ({
      user: result.user,
      tapCount: result.tapCount,
      rank: index + 1,
    }));
  }

  async getAllTimeLeaderboard(limit = 100): Promise<Array<{
    user: User;
    totalTaps: number;
    rank: number;
  }>> {
    const results = await db
      .select({
        user: users,
        totalTaps: sql<number>`sum(${dailyTaps.tapCount})`,
      })
      .from(dailyTaps)
      .innerJoin(users, eq(dailyTaps.userId, users.id))
      .groupBy(users.id)
      .orderBy(desc(sql`sum(${dailyTaps.tapCount})`))
      .limit(limit);

    return results.map((result, index) => ({
      user: result.user,
      totalTaps: result.totalTaps,
      rank: index + 1,
    }));
  }
}

export const storage = new DatabaseStorage();
