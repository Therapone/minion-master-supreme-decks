// Dynamische Karten-Datenbank für Minion Masters
import { Card, Master } from '@/data/cards';

interface WikiCardData {
  name: string;
  cost: number;
  health: number;
  damage: number;
  faction: string;
  rarity: string;
  type: string;
  description: string;
  imageUrl: string;
  abilities: string[];
  specialMechanics?: {
    onPlay?: string;
    onDeath?: string;
    passive?: string;
    triggered?: string;
  };
}

// Cache für geladene Karten
const cardCache = new Map<string, Card>();

export class CardDatabase {
  // Vordefinierte echte Kartendaten basierend auf Wiki
  private static wikiCards: Record<string, WikiCardData> = {
    'fire_imp': {
      name: 'Feuer-Kobold',
      cost: 4,
      health: 130,
      damage: 20,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Hinterlässt eine feurige DOT auf dem Boden, die schweren Schaden an Bodeneinheiten im Bereich verursacht.',
      imageUrl: '/src/assets/cards/fire-imp-real.jpg',
      abilities: ['DOT', 'Feueratem'],
      specialMechanics: {
        onDeath: 'Hinterlässt feurige DOT für 10 Ticks à 20 Schaden (200 Gesamtschaden)',
        passive: 'Vorhersage der Bewegung des Ziels'
      }
    },
    'assassin': {
      name: 'Assassine',
      cost: 4,
      health: 150,
      damage: 70,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Tarnung. Verursacht dreifachen Schaden beim Angriff aus der Tarnung.',
      imageUrl: '/src/assets/cards/assassin-real.png',
      abilities: ['Stealth', 'Melee'],
      specialMechanics: {
        onPlay: 'Wird sofort getarnt beim Erscheinen',
        triggered: 'Dreifacher Schaden (210) aus der Tarnung',
        passive: 'Wird nach 2 Sekunden ohne Angriff/Schaden wieder getarnt'
      }
    },
    'colossus': {
      name: 'Koloss',
      cost: 9,
      health: 1000,
      damage: 250,
      faction: 'Voidborne',
      rarity: 'Legendary',
      type: 'Minion',
      description: 'Schlägt Feinde in einem riesigen Bogen vor sich weg.',
      imageUrl: '/src/assets/cards/colossus-real.png',
      abilities: ['AOE', 'Massiv', 'Langsam'],
      specialMechanics: {
        triggered: 'Angriff trifft alle Bodeneinheiten in 180° Bogen',
        passive: 'Sehr langsam (Geschwindigkeit 3), aber enormer AOE-Schaden'
      }
    },
    'guardian': {
      name: 'Wächter',
      cost: 5,
      health: 800,
      damage: 100,
      faction: 'Crystal Elf',
      rarity: 'Supreme',
      type: 'Minion',
      description: 'Absorbiert 66% allen Schadens, der nahestehenden Crystal Elf Bodeneinheiten zugefügt wird.',
      imageUrl: '/src/assets/cards/guardian-real.png',
      abilities: ['Schutzschild', 'Crystal Elf Synergie'],
      specialMechanics: {
        passive: 'Absorbiert 66% des Schadens aller Crystal Elf Einheiten in 9 Reichweite',
        triggered: 'Nur 2 Kopien in Teamkämpfen erlaubt'
      }
    }
  };

