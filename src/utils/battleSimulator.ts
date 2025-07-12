import { Deck, BattleResult } from '@/utils/deckGenerator';
import { Card } from '@/data/cards';

export class BattleSimulator {
  private readonly SIMULATION_ROUNDS = 100;

  simulateBattle(deck1: Deck, deck2: Deck): BattleResult {
    let deck1Wins = 0;
    let totalBattleLength = 0;

    // Simuliere mehrere Runden für statistische Relevanz
    for (let round = 0; round < this.SIMULATION_ROUNDS; round++) {
      const battleResult = this.simulateSingleBattle(deck1, deck2);
      if (battleResult.winner === 'deck1') deck1Wins++;
      totalBattleLength += battleResult.length;
    }

    const winRate = (deck1Wins / this.SIMULATION_ROUNDS) * 100;
    const avgBattleLength = totalBattleLength / this.SIMULATION_ROUNDS;

    return {
      deck1,
      deck2,
      winner: winRate > 50 ? 'deck1' : winRate < 50 ? 'deck2' : 'draw',
      score: Math.round(winRate),
      battleLength: Math.round(avgBattleLength),
      factors: this.analyzeBattleFactors(deck1, deck2)
    };
  }

  private simulateSingleBattle(deck1: Deck, deck2: Deck): { winner: 'deck1' | 'deck2', length: number } {
    // Vereinfachte Battle-Simulation basierend auf Deck-Eigenschaften
    
    let player1Health = deck1.master.health;
    let player2Health = deck2.master.health;
    let turn = 0;
    let mana1 = 1, mana2 = 1;
    
    const hand1 = [...deck1.cards].sort(() => Math.random() - 0.5);
    const hand2 = [...deck2.cards].sort(() => Math.random() - 0.5);
    
    let board1: Card[] = [];
    let board2: Card[] = [];

    while (player1Health > 0 && player2Health > 0 && turn < 50) {
      turn++;
      
      // Mana erhöhen (max 10)
      mana1 = Math.min(10, mana1 + 1);
      mana2 = Math.min(10, mana2 + 1);

      // Spieler 1 Zug
      const damage1 = this.simulatePlayerTurn(hand1, board1, mana1, deck1);
      player2Health -= damage1;

      if (player2Health <= 0) return { winner: 'deck1', length: turn };

      // Spieler 2 Zug
      const damage2 = this.simulatePlayerTurn(hand2, board2, mana2, deck2);
      player1Health -= damage2;

      if (player1Health <= 0) return { winner: 'deck2', length: turn };
    }

    // Timeout -> Gewinner basierend auf verbleibendem Leben
    return { 
      winner: player1Health > player2Health ? 'deck1' : 'deck2', 
      length: turn 
    };
  }

  private simulatePlayerTurn(hand: Card[], board: Card[], mana: number, deck: Deck): number {
    let remainingMana = mana;
    let damageDealt = 0;
    
    // Berechne Board-Damage
    damageDealt += board.reduce((total, card) => total + card.attack, 0);
    
    // Spiele optimale Karten
    const playableCards = hand.filter(card => card.cost <= remainingMana);
    
    // Sortiere nach Effizienz (Attack + Health / Cost)
    playableCards.sort((a, b) => {
      const efficiencyA = (a.attack + a.health) / Math.max(1, a.cost);
      const efficiencyB = (b.attack + b.health) / Math.max(1, b.cost);
      return efficiencyB - efficiencyA;
    });

    for (const card of playableCards) {
      if (remainingMana >= card.cost) {
        remainingMana -= card.cost;
        
        if (card.type === 'Minion' || card.type === 'Building') {
          board.push(card);
        } else if (card.type === 'Spell') {
          // Direkte Damage Spells
          damageDealt += card.attack;
        }

        // Entferne Karte aus Hand
        const cardIndex = hand.indexOf(card);
        if (cardIndex > -1) {
          hand.splice(cardIndex, 1);
        }
      }
    }

    // Zusätzliche Damage durch Master-Fähigkeiten
    damageDealt += this.calculateMasterDamage(deck.master, mana);

    return Math.max(0, damageDealt);
  }

  private calculateMasterDamage(master: any, mana: number): number {
    // Vereinfachte Master-Fähigkeits-Simulation
    let damage = 0;
    
    if (master.perks.includes('Lightning_Bolt') && mana >= 2) damage += 3;
    if (master.perks.includes('Fireball') && mana >= 3) damage += 4;
    if (master.perks.includes('Poison_Volley') && mana >= 2) damage += 2;
    
    return damage;
  }

