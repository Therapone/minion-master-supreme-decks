// Minion Masters Karten-Datenbank
export interface Card {
  id: string;
  name: string;
  cost: number;
  attack: number;
  health: number;
  faction: 'Legion' | 'Empires' | 'Voidborne' | 'Scrat' | 'Zen-Chi' | 'Neutral';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  type: 'Minion' | 'Spell' | 'Building';
  abilities?: string[];
  synergies?: string[];
  image?: string;
}

export interface Master {
  id: string;
  name: string;
  health: number;
  perks: string[];
  faction: Card['faction'];
  image?: string;
}

export const MASTERS: Master[] = [
  {
    id: 'stormbringer',
    name: 'Stormbringer',
    health: 15,
    perks: ['Lightning_Bolt', 'Chain_Lightning', 'Overcharge'],
    faction: 'Empires',
  },
  {
    id: 'mordar',
    name: 'Mordar',
    health: 20,
    perks: ['Fireball', 'Combustion', 'Fire_Imp_Spawn'],
    faction: 'Legion',
  },
  {
    id: 'apep',
    name: 'Apep',
    health: 18,
    perks: ['Poison_Volley', 'Snake_Nest', 'Slither'],
    faction: 'Voidborne',
  },
  {
    id: 'king_puff',
    name: 'King Puff',
    health: 16,
    perks: ['Puff_Stomp', 'Scrat_Pack', 'Swarm_Tactics'],
    faction: 'Scrat',
  },
  {
    id: 'settsu',
    name: 'Settsu',
    health: 17,
    perks: ['Spirit_Infusion', 'Meditation', 'Chi_Burst'],
    faction: 'Zen-Chi',
  }
];

export const CARDS: Card[] = [
  // 1 Mana Karten
  {
    id: 'scrat',
    name: 'Scrat',
    cost: 1,
    attack: 2,
    health: 1,
    faction: 'Scrat',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Fast'],
    synergies: ['Swarm']
  },
  {
    id: 'fire_imp',
    name: 'Fire Imp',
    cost: 1,
    attack: 1,
    health: 2,
    faction: 'Legion',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Burn'],
    synergies: ['Fire', 'Imp']
  },
  {
    id: 'shockrock',
    name: 'Shockrock',
    cost: 1,
    attack: 2,
    health: 1,
    faction: 'Empires',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Electric'],
    synergies: ['Lightning']
  },
  
  // 2 Mana Karten
  {
    id: 'assassin',
    name: 'Assassin',
    cost: 2,
    attack: 4,
    health: 1,
    faction: 'Voidborne',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Stealth', 'Fast'],
    synergies: ['Shadow']
  },
  {
    id: 'warrior',
    name: 'Warrior',
    cost: 2,
    attack: 3,
    health: 3,
    faction: 'Empires',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Armor'],
    synergies: ['Tank']
  },
  {
    id: 'priest',
    name: 'Priest',
    cost: 2,
    attack: 1,
    health: 4,
    faction: 'Zen-Chi',
    rarity: 'Common',
    type: 'Minion',
    abilities: ['Heal'],
    synergies: ['Support']
  },

  // 3 Mana Karten
  {
    id: 'knight',
    name: 'Knight',
    cost: 3,
    attack: 4,
    health: 5,
    faction: 'Empires',
    rarity: 'Rare',
    type: 'Minion',
    abilities: ['Armor', 'Taunt'],
    synergies: ['Tank', 'Defense']
  },
  {
    id: 'demon',
    name: 'Demon',
    cost: 3,
    attack: 5,
    health: 3,
    faction: 'Legion',
    rarity: 'Rare',
    type: 'Minion',
    abilities: ['Lifesteal'],
    synergies: ['Demon']
  },
  {
    id: 'arcane_bolt',
    name: 'Arcane Bolt',
    cost: 3,
    attack: 6,
    health: 0,
    faction: 'Neutral',
    rarity: 'Common',
    type: 'Spell',
    abilities: ['Direct_Damage'],
    synergies: ['Spell']
  },

  // 4 Mana Karten
  {
    id: 'colossus',
    name: 'Colossus',
    cost: 4,
    attack: 6,
    health: 8,
    faction: 'Empires',
    rarity: 'Epic',
    type: 'Minion',
    abilities: ['Slow', 'Massive'],
    synergies: ['Tank', 'Heavy']
  },
  {
    id: 'dragon',
    name: 'Dragon',
    cost: 4,
    attack: 5,
    health: 6,
    faction: 'Legion',
    rarity: 'Epic',
    type: 'Minion',
    abilities: ['Flying', 'Fire_Breath'],
    synergies: ['Dragon', 'Fire']
  },
  {
    id: 'void_lord',
    name: 'Void Lord',
    cost: 4,
    attack: 4,
    health: 7,
    faction: 'Voidborne',
    rarity: 'Epic',
    type: 'Minion',
    abilities: ['Summon_Void_Minions'],
    synergies: ['Void', 'Summon']
  },

  // 5+ Mana Karten
  {
    id: 'legendary_titan',
    name: 'Legendary Titan',
    cost: 5,
    attack: 8,
    health: 10,
    faction: 'Neutral',
    rarity: 'Legendary',
    type: 'Minion',
    abilities: ['Immunity', 'Area_Damage'],
    synergies: ['Legendary', 'Massive']
  },
  {
    id: 'meteor',
    name: 'Meteor',
    cost: 5,
    attack: 10,
    health: 0,
    faction: 'Legion',
    rarity: 'Rare',
    type: 'Spell',
    abilities: ['Area_Damage'],
    synergies: ['Spell', 'Destruction']
  },

  // Weitere strategische Karten
  {
    id: 'scrat_horde',
    name: 'Scrat Horde',
    cost: 2,
    attack: 1,
    health: 1,
    faction: 'Scrat',
    rarity: 'Common',
    type: 'Spell',
    abilities: ['Summon_Multiple'],
    synergies: ['Swarm', 'Scrat']
  },
  {
    id: 'healing_shrine',
    name: 'Healing Shrine',
    cost: 3,
    attack: 0,
    health: 6,
    faction: 'Zen-Chi',
    rarity: 'Rare',
    type: 'Building',
    abilities: ['Heal_Aura'],
    synergies: ['Support', 'Building']
  },
  {
    id: 'lightning_tower',
    name: 'Lightning Tower',
    cost: 4,
    attack: 4,
    health: 8,
    faction: 'Empires',
    rarity: 'Rare',
    type: 'Building',
    abilities: ['Auto_Attack', 'Lightning_Chain'],
    synergies: ['Defense', 'Lightning']
  }
];

// Vordefinierte Strategie-Archetypen für Tester
export const STRATEGY_ARCHETYPES = {
  AGGRO: {
    name: 'Aggro Rush',
    preferredCosts: [1, 2, 3],
    synergies: ['Fast', 'Swarm'],
    maxCost: 3
  },
  CONTROL: {
    name: 'Control',
    preferredCosts: [3, 4, 5],
    synergies: ['Tank', 'Defense', 'Heal'],
    maxCost: 5
  },
  MIDRANGE: {
    name: 'Midrange',
    preferredCosts: [2, 3, 4],
    synergies: ['Balanced'],
    maxCost: 4
  },
  COMBO: {
    name: 'Combo',
    preferredCosts: [1, 2, 3, 4],
    synergies: ['Spell', 'Synergy'],
    maxCost: 5
  }
};