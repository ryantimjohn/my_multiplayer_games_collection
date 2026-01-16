import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSystems: string[];
  onSystemToggle: (system: string) => void;
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  minPlayers: number;
  onMinPlayersChange: (value: number) => void;
  availableSystems: string[];
  availableGenres: string[];
  totalGames: number;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  selectedSystems,
  onSystemToggle,
  selectedGenres,
  onGenreToggle,
  minPlayers,
  onMinPlayersChange,
  availableSystems,
  availableGenres,
  totalGames,
  activeFiltersCount,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-4 mb-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all"
          />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant={activeFiltersCount > 0 ? "default" : "outline"} className="gap-2 shrink-0">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col h-full">
            <SheetHeader className="space-y-4 pb-4 border-b">
              <SheetTitle className="text-2xl font-display">Filter Collection</SheetTitle>
              <SheetDescription>
                Narrow down your {totalGames} games by system, genre, or player count.
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="flex-1 -mx-6 px-6 py-6">
              <div className="space-y-8">
                {/* Min Players Filter */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Min Players</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-primary font-bold">
                      {minPlayers}+
                    </span>
                  </div>
                  <Slider
                    value={[minPlayers]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(vals) => onMinPlayersChange(vals[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>4</span>
                    <span>8+</span>
                  </div>
                </div>

                {/* Systems Filter */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Systems</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableSystems.map((system) => {
                      const isSelected = selectedSystems.includes(system);
                      return (
                        <Badge
                          key={system}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-1.5 transition-all hover:scale-105 active:scale-95 ${
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => onSystemToggle(system)}
                        >
                          {system}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Genres Filter */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Genres</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableGenres.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <Badge
                          key={genre}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer px-3 py-1.5 transition-all hover:scale-105 active:scale-95 ${
                            isSelected 
                              ? "bg-accent text-accent-foreground shadow-md shadow-accent/25" 
                              : "hover:border-accent/50"
                          }`}
                          onClick={() => onGenreToggle(genre)}
                        >
                          {genre}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="pt-4 border-t mt-auto">
              <div className="flex w-full gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <SheetTrigger asChild>
                  <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20">
                    Show Games
                  </Button>
                </SheetTrigger>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