  private analyzeBattleFactors(deck1: Deck, deck2: Deck): BattleResult['factors'] {
    return {
      costCurve: this.analyzeCostCurve(deck1, deck2),
      synergy: this.analyzeSynergy(deck1, deck2),
      masterSynergy: this.analyzeMasterSynergy(deck1, deck2),
      counterplay: this.analyzeCounterplay(deck1, deck2)
    };
  }

  private analyzeCostCurve(deck1: Deck, deck2: Deck): number {
    // Bewerte Cost-Curve Effizienz
    const curve1 = this.calculateCostCurveScore(deck1);
    const curve2 = this.calculateCostCurveScore(deck2);
    
    return Math.round(((curve1 - curve2) + 1) * 50);
  }

  private calculateCostCurveScore(deck: Deck): number {
    const costs = deck.cards.map(card => card.cost);
    const distribution = [0, 0, 0, 0, 0, 0]; // 0-5+ mana
    
    costs.forEach(cost => {
      if (cost <= 5) distribution[cost]++;
      else distribution[5]++;
    });

    // Ideale Verteilung: 30% 1-2 mana, 40% 3-4 mana, 30% 5+ mana
    const ideal = [0, 0.15, 0.15, 0.2, 0.2, 0.3];
    const actual = distribution.map(count => count / deck.cards.length);
    
    let score = 0;
    for (let i = 0; i < ideal.length; i++) {
      score -= Math.abs(ideal[i] - actual[i]);
    }
    
    return score;
  }

  private analyzeSynergy(deck1: Deck, deck2: Deck): number {
    const synergy1 = deck1.strategySynergy + deck1.factionSynergy;
    const synergy2 = deck2.strategySynergy + deck2.factionSynergy;
    
    return Math.round(((synergy1 - synergy2) / 200 + 1) * 50);
  }

  private analyzeMasterSynergy(deck1: Deck, deck2: Deck): number {
    // Analysiere wie gut Deck mit Master harmoniert
    const master1Synergy = this.calculateMasterDeckSynergy(deck1);
    const master2Synergy = this.calculateMasterDeckSynergy(deck2);
    
    return Math.round(((master1Synergy - master2Synergy) + 1) * 50);
  }

  private calculateMasterDeckSynergy(deck: Deck): number {
    const master = deck.master;
    let synergy = 0;
    
    // Stormbringer + Lightning Karten
    if (master.name === 'Stormbringer') {
      const lightningCards = deck.cards.filter(card => 
        card.synergies?.includes('Lightning') || card.abilities?.includes('Electric')
      ).length;
      synergy += lightningCards * 0.1;
    }
    
    // Mordar + Fire Karten
    if (master.name === 'Mordar') {
      const fireCards = deck.cards.filter(card => 
        card.synergies?.includes('Fire') || card.abilities?.includes('Burn')
      ).length;
      synergy += fireCards * 0.1;
    }
    
    // King Puff + Swarm Karten
    if (master.name === 'King Puff') {
      const swarmCards = deck.cards.filter(card => 
        card.synergies?.includes('Swarm') || card.cost <= 2
      ).length;
      synergy += swarmCards * 0.1;
    }
    
    return Math.min(1, synergy);
  }

  private analyzeCounterplay(deck1: Deck, deck2: Deck): number {
    // Analysiere Counter-Potenzial
    let counterScore = 0;
    
    // AOE vs Swarm
    const deck1AOE = deck1.cards.filter(card => card.abilities?.includes('Area_Damage')).length;
    const deck2Swarm = deck2.cards.filter(card => card.cost <= 2).length;
    if (deck1AOE > 0 && deck2Swarm > 5) counterScore += 0.3;
    
    // Healing vs Aggro
    const deck1Heal = deck1.cards.filter(card => card.abilities?.includes('Heal')).length;
    const deck2AvgCost = deck2.averageCost;
    if (deck1Heal > 0 && deck2AvgCost <= 2.5) counterScore += 0.2;
    
    // Armor vs Direct Damage
    const deck1Armor = deck1.cards.filter(card => card.abilities?.includes('Armor')).length;
    const deck2Spells = deck2.cards.filter(card => card.type === 'Spell').length;
    if (deck1Armor > 0 && deck2Spells > 3) counterScore += 0.2;
    
    return Math.round(counterScore * 100);
  }
}