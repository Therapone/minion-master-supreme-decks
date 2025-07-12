import { Card, Master, CARDS, MASTERS } from '@/data/cards';

export interface Deck {
  id: string;
  master: Master;
  cards: Card[];
  strategy: string;
  totalCost: number;
  averageCost: number;
  factionSynergy: number;
  strategySynergy: number;
}

export interface BattleResult {
  deck1: Deck;
  deck2: Deck;
  winner: 'deck1' | 'deck2' | 'draw';
  score: number; // 0-100
  battleLength: number;
  factors: {
    costCurve: number;
    synergy: number;
    masterSynergy: number;
    counterplay: number;
  };
}

export interface TestResults {
  totalTests: number;
  completedTests: number;
  bestDecks: Deck[];
  worstDecks: Deck[];
  averageWinRate: number;
  results: Map<string, number>; // deck ID -> win rate
}

export class DeckGenerator {
  private readonly DECK_SIZE = 10;
  private readonly MAX_SAME_CARD = 1; // Singleton format

  generateAllCombinations(
    maxDecks: number = 1000,
    strategy?: string
  ): Deck[] {
    const decks: Deck[] = [];
    let deckId = 0;

    // Für jeden Master
    for (const master of MASTERS) {
      const masterDecks = this.generateDecksForMaster(
        master,
        Math.floor(maxDecks / MASTERS.length),
        strategy
      );
      
      decks.push(...masterDecks.map(deck => ({
        ...deck,
        id: `deck_${deckId++}`
      })));
    }

    return decks;
  }

  private generateDecksForMaster(
    master: Master,
    maxDecks: number,
    strategy?: string
  ): Omit<Deck, 'id'>[] {
    const decks: Omit<Deck, 'id'>[] = [];
    const availableCards = this.getFilteredCards(master, strategy);

    // Generiere zufällige Kombinationen
    for (let i = 0; i < maxDecks && i < 10000; i++) {
      const cards = this.generateRandomDeck(availableCards);
      if (cards.length === this.DECK_SIZE) {
        const deck = this.createDeck(master, cards, strategy || 'Mixed');
        decks.push(deck);
      }
    }

    // Generiere auch strategische Decks
    if (strategy) {
      const strategicDecks = this.generateStrategicDecks(master, availableCards, strategy);
      decks.push(...strategicDecks);
    }

    return decks;
  }

  private getFilteredCards(master: Master, strategy?: string): Card[] {
    let cards = [...CARDS];

    // Bevorzuge Karten der gleichen Fraktion
    cards = cards.sort((a, b) => {
      const aFactionMatch = a.faction === master.faction || a.faction === 'Neutral' ? 1 : 0;
      const bFactionMatch = b.faction === master.faction || b.faction === 'Neutral' ? 1 : 0;
      return bFactionMatch - aFactionMatch;
    });

    return cards;
  }

  private generateRandomDeck(availableCards: Card[]): Card[] {
    const deck: Card[] = [];
    const usedCards = new Set<string>();

    for (let i = 0; i < this.DECK_SIZE; i++) {
      const remainingCards = availableCards.filter(card => !usedCards.has(card.id));
      
      if (remainingCards.length === 0) break;

      const randomCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
      deck.push(randomCard);
      usedCards.add(randomCard.id);
    }

    return deck;
  }

  private generateStrategicDecks(
    master: Master,
    availableCards: Card[],
    strategy: string
  ): Omit<Deck, 'id'>[] {
    const decks: Omit<Deck, 'id'>[] = [];

    // Aggro Deck
    if (strategy === 'AGGRO') {
      const aggroCards = availableCards
        .filter(card => card.cost <= 3)
        .filter(card => card.abilities?.includes('Fast') || card.attack >= card.cost * 1.5)
        .slice(0, this.DECK_SIZE);
      
      if (aggroCards.length === this.DECK_SIZE) {
        decks.push(this.createDeck(master, aggroCards, strategy));
      }
    }

    // Control Deck
    if (strategy === 'CONTROL') {
      const controlCards = availableCards
        .filter(card => 
          card.cost >= 3 || 
          card.abilities?.includes('Heal') || 
          card.abilities?.includes('Armor') ||
          card.type === 'Building'
        )
        .slice(0, this.DECK_SIZE);
      
      if (controlCards.length === this.DECK_SIZE) {
        decks.push(this.createDeck(master, controlCards, strategy));
      }
    }

    return decks;
  }

  private createDeck(master: Master, cards: Card[], strategy: string): Omit<Deck, 'id'> {
    const totalCost = cards.reduce((sum, card) => sum + card.cost, 0);
    const averageCost = totalCost / cards.length;
    
    return {
      master,
      cards,
      strategy,
      totalCost,
      averageCost,
      factionSynergy: this.calculateFactionSynergy(master, cards),
      strategySynergy: this.calculateStrategySynergy(cards, strategy)
    };
  }

  private calculateFactionSynergy(master: Master, cards: Card[]): number {
    const sameFactionsCount = cards.filter(card => 
      card.faction === master.faction || card.faction === 'Neutral'
    ).length;
    return (sameFactionsCount / cards.length) * 100;
  }

  private calculateStrategySynergy(cards: Card[], strategy: string): number {
    // Vereinfachte Synergie-Berechnung
    let synergy = 0;
    
    const costs = cards.map(card => card.cost);
    const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

    switch (strategy) {
      case 'AGGRO':
        synergy = avgCost <= 2.5 ? 100 : Math.max(0, 100 - (avgCost - 2.5) * 20);
        break;
      case 'CONTROL':
        synergy = avgCost >= 3 ? 100 : Math.max(0, avgCost * 25);
        break;
      case 'MIDRANGE':
        synergy = avgCost >= 2.5 && avgCost <= 3.5 ? 100 : Math.max(0, 100 - Math.abs(avgCost - 3) * 30);
        break;
      default:
        synergy = 50;
    }

    return Math.round(synergy);
  }
}