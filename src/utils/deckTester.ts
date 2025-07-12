import { Deck, TestResults, BattleResult } from '@/utils/deckGenerator';
import { BattleSimulator } from '@/utils/battleSimulator';

export interface TestConfiguration {
  maxDecks: number;
  testAgainstTop: number;
  strategies: string[];
  minWinRate: number;
  testDepth: 'QUICK' | 'NORMAL' | 'EXTENSIVE';
}

export class DeckTester {
  private battleSimulator: BattleSimulator;
  private isRunning: boolean = false;
  private currentProgress: number = 0;
  
  constructor() {
    this.battleSimulator = new BattleSimulator();
  }

  async runBruteForceTest(
    decks: Deck[],
    config: TestConfiguration,
    onProgress?: (progress: number, current: string) => void
  ): Promise<TestResults> {
    this.isRunning = true;
    this.currentProgress = 0;

    const results = new Map<string, { wins: number, total: number, winRate: number }>();
    const battleResults: BattleResult[] = [];
    
    // Initialisiere alle Decks mit 0 wins
    decks.forEach(deck => {
      results.set(deck.id, { wins: 0, total: 0, winRate: 0 });
    });

    const totalBattles = this.calculateTotalBattles(decks.length, config);
    let completedBattles = 0;

    try {
      // Teste jedes Deck gegen andere
      for (let i = 0; i < decks.length && this.isRunning; i++) {
        const deck1 = decks[i];
        
        onProgress?.(
          (completedBattles / totalBattles) * 100,
          `Testing ${deck1.master.name} - ${deck1.strategy}`
        );

        // Bestimme Gegner basierend auf Test-Tiefe
        const opponents = this.selectOpponents(decks, i, config);
        
        for (const opponent of opponents) {
          if (!this.isRunning) break;
          
          const battleResult = this.battleSimulator.simulateBattle(deck1, opponent);
          battleResults.push(battleResult);
          
          // Aktualisiere Statistiken
          const deck1Stats = results.get(deck1.id)!;
          const deck2Stats = results.get(opponent.id)!;
          
          deck1Stats.total++;
          deck2Stats.total++;
          
          if (battleResult.winner === 'deck1') {
            deck1Stats.wins++;
          } else if (battleResult.winner === 'deck2') {
            deck2Stats.wins++;
          } else {
            // Draw - beide bekommen halben Sieg
            deck1Stats.wins += 0.5;
            deck2Stats.wins += 0.5;
          }
          
          // Berechne Win-Rate
          deck1Stats.winRate = (deck1Stats.wins / deck1Stats.total) * 100;
          deck2Stats.winRate = (deck2Stats.wins / deck2Stats.total) * 100;
          
          completedBattles++;
          
          // Update Progress
          if (completedBattles % 10 === 0) {
            onProgress?.(
              (completedBattles / totalBattles) * 100,
              `${completedBattles}/${totalBattles} battles completed`
            );
          }
        }
      }

      // Sortiere Decks nach Win-Rate
      const sortedDecks = decks
        .map(deck => ({
          deck,
          winRate: results.get(deck.id)?.winRate || 0,
          totalGames: results.get(deck.id)?.total || 0
        }))
        .filter(item => item.totalGames >= 5) // Mindestens 5 Spiele
        .sort((a, b) => b.winRate - a.winRate);

      const finalResults = new Map<string, number>();
      sortedDecks.forEach(({ deck, winRate }) => {
        finalResults.set(deck.id, winRate);
      });

      const testResults: TestResults = {
        totalTests: totalBattles,
        completedTests: completedBattles,
        bestDecks: sortedDecks.slice(0, 10).map(item => item.deck),
        worstDecks: sortedDecks.slice(-5).map(item => item.deck),
        averageWinRate: this.calculateAverageWinRate(finalResults),
        results: finalResults
      };

      onProgress?.(100, 'Test completed!');
      
      return testResults;

    } catch (error) {
      console.error('Error during deck testing:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  private calculateTotalBattles(deckCount: number, config: TestConfiguration): number {
    switch (config.testDepth) {
      case 'QUICK':
        return Math.min(deckCount * 10, 1000);
      case 'NORMAL':
        return Math.min(deckCount * 20, 5000);
      case 'EXTENSIVE':
        return Math.min((deckCount * (deckCount - 1)) / 2, 20000); // Jeder gegen jeden
      default:
        return deckCount * 10;
    }
  }

  private selectOpponents(decks: Deck[], currentIndex: number, config: TestConfiguration): Deck[] {
    const opponents: Deck[] = [];
    
    switch (config.testDepth) {
      case 'QUICK':
        // Teste gegen 10 zufällige Gegner
        for (let i = 0; i < 10 && i < decks.length - 1; i++) {
          let opponentIndex;
          do {
            opponentIndex = Math.floor(Math.random() * decks.length);
          } while (opponentIndex === currentIndex);
          opponents.push(decks[opponentIndex]);
        }
        break;
        
      case 'NORMAL':
        // Teste gegen 20 Gegner (Mix aus zufällig und strategisch)
        const randomOpponents = 15;
        const strategicOpponents = 5;
        
        // Zufällige Gegner
        for (let i = 0; i < randomOpponents && i < decks.length - 1; i++) {
          let opponentIndex;
          do {
            opponentIndex = Math.floor(Math.random() * decks.length);
          } while (opponentIndex === currentIndex);
          opponents.push(decks[opponentIndex]);
        }
        
        // Strategisch ähnliche/verschiedene Gegner
        const currentDeck = decks[currentIndex];
        const strategicOptions = decks
          .filter((_, index) => index !== currentIndex)
          .sort((a, b) => {
            const similarityA = this.calculateStrategySimilarity(currentDeck, a);
            const similarityB = this.calculateStrategySimilarity(currentDeck, b);
            return Math.abs(0.5 - similarityA) - Math.abs(0.5 - similarityB);
          });
        
        opponents.push(...strategicOptions.slice(0, strategicOpponents));
        break;
        
      case 'EXTENSIVE':
        // Teste gegen alle anderen Decks
        opponents.push(...decks.filter((_, index) => index !== currentIndex));
        break;
    }
    
    return opponents;
  }

  private calculateStrategySimilarity(deck1: Deck, deck2: Deck): number {
    // Berechne Ähnlichkeit zwischen zwei Decks (0 = komplett verschieden, 1 = identisch)
    let similarity = 0;
    
    // Master-Ähnlichkeit
    if (deck1.master.faction === deck2.master.faction) similarity += 0.2;
    if (deck1.master.name === deck2.master.name) similarity += 0.3;
    
    // Strategie-Ähnlichkeit
    if (deck1.strategy === deck2.strategy) similarity += 0.3;
    
    // Cost-Curve Ähnlichkeit
    const costDiff = Math.abs(deck1.averageCost - deck2.averageCost);
    similarity += Math.max(0, 0.2 - costDiff * 0.1);
    
    return Math.min(1, similarity);
  }

  private calculateAverageWinRate(results: Map<string, number>): number {
    if (results.size === 0) return 0;
    
    const totalWinRate = Array.from(results.values()).reduce((sum, rate) => sum + rate, 0);
    return totalWinRate / results.size;
  }

  stopTest(): void {
    this.isRunning = false;
  }

  isTestRunning(): boolean {
    return this.isRunning;
  }

  getCurrentProgress(): number {
    return this.currentProgress;
  }

  // Erweiterte Analyse-Funktionen
  analyzeMetaTrends(results: TestResults): {
    topStrategies: { strategy: string; avgWinRate: number; count: number }[];
    topMasters: { master: string; avgWinRate: number; count: number }[];
    topFactions: { faction: string; avgWinRate: number; count: number }[];
  } {
    const strategyMap = new Map<string, { totalWinRate: number; count: number }>();
    const masterMap = new Map<string, { totalWinRate: number; count: number }>();
    const factionMap = new Map<string, { totalWinRate: number; count: number }>();

    // Sammle Daten von den besten Decks
    results.bestDecks.forEach(deck => {
      const winRate = results.results.get(deck.id) || 0;
      
      // Strategie
      const stratData = strategyMap.get(deck.strategy) || { totalWinRate: 0, count: 0 };
      stratData.totalWinRate += winRate;
      stratData.count++;
      strategyMap.set(deck.strategy, stratData);
      
      // Master
      const masterData = masterMap.get(deck.master.name) || { totalWinRate: 0, count: 0 };
      masterData.totalWinRate += winRate;
      masterData.count++;
      masterMap.set(deck.master.name, masterData);
      
      // Fraktion
      const factionData = factionMap.get(deck.master.faction) || { totalWinRate: 0, count: 0 };
      factionData.totalWinRate += winRate;
      factionData.count++;
      factionMap.set(deck.master.faction, factionData);
    });

    return {
      topStrategies: Array.from(strategyMap.entries())
        .map(([strategy, data]) => ({
          strategy,
          avgWinRate: data.totalWinRate / data.count,
          count: data.count
        }))
        .sort((a, b) => b.avgWinRate - a.avgWinRate),
      
      topMasters: Array.from(masterMap.entries())
        .map(([master, data]) => ({
          master,
          avgWinRate: data.totalWinRate / data.count,
          count: data.count
        }))
        .sort((a, b) => b.avgWinRate - a.avgWinRate),
      
      topFactions: Array.from(factionMap.entries())
        .map(([faction, data]) => ({
          faction,
          avgWinRate: data.totalWinRate / data.count,
          count: data.count
        }))
        .sort((a, b) => b.avgWinRate - a.avgWinRate)
    };
  }
}