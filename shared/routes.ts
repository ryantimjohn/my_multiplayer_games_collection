import { z } from "zod";
import { gameResponseSchema } from "./schema";

export const api = {
  games: {
    list: {
      method: "GET" as const,
      path: "/api/games",
      responses: {
        200: z.array(gameResponseSchema),
      },
    },
  },
};
