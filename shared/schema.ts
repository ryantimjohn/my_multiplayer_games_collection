import { z } from "zod";

export const gameResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  maxPlayers: z.number().nullable(),
  systems: z.array(z.string()),
  genres: z.array(z.string()),
});

export type GameResponse = z.infer<typeof gameResponseSchema>;
