import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Play, Settings, Zap, Target, Brain, Shield, Sword } from 'lucide-react';
import { TestConfiguration } from '@/utils/deckTester';

interface TestConfigurationPanelProps {
  onStartTest: (config: TestConfiguration) => void;
  isRunning: boolean;
}

export function TestConfigurationPanel({ onStartTest, isRunning }: TestConfigurationPanelProps) {
  const [config, setConfig] = useState<TestConfiguration>({
    maxDecks: 500,
    testAgainstTop: 50,
    strategies: ['AGGRO', 'CONTROL', 'MIDRANGE'],
    minWinRate: 60,
    testDepth: 'NORMAL'
  });

  const strategies = [
    { id: 'AGGRO', name: 'Aggro Rush', icon: Zap, color: 'destructive' },
    { id: 'CONTROL', name: 'Control', icon: Shield, color: 'secondary' },
    { id: 'MIDRANGE', name: 'Midrange', icon: Target, color: 'accent' },
    { id: 'COMBO', name: 'Combo', icon: Brain, color: 'gaming-purple' },
    { id: 'MIXED', name: 'Mixed Strategy', icon: Sword, color: 'gaming-blue' }
  ];

  const handleStrategyToggle = (strategyId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      strategies: checked 
        ? [...prev.strategies, strategyId]
        : prev.strategies.filter(s => s !== strategyId)
    }));
  };

  const handleStartTest = () => {
    if (config.strategies.length === 0) {
      alert('Bitte wähle mindestens eine Strategie aus!');
      return;
    }
    onStartTest(config);
  };

  return (
    <Card className="border-primary/20 shadow-gaming">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="w-5 h-5 text-primary" />
          Brute-Force Test Konfiguration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Deck Generation Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Deck Generation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxDecks">Maximale Anzahl Decks</Label>
              <Input
                id="maxDecks"
                type="number"
                value={config.maxDecks}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  maxDecks: parseInt(e.target.value) || 100 
                }))}
                min="10"
                max="2000"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Mehr Decks = genauere Ergebnisse, aber längere Testzeit
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testDepth">Test-Tiefe</Label>
              <Select 
                value={config.testDepth} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, testDepth: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUICK">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <div>
                        <div>Quick (5-10 Min)</div>
                        <div className="text-xs text-muted-foreground">Jedes Deck vs 10 Gegner</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="NORMAL">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <div>
                        <div>Normal (20-30 Min)</div>
                        <div className="text-xs text-muted-foreground">Jedes Deck vs 20 Gegner</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="EXTENSIVE">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      <div>
                        <div>Extensive (1-3 Std)</div>
                        <div className="text-xs text-muted-foreground">Jeder gegen jeden</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Zu testende Strategien</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="flex items-center space-x-3">
                <Checkbox
                  id={strategy.id}
                  checked={config.strategies.includes(strategy.id)}
                  onCheckedChange={(checked) => 
                    handleStrategyToggle(strategy.id, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={strategy.id} 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <strategy.icon className="w-4 h-4" />
                  <span>{strategy.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {strategy.color}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Erweiterte Einstellungen</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minWinRate">Mindest Win-Rate (%)</Label>
              <Input
                id="minWinRate"
                type="number"
                value={config.minWinRate}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  minWinRate: parseInt(e.target.value) || 50 
                }))}
                min="50"
                max="95"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Nur Decks über dieser Win-Rate werden als "erfolgreich" betrachtet
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testAgainstTop">Test gegen Top X Decks</Label>
              <Input
                id="testAgainstTop"
                type="number"
                value={config.testAgainstTop}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  testAgainstTop: parseInt(e.target.value) || 10 
                }))}
                min="10"
                max="100"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Finale Validierung gegen die besten Decks
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4 border-t border-border">
          <Button 
            onClick={handleStartTest}
            disabled={isRunning || config.strategies.length === 0}
            variant="victory"
            size="lg"
            className="w-full text-lg py-6"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Test läuft...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Brute-Force Test starten
              </div>
            )}
          </Button>
          
          {config.strategies.length === 0 && (
            <p className="text-destructive text-sm mt-2 text-center">
              Mindestens eine Strategie muss ausgewählt werden
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm">ℹ️ Wie funktioniert der Brute-Force Test?</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Generiert tausende von Deck-Kombinationen</li>
            <li>• Simuliert Battles zwischen allen Decks</li>
            <li>• Analysiert Win-Rates, Synergien und Meta-Trends</li>
            <li>• Identifiziert mathematisch optimale Strategien</li>
            <li>• Berücksichtigt Master-Synergien und Counters</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}