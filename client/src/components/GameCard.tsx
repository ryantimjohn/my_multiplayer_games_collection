import { Game } from "@/hooks/use-games";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Gamepad2, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  // Generate a consistent gradient based on game id
  const getGradient = (id: number) => {
    const gradients = [
      "from-pink-500/10 to-rose-500/10 border-pink-200 dark:border-pink-900",
      "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-900",
      "from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-900",
      "from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-900",
    ];
    return gradients[id % gradients.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full flex flex-col overflow-hidden border-2 transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${getGradient(game.id)}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <CardTitle className="text-xl md:text-2xl font-bold leading-tight line-clamp-2">
              {game.title}
            </CardTitle>
            {game.maxPlayers && (
              <Badge variant="secondary" className="shrink-0 flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 bg-background/50 backdrop-blur-sm shadow-sm">
                <Users className="w-3 h-3" />
                {game.maxPlayers}P
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow pb-3">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
            {game.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Gamepad2 className="w-4 h-4 mt-1 text-primary shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {game.systems.map((system) => (
                  <Badge 
                    key={system} 
                    variant="outline" 
                    className="text-[10px] px-1.5 h-5 bg-background/50 border-primary/20 text-primary-foreground font-semibold bg-primary"
                  >
                    {system}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Tag className="w-4 h-4 mt-1 text-accent shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {game.genres.map((genre) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className="text-[10px] px-1.5 h-5 bg-background/50 border-accent/20 text-accent font-medium"
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
