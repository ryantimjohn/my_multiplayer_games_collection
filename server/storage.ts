import { GameResponse } from "@shared/schema";
import Papa from "papaparse";

export interface IStorage {
  getGames(): Promise<GameResponse[]>;
}

export class GoogleSheetStorage implements IStorage {
  private games: GameResponse[] = [];
  private lastFetch: number = 0;
  private CACHE_TTL = 60 * 1000; // 1 minute cache
  private SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1kTr_lt6Kdqp7OJIYhAMwWO8aQ18qxf45MKJeOhTCn6U/export?format=csv&gid=528764797";

  private systemColumns = [
    "PC", "Switch", "Wii U", "Wii", "GameCube", "N64", "SNES", 
    "PS3", "PS2", "PS1", "Xbox 360", "Xbox (Original)", 
    "Dreamcast", "Saturn", "Genesis", "Arcade"
  ];

  private genreColumns = [
    "Shooter", "Fighting", "Beat 'em Up", "Racing", "Sports", 
    "Party", "Puzzle", "Platformer", "RPG", "Adventure"
  ];

  async getGames(): Promise<GameResponse[]> {
    const now = Date.now();
    if (this.games.length > 0 && now - this.lastFetch < this.CACHE_TTL) {
      return this.games;
    }

    try {
      console.log("Fetching games from Google Sheet...");
      const response = await fetch(this.SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });

      if (parseResult.errors.length > 0) {
        console.warn("CSV Parse errors:", parseResult.errors);
      }

      this.games = parseResult.data.map((row: any, index) => {
        // Map Systems
        const systems: string[] = [];
        this.systemColumns.forEach(sys => {
          if (row[sys] && (row[sys].toString().trim() !== "" || row[sys].toString().toLowerCase() === "true")) {
            systems.push(sys);
          }
        });

        // Map Genres
        const genres: string[] = [];
        this.genreColumns.forEach(genre => {
          if (row[genre] && (row[genre].toString().trim() !== "" || row[genre].toString().toLowerCase() === "true")) {
            genres.push(genre);
          }
        });

        return {
          id: index + 1,
          title: row["Game Title"] || "Untitled",
          description: row["Description"] || "",
          maxPlayers: row["Max Players"] ? parseInt(row["Max Players"], 10) : null,
          systems,
          genres
        };
      });

      this.lastFetch = now;
      console.log(`Loaded ${this.games.length} games.`);
      return this.games;
    } catch (error) {
      console.error("Error loading games:", error);
      // Return cached games if available even if expired, otherwise empty
      return this.games;
    }
  }
}

export const storage = new GoogleSheetStorage();
