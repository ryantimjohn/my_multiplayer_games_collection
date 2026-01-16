import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Ensure schema consistency with backend
const gameSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  maxPlayers: z.number().nullable(),
  systems: z.array(z.string()),
  genres: z.array(z.string()),
});

export type Game = z.infer<typeof gameSchema>;

export function useGames() {
  return useQuery({
    queryKey: [api.games.list.path],
    queryFn: async () => {
      const res = await fetch(api.games.list.path);
      if (!res.ok) throw new Error("Failed to fetch games");
      
      const data = await res.json();
      return api.games.list.responses[200].parse(data);
    },
  });
}
