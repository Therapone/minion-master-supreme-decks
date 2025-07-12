import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { TestConfigurationPanel } from '@/components/TestConfigurationPanel';
import { TestResultsPanel } from '@/components/TestResultsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeckGenerator, TestResults } from '@/utils/deckGenerator';
import { DeckTester, TestConfiguration } from '@/utils/deckTester';
import { Brain, Cpu, Zap, Trophy, Target } from 'lucide-react';

export function BruteForceTestingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [results, setResults] = useState<TestResults | null>(null);
  
  const deckGenerator = new DeckGenerator();
  const deckTester = new DeckTester();

  const handleStartTest = async (config: TestConfiguration) => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    
    try {
      setCurrentTask('Generiere Deck-Kombinationen...');
      
      // Generiere Decks für alle ausgewählten Strategien
      const allDecks = [];
      for (const strategy of config.strategies) {
        const strategyDecks = deckGenerator.generateAllCombinations(
          Math.floor(config.maxDecks / config.strategies.length),
          strategy
        );
        allDecks.push(...strategyDecks);
      }
      
      setCurrentTask(`${allDecks.length} Decks generiert. Starte Battle-Simulation...`);
      
      // Starte Brute-Force Testing
      const testResults = await deckTester.runBruteForceTest(
        allDecks,
        config,
        (progressValue, task) => {
          setProgress(progressValue);
          setCurrentTask(task);
        }
      );
      
      setResults(testResults);
      setCurrentTask('Test abgeschlossen!');
      
    } catch (error) {
      console.error('Test failed:', error);
      setCurrentTask('Test fehlgeschlagen');
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopTest = () => {
    deckTester.stopTest();
    setIsRunning(false);
    setCurrentTask('Test gestoppt');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex justify-center">
              <Badge className="bg-gradient-gaming text-foreground px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Brute-Force Deck Analysis
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Ultimate Deck Optimizer
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mathematisch perfekte Deck-Kombinationen durch systematische Analyse 
              aller möglichen Strategien, Master-Synergien und Karten-Kombinationen.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              <Card className="border-gaming-purple/30">
                <CardContent className="p-4 text-center">
                  <Cpu className="w-8 h-8 text-gaming-purple mx-auto mb-2" />
                  <h3 className="font-semibold">AI-Algorithmen</h3>
                  <p className="text-xs text-muted-foreground">Intelligente Battle-Simulation</p>
                </CardContent>
              </Card>
              
              <Card className="border-gaming-blue/30">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-gaming-blue mx-auto mb-2" />
                  <h3 className="font-semibold">Brute-Force</h3>
                  <p className="text-xs text-muted-foreground">Alle Kombinationen testen</p>
                </CardContent>
              </Card>
              
              <Card className="border-gaming-gold/30">
                <CardContent className="p-4 text-center">
                  <Trophy className="w-8 h-8 text-gaming-gold mx-auto mb-2" />
                  <h3 className="font-semibold">Meta-Analyse</h3>
                  <p className="text-xs text-muted-foreground">Statistische Auswertung</p>
                </CardContent>
              </Card>
              
              <Card className="border-gaming-red/30">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-gaming-red mx-auto mb-2" />
                  <h3 className="font-semibold">Optimierung</h3>
                  <p className="text-xs text-muted-foreground">Maximale Win-Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div>
              <TestConfigurationPanel 
                onStartTest={handleStartTest}
                isRunning={isRunning}
              />
            </div>
            
            {/* Results Panel */}
            <div>
              <TestResultsPanel
                results={results}
                progress={progress}
                currentTask={currentTask}
                isRunning={isRunning}
                onStopTest={handleStopTest}
              />
            </div>
          </div>

          {/* Algorithm Info */}
          <Card className="mt-12 bg-muted/20 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Algorithmus-Details
              </CardTitle>
            </CardHeader>
            
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gaming-purple">1. Deck Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Alle Master-Kombinationen</li>
                  <li>• Strategische Archetypen</li>
                  <li>• Synergie-Optimierung</li>
                  <li>• Cost-Curve Balancing</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gaming-blue">2. Battle Simulation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 100+ Battles pro Matchup</li>
                  <li>• Realistische Game-Mechaniken</li>
                  <li>• Master-Fähigkeiten</li>
                  <li>• RNG-Simulation</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gaming-gold">3. Result Analysis</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Statistische Signifikanz</li>
                  <li>• Meta-Trend Erkennung</li>
                  <li>• Counter-Strategien</li>
                  <li>• Win-Rate Optimierung</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}