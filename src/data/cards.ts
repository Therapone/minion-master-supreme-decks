// Minion Masters Karten-Datenbank mit dynamischem Wiki-Loader
import scratImage from '@/assets/cards/scrat-generated.png';
import assassinImage from '@/assets/cards/assassin-real.png';
import fireImpImage from '@/assets/cards/fire-imp-real.jpg';
import colossusImage from '@/assets/cards/colossus-real.png';
import guardianImage from '@/assets/cards/guardian-real.png';
import { WikiCardLoader } from '@/utils/wikiCardLoader';
export interface Card {
  id: string;
  name: string;
  cost: number;
  attack: number;
  health: number;
  faction: 'Legion' | 'Imperium' | 'Leere' | 'Scrat' | 'Zen-Chi' | 'Neutral';
  rarity: 'Gewöhnlich' | 'Selten' | 'Episch' | 'Legendär';
  type: 'Kreatur' | 'Zauber' | 'Gebäude';
  abilities?: string[];
  specialEffects?: {
    onPlay?: string;
    onDeath?: string;
    passive?: string;
    triggered?: string;
  };
  synergies?: string[];
  image?: string;
  effectPower?: number; // 1-10 Skala für Effektstärke
}

export interface Master {
  id: string;
  name: string;
  health: number;
  perks: string[];
  faction: Card['faction'];
  image?: string;
  description?: string;
}

export const MASTERS: Master[] = [
  {
    id: 'stormbringer',
    name: 'Sturmrufer',
    health: 15,
    perks: ['Blitzschlag', 'Kettenblitz', 'Überladung'],
    faction: 'Imperium',
    description: 'Meister der Blitze und elektrischen Energie'
  },
  {
    id: 'mordar',
    name: 'Mordar',
    health: 20,
    perks: ['Feuerball', 'Verbrennung', 'Feuer-Kobold beschwören'],
    faction: 'Legion',
    description: 'Dunkler Magier der Feuerkraft'
  },
  {
    id: 'apep',
    name: 'Apep',
    health: 18,
    perks: ['Giftsalve', 'Schlangennest', 'Schlängeln'],
    faction: 'Leere',
    description: 'Schlangengott der Leere'
  },
  {
    id: 'king_puff',
    name: 'König Puff',
    health: 16,
    perks: ['Puff-Stampfer', 'Scrat-Rudel', 'Schwarm-Taktik'],
    faction: 'Scrat',
    description: 'Anführer der Scrat-Horden'
  },
  {
    id: 'settsu',
    name: 'Settsu',
    health: 17,
    perks: ['Geister-Infusion', 'Meditation', 'Chi-Explosion'],
    faction: 'Zen-Chi',
    description: 'Erleuchteter Mönch des Zen-Chi'
  }
];

