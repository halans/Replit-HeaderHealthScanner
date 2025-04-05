import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const headerScans = pgTable("header_scans", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  rawHeaders: jsonb("raw_headers").notNull(),
  securityScore: integer("security_score").notNull(),
  performanceScore: integer("performance_score").notNull(),
  maintainabilityScore: integer("maintainability_score").notNull(),
  overallScore: integer("overall_score").notNull(),
  totalSecurityHeaders: integer("total_security_headers").notNull(),
  implementedSecurityHeaders: integer("implemented_security_headers").notNull(),
  totalPerformanceHeaders: integer("total_performance_headers").notNull(),
  implementedPerformanceHeaders: integer("implemented_performance_headers").notNull(),
  totalMaintainabilityHeaders: integer("total_maintainability_headers").notNull(),
  implementedMaintainabilityHeaders: integer("implemented_maintainability_headers").notNull(),
  securityGrade: text("security_grade").notNull(),
  performanceGrade: text("performance_grade").notNull(),
  maintainabilityGrade: text("maintainability_grade").notNull(),
  overallGrade: text("overall_grade").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHeaderScanSchema = createInsertSchema(headerScans).omit({ 
  id: true,
  timestamp: true
});

export const urlSchema = z.object({
  url: z.string().url().min(1)
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HeaderScan = typeof headerScans.$inferSelect;
export type InsertHeaderScan = z.infer<typeof insertHeaderScanSchema>;
export type UrlRequest = z.infer<typeof urlSchema>;