  // Konvertierung von Wiki-Daten zu Card-Format
  private static convertWikiToCard(wikiCard: WikiCardData, id: string): Card {
    // Fraktions-Mapping
    const factionMap: Record<string, Card['faction']> = {
      'Voidborne': 'Leere',
      'Crystal Elf': 'Zen-Chi',
      'Empire': 'Imperium',
      'Scrat': 'Scrat',
      'Neutral': 'Neutral'
    };

    // Seltenheits-Mapping  
    const rarityMap: Record<string, Card['rarity']> = {
      'Common': 'Gewöhnlich',
      'Rare': 'Selten',
      'Epic': 'Episch',
      'Legendary': 'Legendär',
      'Supreme': 'Legendär'
    };

    // Typ-Mapping
    const typeMap: Record<string, Card['type']> = {
      'Minion': 'Kreatur',
      'Spell': 'Zauber',
      'Building': 'Gebäude'
    };

    // Effektstärke basierend auf Kosten und Fähigkeiten
    const calculateEffectPower = (cost: number, abilities: string[]): number => {
      let power = Math.min(cost, 5); // Basis-Power basierend auf Kosten
      
      // Bonus für spezielle Fähigkeiten
      if (abilities.includes('Stealth')) power += 3;
      if (abilities.includes('AOE')) power += 2;
      if (abilities.includes('DOT')) power += 2;
      if (abilities.includes('Schutzschild')) power += 2;
      
      return Math.min(power, 10);
    };

    return {
      id,
      name: wikiCard.name,
      cost: wikiCard.cost,
      attack: wikiCard.damage,
      health: wikiCard.health,
      faction: factionMap[wikiCard.faction] || 'Neutral',
      rarity: rarityMap[wikiCard.rarity] || 'Gewöhnlich',
      type: typeMap[wikiCard.type] || 'Kreatur',
      abilities: wikiCard.abilities,
      specialEffects: wikiCard.specialMechanics,
      synergies: this.generateSynergies(wikiCard.abilities),
      image: wikiCard.imageUrl,
      effectPower: calculateEffectPower(wikiCard.cost, wikiCard.abilities)
    };
  }

  // Automatische Synergie-Generierung basierend auf Fähigkeiten
  private static generateSynergies(abilities: string[]): string[] {
    const synergies: string[] = [];
    
    if (abilities.includes('Stealth')) synergies.push('Schatten');
    if (abilities.includes('AOE')) synergies.push('Flächenschaden');
    if (abilities.includes('DOT')) synergies.push('Feuer');
    if (abilities.includes('Schutzschild')) synergies.push('Unterstützung');
    if (abilities.includes('Crystal Elf Synergie')) synergies.push('Crystal Elf');
    if (abilities.includes('Massiv')) synergies.push('Tank');
    
    return synergies;
  }

  // Karte aus Cache oder dynamisch laden
  static async getCard(cardId: string): Promise<Card | null> {
    // Aus Cache laden wenn vorhanden
    if (cardCache.has(cardId)) {
      return cardCache.get(cardId)!;
    }

    // Aus vordefinierter Wiki-Datenbank
    if (this.wikiCards[cardId]) {
      const card = this.convertWikiToCard(this.wikiCards[cardId], cardId);
      cardCache.set(cardId, card);
      return card;
    }

    // Fallback: versuche von Wiki zu laden (simuliert)
    console.log(`Karte ${cardId} nicht in lokaler Datenbank gefunden`);
    return null;
  }

  // Alle verfügbaren Karten laden
  static async getAllCards(): Promise<Card[]> {
    const cards: Card[] = [];
    
    for (const [id, wikiCard] of Object.entries(this.wikiCards)) {
      const card = await this.getCard(id);
      if (card) cards.push(card);
    }
    
    return cards;
  }

  // Karten nach Fraktion filtern
  static async getCardsByFaction(faction: Card['faction']): Promise<Card[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(card => card.faction === faction);
  }

  // Karten nach Mana-Kosten filtern
  static async getCardsByCost(cost: number): Promise<Card[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(card => card.cost === cost);
  }

  // Karten nach Seltenheit filtern
  static async getCardsByRarity(rarity: Card['rarity']): Promise<Card[]> {
    const allCards = await this.getAllCards();
    return allCards.filter(card => card.rarity === rarity);
  }

  // Cache leeren (für Tests oder Aktualisierungen)
  static clearCache(): void {
    cardCache.clear();
  }

  // Karten-Statistiken
  static async getCardStats(): Promise<{
    totalCards: number;
    byFaction: Record<string, number>;
    byRarity: Record<string, number>;
    averageCost: number;
  }> {
    const allCards = await this.getAllCards();
    
    const byFaction: Record<string, number> = {};
    const byRarity: Record<string, number> = {};
    let totalCost = 0;

    allCards.forEach(card => {
      byFaction[card.faction] = (byFaction[card.faction] || 0) + 1;
      byRarity[card.rarity] = (byRarity[card.rarity] || 0) + 1;
      totalCost += card.cost;
    });

    return {
      totalCards: allCards.length,
      byFaction,
      byRarity,
      averageCost: totalCost / allCards.length
    };
  }
}