export const CARDS: Card[] = [
  // 1 Mana Karten
  {
    id: 'scrat',
    name: 'Scrat',
    cost: 1,
    attack: 3,
    health: 1,
    faction: 'Scrat',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Schnell'],
    specialEffects: {
      passive: 'Bewegt sich doppelt so schnell wie normale Kreaturen'
    },
    synergies: ['Schwarm'],
    effectPower: 3,
    image: scratImage
  },
  {
    id: 'fire_imp',
    name: 'Feuer-Kobold',
    cost: 4,
    attack: 20,
    health: 130,
    faction: 'Leere',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['DOT', 'Feueratem', 'Fernkampf'],
    specialEffects: {
      triggered: 'Hinterlässt feurige DOT für 10 Ticks à 20 Schaden (200 Gesamtschaden)',
      passive: 'Vorhersage der Bewegung des Ziels, AOE-Radius 3'
    },
    synergies: ['Feuer', 'DOT', 'Fernkampf'],
    effectPower: 7,
    image: fireImpImage
  },
  {
    id: 'shockrock',
    name: 'Schockfels',
    cost: 1,
    attack: 2,
    health: 1,
    faction: 'Imperium',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Elektrisiert'],
    specialEffects: {
      onPlay: 'Betäubt nahestehende Feinde für 1 Sekunde'
    },
    synergies: ['Blitz'],
    effectPower: 2,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'
  },
  
  // 2 Mana Karten
  {
    id: 'assassin',
    name: 'Assassine',
    cost: 4,
    attack: 70,
    health: 150,
    faction: 'Leere',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Stealth', 'Melee'],
    specialEffects: {
      onPlay: 'Wird sofort getarnt beim Erscheinen',
      triggered: 'Dreifacher Schaden (210) aus der Tarnung',
      passive: 'Wird nach 2 Sekunden ohne Angriff/Schaden wieder getarnt'
    },
    synergies: ['Schatten', 'Stealth'],
    effectPower: 8,
    image: assassinImage
  },
  {
    id: 'warrior',
    name: 'Krieger',
    cost: 2,
    attack: 3,
    health: 3,
    faction: 'Imperium',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Rüstung'],
    specialEffects: {
      passive: 'Reduziert eingehenden Schaden um 1 (mindestens 1)'
    },
    synergies: ['Tank'],
    effectPower: 3,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
  },
  {
    id: 'priest',
    name: 'Priester',
    cost: 2,
    attack: 1,
    health: 4,
    faction: 'Zen-Chi',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Heilung'],
    specialEffects: {
      triggered: 'Heilt alle verbündeten Kreaturen um 2 HP alle 3 Sekunden'
    },
    synergies: ['Unterstützung'],
    effectPower: 5,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
  },

  // 3 Mana Karten
  {
    id: 'knight',
    name: 'Ritter',
    cost: 3,
    attack: 4,
    health: 5,
    faction: 'Imperium',
    rarity: 'Selten',
    type: 'Kreatur',
    abilities: ['Rüstung', 'Spott'],
    specialEffects: {
      passive: 'Zwingt nahestehende Feinde ihn anzugreifen',
      triggered: 'Erhält +1 Rüstung für jeden verbündeten Krieger'
    },
    synergies: ['Tank', 'Verteidigung'],
    effectPower: 5,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'
  },
  {
    id: 'demon',
    name: 'Dämon',
    cost: 3,
    attack: 5,
    health: 3,
    faction: 'Legion',
    rarity: 'Selten',
    type: 'Kreatur',
    abilities: ['Lebensraub'],
    specialEffects: {
      triggered: 'Heilt sich um den verursachten Schaden'
    },
    synergies: ['Dämon'],
    effectPower: 4,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400'
  },
  {
    id: 'arcane_bolt',
    name: 'Arkaner Blitz',
    cost: 3,
    attack: 6,
    health: 0,
    faction: 'Neutral',
    rarity: 'Gewöhnlich',
    type: 'Zauber',
    abilities: ['Direktschaden'],
    specialEffects: {
      onPlay: 'Verursacht 6 Magieschaden an einem Ziel'
    },
    synergies: ['Zauber'],
    effectPower: 6,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
  },

  // 4 Mana Karten
  {
    id: 'colossus',
    name: 'Koloss',
    cost: 9,
    attack: 250,
    health: 1000,
    faction: 'Leere',
    rarity: 'Legendär',
    type: 'Kreatur',
    abilities: ['AOE', 'Massiv', 'Langsam'],
    specialEffects: {
      triggered: 'Angriff trifft alle Bodeneinheiten in 180° Bogen vor sich',
      passive: 'Sehr langsam (Geschwindigkeit 3), aber enormer AOE-Schaden'
    },
    synergies: ['Tank', 'AOE', 'Legendär'],
    effectPower: 10,
    image: colossusImage
  },
  {
    id: 'dragon',
    name: 'Drache',
    cost: 4,
    attack: 5,
    health: 6,
    faction: 'Legion',
    rarity: 'Episch',
    type: 'Kreatur',
    abilities: ['Fliegend', 'Feueratem'],
    specialEffects: {
      passive: 'Kann über Bodeneinheiten hinwegfliegen',
      triggered: 'Feueratem verursacht Flächenschaden alle 4 Sekunden'
    },
    synergies: ['Drache', 'Feuer'],
    effectPower: 8,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'
  },
  {
    id: 'void_lord',
    name: 'Leerenherr',
    cost: 4,
    attack: 4,
    health: 7,
    faction: 'Leere',
    rarity: 'Episch',
    type: 'Kreatur',
    abilities: ['Leerendiener_beschwören'],
    specialEffects: {
      onPlay: 'Beschwört 2 Leerendiener (1/1)',
      onDeath: 'Beschwört 1 Leerendiener für jeden verlorenen HP'
    },
    synergies: ['Leere', 'Beschwörung'],
    effectPower: 7,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400'
  },

  // 5+ Mana Karten
  {
    id: 'legendary_titan',
    name: 'Legendärer Titan',
    cost: 5,
    attack: 8,
    health: 10,
    faction: 'Neutral',
    rarity: 'Legendär',
    type: 'Kreatur',
    abilities: ['Immunität', 'Flächenschaden'],
    specialEffects: {
      passive: 'Immun gegen Zauber und Fähigkeiten',
      triggered: 'Jeder Angriff trifft alle Feinde in der Nähe'
    },
    synergies: ['Legendär', 'Massiv'],
    effectPower: 10,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
  },
  {
    id: 'meteor',
    name: 'Meteor',
    cost: 5,
    attack: 10,
    health: 0,
    faction: 'Legion',
    rarity: 'Selten',
    type: 'Zauber',
    abilities: ['Flächenschaden'],
    specialEffects: {
      onPlay: 'Verursacht 10 Schaden in einem großen Gebiet nach 2 Sekunden Verzögerung'
    },
    synergies: ['Zauber', 'Zerstörung'],
    effectPower: 9,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
  },

  // Weitere strategische Karten
  {
    id: 'scrat_horde',
    name: 'Scrat-Horde',
    cost: 2,
    attack: 1,
    health: 1,
    faction: 'Scrat',
    rarity: 'Gewöhnlich',
    type: 'Zauber',
    abilities: ['Mehrfach_beschwören'],
    specialEffects: {
      onPlay: 'Beschwört 4 Scrats an zufälligen Positionen'
    },
    synergies: ['Schwarm', 'Scrat'],
    effectPower: 6,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'
  },
  {
    id: 'healing_shrine',
    name: 'Heilungsschrein',
    cost: 3,
    attack: 0,
    health: 6,
    faction: 'Zen-Chi',
    rarity: 'Selten',
    type: 'Gebäude',
    abilities: ['Heilungsaura'],
    specialEffects: {
      passive: 'Heilt alle verbündeten Einheiten in der Nähe um 1 HP pro Sekunde'
    },
    synergies: ['Unterstützung', 'Gebäude'],
    effectPower: 5,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400'
  },
  {
    id: 'lightning_tower',
    name: 'Blitzturm',
    cost: 4,
    attack: 4,
    health: 8,
    faction: 'Imperium',
    rarity: 'Selten',
    type: 'Gebäude',
    abilities: ['Auto_Angriff', 'Blitzkette'],
    specialEffects: {
      passive: 'Greift automatisch den nächsten Feind an',
      triggered: 'Blitz springt auf bis zu 3 weitere Feinde über'
    },
    synergies: ['Verteidigung', 'Blitz'],
    effectPower: 6,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
  },

  // Zusätzliche Karten für bessere Deck-Diversität
  {
    id: 'crystal_sentry',
    name: 'Kristallwächter',
    cost: 2,
    attack: 2,
    health: 4,
    faction: 'Imperium',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Kristallschild'],
    specialEffects: {
      triggered: 'Reflektiert 50% des erhaltenen Schadens zurück'
    },
    synergies: ['Kristall', 'Verteidigung'],
    effectPower: 4,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
  },
  {
    id: 'shadow_walker',
    name: 'Schattenwandler',
    cost: 3,
    attack: 3,
    health: 2,
    faction: 'Leere',
    rarity: 'Selten',
    type: 'Kreatur',
    abilities: ['Schatten-Teleport'],
    specialEffects: {
      triggered: 'Kann sich alle 5 Sekunden zu einem anderen Ort teleportieren'
    },
    synergies: ['Schatten', 'Mobilität'],
    effectPower: 5,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400'
  },
  {
    id: 'zen_master',
    name: 'Zen-Meister',
    cost: 4,
    attack: 2,
    health: 6,
    faction: 'Zen-Chi',
    rarity: 'Episch',
    type: 'Kreatur',
    abilities: ['Chi-Verstärkung'],
    specialEffects: {
      passive: 'Alle verbündeten Kreaturen erhalten +1 Angriff',
      triggered: 'Verstärkt sich selbst um +2/+2 wenn ein Verbündeter stirbt'
    },
    synergies: ['Chi', 'Verstärkung'],
    effectPower: 7,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400'
  },
  {
    id: 'flame_spirit',
    name: 'Flammengeist',
    cost: 1,
    attack: 3,
    health: 1,
    faction: 'Legion',
    rarity: 'Gewöhnlich',
    type: 'Kreatur',
    abilities: ['Elemental'],
    specialEffects: {
      onDeath: 'Verursacht 3 Feuerschaden an einem zufälligen Feind'
    },
    synergies: ['Feuer', 'Elemental'],
    effectPower: 4,
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
  },
  {
    id: 'guardian',
    name: 'Wächter',
    cost: 5,
    attack: 100,
    health: 800,
    faction: 'Zen-Chi',
    rarity: 'Legendär',
    type: 'Kreatur',
    abilities: ['Schutzschild', 'Crystal Elf Synergie'],
    specialEffects: {
      passive: 'Absorbiert 66% des Schadens aller Crystal Elf Einheiten in 9 Reichweite',
      triggered: 'Nur 2 Kopien in Teamkämpfen erlaubt'
    },
    synergies: ['Zen-Chi', 'Unterstützung', 'Schutz'],
    effectPower: 9,
    image: guardianImage
  },
  {
    id: 'scrat_tank',
    name: 'Scrat-Panzer',
    cost: 3,
    attack: 1,
    health: 7,
    faction: 'Scrat',
    rarity: 'Selten',
    type: 'Kreatur',
    abilities: ['Gepanzert', 'Scrat-Boost'],
    specialEffects: {
      passive: 'Erhält +1 Angriff für jeden anderen Scrat auf dem Feld'
    },
    synergies: ['Scrat', 'Tank'],
    effectPower: 5,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
  }
];

