import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestResults } from '@/utils/deckGenerator';
import { DeckSelector } from '@/components/DeckSelector';
import { CardDetailModal } from '@/components/CardDetailModal';
import { Card as CardType } from '@/data/cards';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Crown,
  Sword,
  Shield,
  Brain,
  Eye
} from 'lucide-react';

interface TestResultsPanelProps {
  results: TestResults | null;
  progress: number;
  currentTask: string;
  isRunning: boolean;
  onStopTest: () => void;
}

export function TestResultsPanel({ 
  results, 
  progress, 
  currentTask, 
  isRunning, 
  onStopTest 
}: TestResultsPanelProps) {
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const closeCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedCard(null);
  };
  
  if (!results && !isRunning) {
    return (
      <Card className="border-muted">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Bereit für Brute-Force Testing</h3>
              <p className="text-muted-foreground">
                Konfiguriere die Einstellungen und starte den Test
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isRunning) {
    return (
      <Card className="border-primary/20 shadow-gaming">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Test läuft...
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fortschritt</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{currentTask}</p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Aktuelle Analyse</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Decks generiert:</span>
                <span className="font-mono">~{Math.round(progress * 5)}+</span>
              </div>
              <div className="flex justify-between">
                <span>Battles simuliert:</span>
                <span className="font-mono">~{Math.round(progress * 50)}+</span>
              </div>
              <div className="flex justify-between">
                <span>Geschätzte Zeit:</span>
                <span className="font-mono">
                  {Math.round((100 - progress) * 0.3)} Min
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onStopTest}
            variant="destructive"
            className="w-full"
          >
            Test stoppen
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!results) return null;

  const topDeck = results.bestDecks[0];
  const selectedDeck = results.bestDecks[selectedDeckIndex];
  const selectedWinRate = results.results.get(selectedDeck?.id || '') || 0;

  return (
    <div className="space-y-6">
      {/* Card Detail Modal */}
      <CardDetailModal 
        card={selectedCard}
        isOpen={isCardModalOpen}
        onClose={closeCardModal}
      />

      {/* Übersicht */}
      <Card className="border-gaming-gold shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-gaming-gold" />
            Test Ergebnisse
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gaming-gold">
                {results.bestDecks.length}
              </div>
              <div className="text-sm text-muted-foreground">Getestete Decks</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gaming-blue">
                {results.completedTests.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Battles</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gaming-purple">
                {Math.round(selectedWinRate)}%
              </div>
              <div className="text-sm text-muted-foreground">Aktuell gewählt</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-success">
                {Math.round(results.averageWinRate)}%
              </div>
              <div className="text-sm text-muted-foreground">Durchschnitt</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deck Selector */}
      <DeckSelector 
        decks={results.bestDecks}
        winRates={results.results}
        selectedDeckIndex={selectedDeckIndex}
        onSelectDeck={setSelectedDeckIndex}
      />

      {/* Strategien-Analyse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gaming-blue" />
              Top Strategien
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {getTopStrategies(results).map((strategy, index) => (
                <div key={strategy.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStrategyIcon(strategy.name)}
                    <span className="font-medium">{strategy.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gaming-blue">
                      {Math.round(strategy.avgWinRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {strategy.count} Decks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gaming-purple" />
              Top Master
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {getTopMasters(results).map((master, index) => (
                <div key={master.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gaming-purple/20 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-gaming-purple" />
                    </div>
                    <span className="font-medium">{master.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gaming-purple">
                      {Math.round(master.avgWinRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {master.count} Decks
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deck Details - Aktuell gewähltes Deck */}
      {selectedDeck && (
        <Card className="border-gaming-gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gaming-gold" />
            Champion Deck - {selectedDeck.master.name}
            <Badge className="ml-2">
              #{selectedDeckIndex + 1} von 5
            </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Master</h4>
                <div className="p-3 bg-muted/30 rounded">
                  <div className="font-medium">{selectedDeck.master.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedDeck.master.faction}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedDeck.master.health} HP
                  </div>
                  {selectedDeck.master.perks && (
                    <div className="text-xs text-gaming-blue mt-1">
                      {selectedDeck.master.perks.slice(0, 2).join(', ')}
                      {selectedDeck.master.perks.length > 2 && '...'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Statistiken</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Win-Rate:</span>
                    <span className="font-semibold text-gaming-gold">{Math.round(selectedWinRate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Mana:</span>
                    <span>{selectedDeck.averageCost.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Synergie:</span>
                    <span>{Math.round(selectedDeck.strategySynergy)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gesamt Mana:</span>
                    <span>{selectedDeck.totalCost}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Mana-Kurve</h4>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {[1,2,3,4,5].map(cost => {
                    const count = selectedDeck.cards.filter(card => card.cost === cost).length;
                    const percentage = Math.round((count / selectedDeck.cards.length) * 100);
                    return (
                      <div key={cost} className="text-center p-2 bg-muted/30 rounded">
                        <div className="font-semibold">{count}</div>
                        <div className="text-muted-foreground">{cost}M</div>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    );
                  })}
                  <div className="text-center p-2 bg-muted/30 rounded">
                    <div className="font-semibold">
                      {selectedDeck.cards.filter(card => card.cost >= 6).length}
                    </div>
                    <div className="text-muted-foreground">6+M</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((selectedDeck.cards.filter(card => card.cost >= 6).length / selectedDeck.cards.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vollständige Kartenliste */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Komplette Kartenliste ({selectedDeck.cards.length} Karten)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedDeck.cards
                  .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
                  .map((card, index) => (
                  <button
                    key={`${card.id}-${index}`} 
                    onClick={() => handleCardClick(card)}
                    className="relative p-3 bg-muted/20 rounded-lg border border-muted hover:bg-muted/40 transition-all duration-200 group hover:scale-105 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Kartenbild */}
                      <div className="relative w-16 h-20 rounded-md overflow-hidden border border-muted bg-muted/10 flex-shrink-0">
                        {card.image ? (
                          <img 
                            src={card.image} 
                            alt={card.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            Karte
                          </div>
                        )}
                        
                        {/* Mana-Kosten Badge auf dem Bild */}
                        <div className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                          card.cost <= 2 ? 'bg-gaming-purple text-white' :
                          card.cost <= 4 ? 'bg-gaming-blue text-white' :
                          'bg-gaming-gold text-black'
                        }`}>
                          {card.cost}
                        </div>
                        
                        {/* Hover-Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{card.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {card.type} • {card.faction} • {card.rarity}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs font-medium text-gaming-red">
                            ⚔ {card.attack}
                          </div>
                          <div className="text-xs font-medium text-gaming-green">
                            ❤ {card.health}
                          </div>
                          {card.effectPower && (
                            <div className="text-xs font-medium text-gaming-purple">
                              ✦ {card.effectPower}
                            </div>
                          )}
                        </div>
                        
                        {/* Fähigkeiten */}
                        {card.abilities && card.abilities.length > 0 && (
                          <div className="text-xs text-gaming-blue mt-1 font-medium">
                            {card.abilities.join(' • ')}
                          </div>
                        )}
                        
                        {/* Spezialeffekte */}
                        {card.specialEffects && (
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            {card.specialEffects.onPlay && (
                              <div><span className="text-gaming-gold">Beim Spielen:</span> {card.specialEffects.onPlay}</div>
                            )}
                            {card.specialEffects.passive && (
                              <div><span className="text-gaming-blue">Passiv:</span> {card.specialEffects.passive}</div>
                            )}
                            {card.specialEffects.triggered && (
                              <div><span className="text-gaming-purple">Ausgelöst:</span> {card.specialEffects.triggered}</div>
                            )}
                            {card.specialEffects.onDeath && (
                              <div><span className="text-gaming-red">Beim Tod:</span> {card.specialEffects.onDeath}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fraktions-Analyse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Fraktions-Verteilung</h4>
                <div className="space-y-2">
                  {getFactionDistribution(selectedDeck.cards).map(faction => (
                    <div key={faction.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm font-medium">{faction.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{faction.count} Karten</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((faction.count / selectedDeck.cards.length) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Karten-Typen</h4>
                <div className="space-y-2">
                  {getTypeDistribution(selectedDeck.cards).map(type => (
                    <div key={type.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm font-medium">{type.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{type.count} Karten</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((type.count / selectedDeck.cards.length) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions
function getTopStrategies(results: TestResults) {
  const strategyMap = new Map<string, { totalWinRate: number; count: number }>();
  
  results.bestDecks.forEach(deck => {
    const winRate = results.results.get(deck.id) || 0;
    const current = strategyMap.get(deck.strategy) || { totalWinRate: 0, count: 0 };
    current.totalWinRate += winRate;
    current.count++;
    strategyMap.set(deck.strategy, current);
  });
  
  return Array.from(strategyMap.entries())
    .map(([name, data]) => ({
      name,
      avgWinRate: data.totalWinRate / data.count,
      count: data.count
    }))
    .sort((a, b) => b.avgWinRate - a.avgWinRate)
    .slice(0, 5);
}

function getTopMasters(results: TestResults) {
  const masterMap = new Map<string, { totalWinRate: number; count: number }>();
  
  results.bestDecks.forEach(deck => {
    const winRate = results.results.get(deck.id) || 0;
    const current = masterMap.get(deck.master.name) || { totalWinRate: 0, count: 0 };
    current.totalWinRate += winRate;
    current.count++;
    masterMap.set(deck.master.name, current);
  });
  
  return Array.from(masterMap.entries())
    .map(([name, data]) => ({
      name,
      avgWinRate: data.totalWinRate / data.count,
      count: data.count
    }))
    .sort((a, b) => b.avgWinRate - a.avgWinRate)
    .slice(0, 5);
}

function getStrategyIcon(strategy: string) {
  switch (strategy) {
    case 'AGGRO': return <Zap className="w-4 h-4 text-destructive" />;
    case 'CONTROL': return <Shield className="w-4 h-4 text-gaming-blue" />;
    case 'MIDRANGE': return <Target className="w-4 h-4 text-gaming-purple" />;
    case 'COMBO': return <Brain className="w-4 h-4 text-gaming-gold" />;
    default: return <Sword className="w-4 h-4 text-muted-foreground" />;
  }
}

function getFactionDistribution(cards: any[]) {
  const factionMap = new Map<string, number>();
  
  cards.forEach(card => {
    const current = factionMap.get(card.faction) || 0;
    factionMap.set(card.faction, current + 1);
  });
  
  return Array.from(factionMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function getTypeDistribution(cards: any[]) {
  const typeMap = new Map<string, number>();
  
  cards.forEach(card => {
    const current = typeMap.get(card.type) || 0;
    typeMap.set(card.type, current + 1);
  });
  
  return Array.from(typeMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}