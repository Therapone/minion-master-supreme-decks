import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, Users, Clock } from "lucide-react";

interface DeckCardProps {
  deck: {
    id: string;
    name: string;
    tier: "S" | "A" | "B";
    winRate: number;
    popularity: number;
    lastUpdated: string;
    strategy: string;
    difficulty: "Anfänger" | "Fortgeschritten" | "Experte";
  };
}

export function DeckCard({ deck }: DeckCardProps) {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "S": return "bg-gradient-victory text-foreground";
      case "A": return "bg-gradient-gaming text-foreground";
      case "B": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Anfänger": return "border-success text-success";
      case "Fortgeschritten": return "border-warning text-warning";
      case "Experte": return "border-destructive text-destructive";
      default: return "border-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-gaming transition-all duration-300 hover:scale-105 bg-card border-border hover:border-primary/50">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
              {deck.name}
            </CardTitle>
            <p className="text-muted-foreground text-sm">{deck.strategy}</p>
          </div>
          <Badge className={getTierColor(deck.tier)} variant="secondary">
            Tier {deck.tier}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline" className={getDifficultyColor(deck.difficulty)}>
            {deck.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm">
              <span className="font-semibold text-success">{deck.winRate}%</span> Win-Rate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gaming-blue" />
            <span className="text-sm">
              <span className="font-semibold text-gaming-blue">{deck.popularity}%</span> beliebt
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Clock className="w-3 h-3" />
          Aktualisiert: {deck.lastUpdated}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="gaming" size="sm" className="flex-1">
            <Star className="w-4 h-4 mr-1" />
            Deck verwenden
          </Button>
          <Button variant="outline" size="sm">
            Guide
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}