// Dynamische Kartengenerierung - kombiniert statische und Wiki-Karten
export async function loadAllCards(): Promise<Card[]> {
  try {
    // Lade bis zu 300 Karten von der Wiki
    const wikiCards = await WikiCardLoader.loadRandomCards(300);
    const convertedCards = wikiCards.map(card => WikiCardLoader.wikiToInternalCard(card));
    
    console.log(`${wikiCards.length} Karten von Wiki geladen`);
    
    // Kombiniere mit statischen Karten (entferne Duplikate)
    const staticCardIds = new Set(CARDS.map(card => card.id));
    const uniqueWikiCards = convertedCards.filter(card => !staticCardIds.has(card.id));
    
    return [...CARDS, ...uniqueWikiCards];
  } catch (error) {
    console.error('Fehler beim Laden der Wiki-Karten:', error);
    return CARDS;
  }
}

// Funktion für erweiterte Kartendatenbank
export async function getExtendedCardDatabase(maxCards: number = 50): Promise<Card[]> {
  const allCards = await loadAllCards();
  return allCards.slice(0, maxCards);
}
export async function getAllAvailableCards(): Promise<Card[]> {
  try {
    // Lade zusätzliche Karten von der Wiki
    const wikiCardIds = await WikiCardLoader.loadCardList();
    const wikiCards = await WikiCardLoader.loadCards(wikiCardIds.slice(0, 50)); // Erste 50 für Performance
    
    // Konvertiere Wiki-Karten zu internem Format
    const convertedWikiCards = wikiCards.map(wikiCard => WikiCardLoader.wikiToInternalCard(wikiCard));
    
    // Kombiniere statische und Wiki-Karten (entferne Duplikate)
    const staticCardIds = new Set(CARDS.map(card => card.id));
    const uniqueWikiCards = convertedWikiCards.filter(wikiCard => !staticCardIds.has(wikiCard.id));
    
    return [...CARDS, ...uniqueWikiCards];
  } catch (error) {
    console.error('Fehler beim Laden der Wiki-Karten:', error);
    return CARDS; // Fallback auf statische Karten
  }
}

