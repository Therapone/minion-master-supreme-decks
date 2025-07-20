import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Deck } from '@/utils/deckGenerator';
import { ChevronLeft, ChevronRight, Trophy, Crown, Target } from 'lucide-react';

interface DeckSelectorProps {
  decks: Deck[];
  winRates: Map<string, number>;
  selectedDeckIndex: number;
  onSelectDeck: (index: number) => void;
}

export function DeckSelector({ decks, winRates, selectedDeckIndex, onSelectDeck }: DeckSelectorProps) {
  const topDecks = decks.slice(0, 5);
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-gaming-gold" />;
      case 1: return <Crown className="w-5 h-5 text-gray-300" />;
      case 2: return <Target className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 rounded-full bg-gaming-blue text-white text-xs flex items-center justify-center font-bold">{index + 1}</div>;
    }
  };

  const getRankColors = (index: number) => {
    switch (index) {
      case 0: return 'border-gaming-gold bg-gaming-gold/10';
      case 1: return 'border-gray-300 bg-gray-300/10';
      case 2: return 'border-amber-600 bg-amber-600/10';
      default: return 'border-gaming-blue bg-gaming-blue/10';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gaming-gold" />
            Top 5 Decks - Navigation
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedDeckIndex + 1} von {topDecks.length}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Deck-Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectDeck(Math.max(0, selectedDeckIndex - 1))}
            disabled={selectedDeckIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 text-center">
            <div className="text-lg font-bold">
              {topDecks[selectedDeckIndex]?.master.name} - {topDecks[selectedDeckIndex]?.strategy}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(winRates.get(topDecks[selectedDeckIndex]?.id || '') || 0)}% Win-Rate
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectDeck(Math.min(topDecks.length - 1, selectedDeckIndex + 1))}
            disabled={selectedDeckIndex === topDecks.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Deck-Übersicht */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {topDecks.map((deck, index) => {
            const winRate = winRates.get(deck.id) || 0;
            const isSelected = index === selectedDeckIndex;
            
            return (
              <button
                key={deck.id}
                onClick={() => onSelectDeck(index)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  isSelected 
                    ? getRankColors(index) + ' ring-2 ring-primary' 
                    : 'border-muted bg-muted/20 hover:bg-muted/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs font-semibold truncate">
                      {deck.master.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {deck.strategy}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-success">
                      {Math.round(winRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Win-Rate
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Badge variant="outline" className="text-xs">
                      {deck.master.faction}
                    </Badge>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Schnellvergleich */}
        <div className="bg-muted/20 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-2">Schnellvergleich - Ausgewähltes Deck</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="font-semibold">{topDecks[selectedDeckIndex]?.averageCost.toFixed(1)}</div>
              <div className="text-muted-foreground">Ø Mana</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{Math.round(topDecks[selectedDeckIndex]?.factionSynergy || 0)}%</div>
              <div className="text-muted-foreground">Synergie</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{topDecks[selectedDeckIndex]?.cards.length}</div>
              <div className="text-muted-foreground">Karten</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}