import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  date,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Daily tap records table
export const dailyTaps = pgTable("daily_taps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  tapCount: integer("tap_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique("unique_user_date").on(table.userId, table.date)
]);

// Individual tap records for detailed tracking
export const tapRecords = pgTable("tap_records", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  dailyTapId: integer("daily_tap_id").notNull().references(() => dailyTaps.id),
  tappedAt: timestamp("tapped_at").defaultNow(),
});

// User settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  dailyTaps: many(dailyTaps),
  tapRecords: many(tapRecords),
  settings: one(userSettings),
}));

export const dailyTapsRelations = relations(dailyTaps, ({ one, many }) => ({
  user: one(users, {
    fields: [dailyTaps.userId],
    references: [users.id],
  }),
  tapRecords: many(tapRecords),
}));

export const tapRecordsRelations = relations(tapRecords, ({ one }) => ({
  user: one(users, {
    fields: [tapRecords.userId],
    references: [users.id],
  }),
  dailyTap: one(dailyTaps, {
    fields: [tapRecords.dailyTapId],
    references: [dailyTaps.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertDailyTapSchema = createInsertSchema(dailyTaps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTapRecordSchema = createInsertSchema(tapRecords).omit({
  id: true,
  tappedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type DailyTap = typeof dailyTaps.$inferSelect;
export type InsertDailyTap = z.infer<typeof insertDailyTapSchema>;
export type TapRecord = typeof tapRecords.$inferSelect;
export type InsertTapRecord = z.infer<typeof insertTapRecordSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