// Erweiterte Kartengenerierung für große Mengen
export async function generateExtendedCardPool(maxCards: number = 200): Promise<Card[]> {
  try {
    const wikiCardIds = await WikiCardLoader.loadCardList();
    const selectedIds = wikiCardIds.slice(0, Math.min(maxCards - CARDS.length, wikiCardIds.length));
    const wikiCards = await WikiCardLoader.loadCards(selectedIds);
    
    const convertedCards = wikiCards.map(wikiCard => WikiCardLoader.wikiToInternalCard(wikiCard));
    
    return [...CARDS, ...convertedCards];
  } catch (error) {
    console.error('Fehler beim Erstellen des erweiterten Card-Pools:', error);
    return CARDS;
  }
}

// Vordefinierte Strategie-Archetypen für Tester
export const STRATEGY_ARCHETYPES = {
  AGGRO: {
    name: 'Aggro Rush',
    description: 'Schnelle, aggressive Strategie mit niedrigen Mana-Kosten',
    preferredCosts: [1, 2, 3],
    synergies: ['Schnell', 'Schwarm'],
    maxCost: 3,
    effectPowerWeight: 1.2 // Bevorzugt Karten mit starken Sofort-Effekten
  },
  CONTROL: {
    name: 'Kontrolle',
    description: 'Defensive Strategie mit starken späten Karten',
    preferredCosts: [3, 4, 5],
    synergies: ['Tank', 'Verteidigung', 'Heilung'],
    maxCost: 5,
    effectPowerWeight: 1.5 // Bevorzugt Karten mit dauerhaften Effekten
  },
  MIDRANGE: {
    name: 'Mittelfeld',
    description: 'Ausgewogene Strategie mit mittleren Mana-Kosten',
    preferredCosts: [2, 3, 4],
    synergies: ['Ausgeglichen'],
    maxCost: 4,
    effectPowerWeight: 1.0 // Neutrale Gewichtung
  },
  COMBO: {
    name: 'Kombination',
    description: 'Synergie-basierte Strategie mit Kartenkombinationen',
    preferredCosts: [1, 2, 3, 4],
    synergies: ['Zauber', 'Synergie'],
    maxCost: 5,
    effectPowerWeight: 1.8 // Stark bevorzugt Karten mit kombinierbaren Effekten
  }
};