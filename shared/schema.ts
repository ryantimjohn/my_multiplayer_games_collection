import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll use a Zod schema for the API since the data comes from Google Sheets
// But we still define a table structure for type consistency and potential caching

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  maxPlayers: integer("max_players"),
  // Storing arrays as text[] in Postgres, or JSONB if needed. 
  // For simplicity in this app, we'll just define the Zod schema for the API response.
  systems: text("systems").array().notNull(),
  genres: text("genres").array().notNull(),
});

export const insertGameSchema = createInsertSchema(games);

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

// API Schemas
export const gameResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  maxPlayers: z.number().nullable(),
  systems: z.array(z.string()),
  genres: z.array(z.string()),
});

export type GameResponse = z.infer<typeof gameResponseSchema>;
