import { useState, useMemo } from "react";
import { useGames } from "@/hooks/use-games";
import { GameCard } from "@/components/GameCard";
import { FilterBar } from "@/components/FilterBar";
import { Loader2, Gamepad2, Ghost } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: games, isLoading, error } = useGames();
  
  // Local state for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minPlayers, setMinPlayers] = useState(1);

  // Derived state: Extract unique systems and genres
  const { systems, genres } = useMemo(() => {
    if (!games) return { systems: [], genres: [] };
    
    const uniqueSystems = Array.from(new Set(games.flatMap(g => g.systems))).sort();
    const uniqueGenres = Array.from(new Set(games.flatMap(g => g.genres))).sort();
    
    return { systems: uniqueSystems, genres: uniqueGenres };
  }, [games]);

  // Derived state: Filtered games
  const filteredGames = useMemo(() => {
    if (!games) return [];

    return games.filter(game => {
      // 1. Search term (title)
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Systems (OR logic: if ANY selected system matches, include)
      const matchesSystem = selectedSystems.length === 0 || 
        game.systems.some(sys => selectedSystems.includes(sys));
        
      // 3. Genres (OR logic: if ANY selected genre matches, include)
      const matchesGenre = selectedGenres.length === 0 || 
        game.genres.some(genre => selectedGenres.includes(genre));
        
      // 4. Player count (Min players logic)
      const maxPlayers = game.maxPlayers || 1; // Default to 1 if null
      const matchesPlayers = maxPlayers >= minPlayers;

      return matchesSearch && matchesSystem && matchesGenre && matchesPlayers;
    });
  }, [games, searchTerm, selectedSystems, selectedGenres, minPlayers]);

  // Handlers
  const toggleSystem = (system: string) => {
    setSelectedSystems(prev => 
      prev.includes(system) ? prev.filter(s => s !== system) : [...prev, system]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSystems([]);
    setSelectedGenres([]);
    setMinPlayers(1);
  };

  const activeFiltersCount = 
    selectedSystems.length + 
    selectedGenres.length + 
    (minPlayers > 1 ? 1 : 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
        <p className="text-muted-foreground animate-pulse font-medium">Loading your collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <Ghost className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md">
          Could not load the games library. Please check if the Google Sheet integration is working correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/5 pt-12 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-accent mb-2">
              Game Menu
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium">
              Explore {games?.length || 0} games in your collection
            </p>
          </div>
          <div className="hidden md:block">
            <Gamepad2 className="w-24 h-24 text-primary/10 rotate-12" />
          </div>
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSystems={selectedSystems}
        onSystemToggle={toggleSystem}
        selectedGenres={selectedGenres}
        onGenreToggle={toggleGenre}
        minPlayers={minPlayers}
        onMinPlayersChange={setMinPlayers}
        availableSystems={systems}
        availableGenres={genres}
        totalGames={games?.length || 0}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={clearFilters}
      />

      <div className="max-w-7xl mx-auto px-4">
        {filteredGames.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="bg-muted p-6 rounded-full mb-6">
              <Ghost className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
