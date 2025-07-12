import { DeckCard } from "./DeckCard";
import { Button } from "@/components/ui/button";
import { Filter, Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockDecks = [
  {
    id: "1",
    name: "Aggro Storm",
    tier: "S" as const,
    winRate: 87,
    popularity: 23,
    lastUpdated: "vor 2 Stunden",
    strategy: "Früher Druck mit schnellen Einheiten",
    difficulty: "Fortgeschritten" as const,
  },
  {
    id: "2", 
    name: "Control Colossus",
    tier: "S" as const,
    winRate: 84,
    popularity: 19,
    lastUpdated: "vor 1 Tag",
    strategy: "Spätes Spiel mit mächtigen Minions",
    difficulty: "Experte" as const,
  },
  {
    id: "3",
    name: "Rush Combo",
    tier: "A" as const,
    winRate: 78,
    popularity: 31,
    lastUpdated: "vor 3 Stunden",
    strategy: "Explosive Kombinationen",
    difficulty: "Anfänger" as const,
  },
  {
    id: "4",
    name: "Magic Might",
    tier: "A" as const,
    winRate: 81,
    popularity: 15,
    lastUpdated: "vor 5 Stunden",
    strategy: "Zauber-basierte Strategie",
    difficulty: "Fortgeschritten" as const,
  },
  {
    id: "5",
    name: "Swarm Strategy",
    tier: "B" as const,
    winRate: 73,
    popularity: 27,
    lastUpdated: "vor 1 Tag",
    strategy: "Viele kleine Einheiten",
    difficulty: "Anfänger" as const,
  },
  {
    id: "6",
    name: "Defense Master",
    tier: "A" as const,
    winRate: 76,
    popularity: 12,
    lastUpdated: "vor 8 Stunden",
    strategy: "Defensive Kontrolle",
    difficulty: "Experte" as const,
  },
];

export function MetaDecks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
            Meta Decks
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Die stärksten Decks der aktuellen Meta. Professionell analysiert und optimiert für maximale Win-Rate.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Deck suchen..." 
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Nach Win-Rate
            </Button>
          </div>
        </div>

        {/* Deck Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="gaming" size="lg">
            Mehr Decks laden
          </Button>
        </div>
      </div>
    </section>
  );
}