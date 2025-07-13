import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestResults } from '@/utils/deckGenerator';
import { 
  Trophy, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Zap, 
  Crown,
  Sword,
  Shield,
  Brain
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
  const topWinRate = results.results.get(topDeck?.id || '') || 0;

  return (
    <div className="space-y-6">
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
                {Math.round(topWinRate)}%
              </div>
              <div className="text-sm text-muted-foreground">Beste Win-Rate</div>
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

      {/* Top Decks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gaming-gold" />
            Top 5 Decks
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {results.bestDecks.slice(0, 5).map((deck, index) => {
              const winRate = results.results.get(deck.id) || 0;
              const rankColors = ['text-gaming-gold', 'text-gray-300', 'text-amber-600', 'text-gaming-blue', 'text-gaming-purple'];
              
              return (
                <div key={deck.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${rankColors[index]}`}>
                      #{index + 1}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {deck.master.name} - {deck.strategy}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {deck.master.faction}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Ø {deck.averageCost.toFixed(1)} Mana
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {deck.factionSynergy.toFixed(0)}% Synergie
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-xl font-bold text-success">
                      {Math.round(winRate)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Win-Rate
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

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

      {/* Deck Details - Bestes Deck */}
      {topDeck && (
        <Card className="border-gaming-gold">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gaming-gold" />
              Champion Deck - {topDeck.master.name}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Master</h4>
                <div className="p-3 bg-muted/30 rounded">
                  <div className="font-medium">{topDeck.master.name}</div>
                  <div className="text-sm text-muted-foreground">{topDeck.master.faction}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {topDeck.master.health} HP
                  </div>
                  {topDeck.master.perks && (
                    <div className="text-xs text-gaming-blue mt-1">
                      {topDeck.master.perks.slice(0, 2).join(', ')}
                      {topDeck.master.perks.length > 2 && '...'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Statistiken</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Win-Rate:</span>
                    <span className="font-semibold text-gaming-gold">{Math.round(topWinRate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Mana:</span>
                    <span>{topDeck.averageCost.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Synergie:</span>
                    <span>{Math.round(topDeck.strategySynergy)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gesamt Mana:</span>
                    <span>{topDeck.totalCost}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Mana-Kurve</h4>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {[1,2,3,4,5].map(cost => {
                    const count = topDeck.cards.filter(card => card.cost === cost).length;
                    const percentage = Math.round((count / topDeck.cards.length) * 100);
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
                      {topDeck.cards.filter(card => card.cost >= 6).length}
                    </div>
                    <div className="text-muted-foreground">6+M</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((topDeck.cards.filter(card => card.cost >= 6).length / topDeck.cards.length) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vollständige Kartenliste */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Komplette Kartenliste ({topDeck.cards.length} Karten)
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {topDeck.cards
                  .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
                  .map((card, index) => (
                  <div 
                    key={`${card.id}-${index}`} 
                    className="p-3 bg-muted/20 rounded-lg border border-muted hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{card.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {card.type} • {card.faction}
                        </div>
                        {card.abilities && card.abilities.length > 0 && (
                          <div className="text-xs text-gaming-blue mt-1">
                            {card.abilities.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-1 ${
                            card.cost <= 2 ? 'border-gaming-purple text-gaming-purple' :
                            card.cost <= 4 ? 'border-gaming-blue text-gaming-blue' :
                            'border-gaming-gold text-gaming-gold'
                          }`}
                        >
                          {card.cost}M
                        </Badge>
                        
                        <div className="text-xs text-muted-foreground">
                          {card.attack}/{card.health}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraktions-Analyse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Fraktions-Verteilung</h4>
                <div className="space-y-2">
                  {getFactionDistribution(topDeck.cards).map(faction => (
                    <div key={faction.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm font-medium">{faction.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{faction.count} Karten</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((faction.count / topDeck.cards.length) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Karten-Typen</h4>
                <div className="space-y-2">
                  {getTypeDistribution(topDeck.cards).map(type => (
                    <div key={type.name} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm font-medium">{type.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{type.count} Karten</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((type.count / topDeck.cards.length) * 100)}%
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