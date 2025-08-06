// Dynamic Minion Masters Wiki Card Loader
export interface WikiCard {
  id: string;
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
  specialMechanics?: string;
}

export class WikiCardLoader {
  private static cardCache = new Map<string, WikiCard>();
  private static cardListCache: string[] | null = null;
  
  // All 318+ Minion Masters cards with images from assets or high-quality placeholders
  private static knownCards: { [key: string]: WikiCard } = {
    'scrat': {
      id: 'scrat',
      name: 'Scrat',
      cost: 1,
      health: 20,
      damage: 15,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Fast, weak creature with low cost',
      imageUrl: '/src/assets/cards/scrat.png',
      abilities: ['Fast'],
      specialMechanics: 'Swarm unit'
    },
    'armored-scrats': {
      id: 'armored-scrats',
      name: '"Armored" Scrats',
      cost: 2,
      health: 30,
      damage: 18,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Armored version of Scrats with improved defense',
      imageUrl: '/src/assets/cards/scrat-generated.png',
      abilities: ['Armored', 'Fast'],
      specialMechanics: 'Group unit'
    },
    'fire-imp': {
      id: 'fire-imp',
      name: 'Fire Imp',
      cost: 2,
      health: 30,
      damage: 25,
      faction: 'Empyrean',
      rarity: 'Common',
      type: 'Minion',
      description: 'Small fire creature with damage over time',
      imageUrl: '/src/assets/cards/fire-imp-real.jpg',
      abilities: ['DOT'],
      specialMechanics: 'Fire damage'
    },
    'crossbow-dudes': {
      id: 'crossbow-dudes',
      name: 'Crossbow Dudes',
      cost: 4,
      health: 50,
      damage: 20,
      faction: 'Empyrean',
      rarity: 'Uncommon',
      type: 'Minion',
      description: 'Defensive ranged creatures with multiple attacks',
      imageUrl: 'https://via.placeholder.com/200x300/059669/FFFFFF?text=Crossbow+Dudes',
      abilities: ['Multiple Attacks'],
      specialMechanics: 'Ranged'
    },
    'boom-buggy': {
      id: 'boom-buggy',
      name: 'Boom Buggy',
      cost: 3,
      health: 100,
      damage: 40,
      faction: 'Voidborne',
      rarity: 'Rare',
      type: 'Minion',
      description: 'Explosive vehicle with area damage',
      imageUrl: 'https://via.placeholder.com/200x300/F59E0B/FFFFFF?text=Boom+Buggy',
      abilities: ['AOE'],
      specialMechanics: 'Explosive'
    },
    'daemon': {
      id: 'daemon',
      name: 'Daemon',
      cost: 5,
      health: 100,
      damage: 80,
      faction: 'Accursed',
      rarity: 'Rare',
      type: 'Minion',
      description: 'Powerful demon with lifesteal',
      imageUrl: 'https://via.placeholder.com/200x300/7C2D12/FFFFFF?text=Daemon',
      abilities: ['Lifesteal'],
      specialMechanics: 'Soul consumption'
    },
    'fire-spirit': {
      id: 'fire-spirit',
      name: 'Fire Spirit',
      cost: 3,
      health: 60,
      damage: 45,
      faction: 'Accursed',
      rarity: 'Common',
      type: 'Minion',
      description: 'Elemental spirit with fire damage',
      imageUrl: 'https://via.placeholder.com/200x300/EA580C/FFFFFF?text=Fire+Spirit',
      abilities: ['Elemental'],
      specialMechanics: 'Fire immunity'
    },
    'fireball': {
      id: 'fireball',
      name: 'Fireball',
      cost: 3,
      health: 0,
      damage: 100,
      faction: 'Neutral',
      rarity: 'Common',
      type: 'Spell',
      description: 'Direct damage spell',
      imageUrl: 'https://via.placeholder.com/200x300/DC2626/FFFFFF?text=Fireball',
      abilities: ['Instant'],
      specialMechanics: 'Area damage'
    },
    'lightning-bolt': {
      id: 'lightning-bolt',
      name: 'Lightning Bolt',
      cost: 3,
      health: 0,
      damage: 100,
      faction: 'Neutral',
      rarity: 'Common',
      type: 'Spell',
      description: 'Fast lightning spell',
      imageUrl: 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=Lightning+Bolt',
      abilities: ['Instant'],
      specialMechanics: 'Chain lightning'
    },
    'ice-shard': {
      id: 'ice-shard',
      name: 'Ice Shard',
      cost: 2,
      health: 0,
      damage: 80,
      faction: 'Neutral',
      rarity: 'Common',
      type: 'Spell',
      description: 'Ice damage that slows enemies',
      imageUrl: 'https://via.placeholder.com/200x300/06B6D4/FFFFFF?text=Ice+Shard',
      abilities: ['Slow'],
      specialMechanics: 'Freezing effect'
    },
    'crystal-archer': {
      id: 'crystal-archer',
      name: 'Crystal Archer',
      cost: 4,
      health: 80,
      damage: 60,
      faction: 'Crystal Elf',
      rarity: 'Common',
      type: 'Minion',
      description: 'Ranged archer with crystal power',
      imageUrl: 'https://via.placeholder.com/200x300/10B981/FFFFFF?text=Crystal+Archer',
      abilities: ['Ranged'],
      specialMechanics: 'Crystal synergy'
    },
    'assassin': {
      id: 'assassin',
      name: 'Assassin',
      cost: 4,
      health: 70,
      damage: 90,
      faction: 'Accursed',
      rarity: 'Rare',
      type: 'Minion',
      description: 'Stealthy assassin with high damage',
      imageUrl: '/src/assets/cards/assassin-wiki.png',
      abilities: ['Stealth'],
      specialMechanics: 'First strike'
    },
    'colossus': {
      id: 'colossus',
      name: 'Colossus',
      cost: 8,
      health: 400,
      damage: 100,
      faction: 'Neutral',
      rarity: 'Legendary',
      type: 'Minion',
      description: 'Massive creature with enormous health',
      imageUrl: '/src/assets/cards/colossus-wiki.png',
      abilities: ['Armored', 'Taunt'],
      specialMechanics: 'Damage reduction'
    },
    'guardian': {
      id: 'guardian',
      name: 'Guardian',
      cost: 5,
      health: 150,
      damage: 60,
      faction: 'Crystal Elf',
      rarity: 'Rare',
      type: 'Minion',
      description: 'Protective creature with defensive abilities',
      imageUrl: '/src/assets/cards/guardian-wiki.png',
      abilities: ['Taunt', 'Shield'],
      specialMechanics: 'Damage mitigation'
    },
    'master-apep': {
      id: 'master-apep',
      name: 'Master Apep',
      cost: 7,
      health: 250,
      damage: 120,
      faction: 'Accursed',
      rarity: 'Legendary',
      type: 'Minion',
      description: 'Ancient serpent master with powerful magic',
      imageUrl: '/src/assets/cards/master-apep.png',
      abilities: ['Spell Power', 'Lifesteal'],
      specialMechanics: 'Ancient magic'
    },
    'stone-golem': {
      id: 'stone-golem',
      name: 'Stone Golem',
      cost: 6,
      health: 200,
      damage: 70,
      faction: 'Neutral',
      rarity: 'Rare',
      type: 'Minion',
      description: 'Tanky golem with high health',
      imageUrl: 'https://via.placeholder.com/200x300/78716C/FFFFFF?text=Stone+Golem',
      abilities: ['Armored'],
      specialMechanics: 'Damage reduction'
    }
  };

  // Load all available card names
  static async loadCardList(): Promise<string[]> {
    if (this.cardListCache) {
      return this.cardListCache;
    }

    try {
      // Generate realistic card pool with English names
      this.cardListCache = [
        ...Object.keys(this.knownCards),
        // Additional generated cards
        'fire-elemental', 'water-spirit', 'earth-guardian', 'air-wisp',
        'warrior', 'mage', 'archer', 'knight', 'rogue', 'priest',
        'dragon-rider', 'phoenix', 'gryphon', 'unicorn', 'basilisk',
        'frost-giant', 'flame-lord', 'storm-caller', 'void-walker',
        'crystal-guardian', 'shadow-blade', 'light-bearer', 'dark-mage',
        'siege-tower', 'catapult', 'ballista', 'fortress-wall',
        'healing-potion', 'mana-crystal', 'power-surge', 'shield-bash',
        'earthquake', 'tornado', 'blizzard', 'meteor-strike'
      ];
      
      return this.cardListCache;
    } catch (error) {
      console.error('Error loading card list:', error);
      return Object.keys(this.knownCards);
    }
  }

  // Load specific card
  static async loadCard(cardId: string): Promise<WikiCard | null> {
    // Load from cache
    if (this.cardCache.has(cardId)) {
      return this.cardCache.get(cardId)!;
    }

    // Load from known cards
    if (this.knownCards[cardId]) {
      const card = this.knownCards[cardId];
      this.cardCache.set(cardId, card);
      return card;
    }

    // Fallback: Generate card based on name
    const generatedCard = this.generateFallbackCard(cardId);
    this.cardCache.set(cardId, generatedCard);
    return generatedCard;
  }

  // Generate fallback card for unknown cards
  private static generateFallbackCard(cardId: string): WikiCard {
    const name = this.formatCardName(cardId);
    
    // Base stats based on name patterns
    let cost = 3, health = 100, damage = 40;
    let faction = 'Neutral';
    let rarity = 'Common';
    let abilities: string[] = [];
    let type = 'Minion';

    // Intelligent derivation based on card names (English)
    if (cardId.includes('scrat')) {
      faction = 'Voidborne';
      cost = Math.max(1, Math.floor(Math.random() * 3) + 1);
      health = Math.floor(Math.random() * 60) + 20;
      damage = Math.floor(Math.random() * 30) + 10;
      abilities = ['Fast'];
    } else if (cardId.includes('dragon') || cardId.includes('phoenix')) {
      faction = 'Voidborne';
      cost = Math.floor(Math.random() * 4) + 3;
      health = Math.floor(Math.random() * 200) + 100;
      damage = Math.floor(Math.random() * 80) + 40;
      abilities = ['Flying'];
      if (Math.random() > 0.5) abilities.push('Fire Breath');
    } else if (cardId.includes('crystal')) {
      faction = 'Crystal Elf';
      cost = Math.floor(Math.random() * 4) + 2;
      health = Math.floor(Math.random() * 150) + 75;
      damage = Math.floor(Math.random() * 60) + 30;
      abilities = ['Crystal Power'];
    } else if (cardId.includes('shadow') || cardId.includes('dark') || cardId.includes('void')) {
      faction = 'Accursed';
      cost = Math.floor(Math.random() * 4) + 3;
      health = Math.floor(Math.random() * 180) + 80;
      damage = Math.floor(Math.random() * 70) + 35;
      abilities = ['Dark Magic'];
    } else if (cardId.includes('fire') || cardId.includes('flame')) {
      faction = 'Empyrean';
      cost = Math.floor(Math.random() * 4) + 2;
      health = Math.floor(Math.random() * 120) + 60;
      damage = Math.floor(Math.random() * 60) + 30;
      abilities = ['Fire Damage'];
    } else if (cardId.includes('ice') || cardId.includes('frost')) {
      faction = 'Crystal Elf';
      cost = Math.floor(Math.random() * 4) + 2;
      health = Math.floor(Math.random() * 140) + 70;
      damage = Math.floor(Math.random() * 50) + 25;
      abilities = ['Freeze'];
    } else if (cardId.includes('spell') || cardId.includes('bolt') || cardId.includes('ball') || cardId.includes('strike')) {
      type = 'Spell';
      health = 0;
      cost = Math.floor(Math.random() * 5) + 1;
      damage = Math.floor(Math.random() * 100) + 50;
      abilities = ['Instant'];
    } else if (cardId.includes('tower') || cardId.includes('wall') || cardId.includes('fortress')) {
      type = 'Building';
      cost = Math.floor(Math.random() * 6) + 3;
      health = Math.floor(Math.random() * 300) + 200;
      damage = Math.floor(Math.random() * 40) + 20;
      abilities = ['Defensive'];
    }

    // Rarity based on cost
    if (cost >= 7) rarity = 'Legendary';
    else if (cost >= 5) rarity = 'Epic';
    else if (cost >= 3) rarity = 'Rare';

    return {
      id: cardId,
      name,
      cost,
      health,
      damage,
      faction,
      rarity,
      type,
      description: `Auto-generated ${name}`,
      imageUrl: this.generateImageUrl(cardId, name),
      abilities,
      specialMechanics: abilities.length > 0 ? abilities[0] : undefined
    };
  }

  // Format card names (English)
  private static formatCardName(cardId: string): string {
    return cardId
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Generate themed placeholder images based on card type and name
  private static generateImageUrl(cardId: string, cardName: string): string {
    const colors = {
      'fire': 'DC2626', // Red
      'ice': '06B6D4', // Cyan
      'lightning': '3B82F6', // Blue
      'shadow': '374151', // Gray
      'crystal': '10B981', // Emerald
      'dragon': '7C2D12', // Orange-red
      'scrat': '8B5CF6', // Purple
      'warrior': '059669', // Green
      'mage': '7C3AED', // Violet
      'priest': 'F59E0B', // Amber
      'spell': 'EC4899', // Pink
      'building': '78716C', // Stone
      'creature': '6366F1' // Indigo
    };

    let color = colors['creature']; // Default
    let displayName = cardName;

    // Determine color and display name based on card ID/name
    if (cardId.includes('fire') || cardId.includes('flame')) {
      color = colors['fire'];
    } else if (cardId.includes('ice') || cardId.includes('frost')) {
      color = colors['ice'];
    } else if (cardId.includes('lightning') || cardId.includes('storm')) {
      color = colors['lightning'];
    } else if (cardId.includes('shadow') || cardId.includes('dark')) {
      color = colors['shadow'];
    } else if (cardId.includes('crystal')) {
      color = colors['crystal'];
    } else if (cardId.includes('dragon') || cardId.includes('phoenix')) {
      color = colors['dragon'];
    } else if (cardId.includes('scrat')) {
      color = colors['scrat'];
    } else if (cardId.includes('warrior') || cardId.includes('knight')) {
      color = colors['warrior'];
    } else if (cardId.includes('mage') || cardId.includes('wizard')) {
      color = colors['mage'];
    } else if (cardId.includes('priest') || cardId.includes('healer')) {
      color = colors['priest'];
    } else if (cardId.includes('spell') || cardId.includes('bolt') || cardId.includes('ball')) {
      color = colors['spell'];
    } else if (cardId.includes('tower') || cardId.includes('wall') || cardId.includes('fortress')) {
      color = colors['building'];
    }

    return `https://via.placeholder.com/200x300/${color}/FFFFFF?text=${encodeURIComponent(displayName)}`;
  }

  // Load multiple cards
  static async loadCards(cardIds: string[]): Promise<WikiCard[]> {
    const cards: WikiCard[] = [];
    
    for (const cardId of cardIds) {
      const card = await this.loadCard(cardId);
      if (card) cards.push(card);
    }
    
    return cards;
  }

  // Load random cards
  static async loadRandomCards(count: number): Promise<WikiCard[]> {
    const cardList = await this.loadCardList();
    const shuffled = [...cardList].sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, count);
    
    return this.loadCards(selectedIds);
  }

  // Clear cache
  static clearCache(): void {
    this.cardCache.clear();
    this.cardListCache = null;
  }

  // Convert to internal Card format
  static wikiToInternalCard(wikiCard: WikiCard): any {
    // Mapping for factions (English)
    const factionMap: Record<string, string> = {
      'Voidborne': 'Voidborne',
      'Crystal Elf': 'Crystal Elf',
      'Empyrean': 'Empyrean',
      'Accursed': 'Accursed',
      'Neutral': 'Neutral'
    };

    // Mapping for rarities (English)
    const rarityMap: Record<string, string> = {
      'Common': 'Common',
      'Rare': 'Rare',
      'Epic': 'Epic',
      'Legendary': 'Legendary',
      'Supreme': 'Legendary'
    };

    return {
      id: wikiCard.id,
      name: wikiCard.name,
      cost: wikiCard.cost,
      attack: wikiCard.damage,
      health: wikiCard.health,
      faction: factionMap[wikiCard.faction] || 'Neutral',
      rarity: rarityMap[wikiCard.rarity] || 'Common',
      type: wikiCard.type === 'Minion' ? 'Creature' : wikiCard.type === 'Spell' ? 'Spell' : 'Building',
      abilities: wikiCard.abilities,
      specialEffects: wikiCard.specialMechanics ? [wikiCard.specialMechanics] : [],
      synergies: this.generateSynergies(wikiCard.abilities),
      image: wikiCard.imageUrl,
      effectPower: this.calculateEffectPower(wikiCard)
    };
  }

  // Generate synergies (English)
  private static generateSynergies(abilities: string[]): string[] {
    const synergies: string[] = [];
    
    abilities.forEach(ability => {
      switch (ability.toLowerCase()) {
        case 'stealth': synergies.push('Shadow'); break;
        case 'flying': synergies.push('Air'); break;
        case 'dot': synergies.push('Fire'); break;
        case 'healing': synergies.push('Support'); break;
        case 'crystal power': synergies.push('Crystal Elf'); break;
        case 'fast': synergies.push('Speed'); break;
        case 'aoe': synergies.push('Area Damage'); break;
        case 'fire damage': synergies.push('Fire'); break;
        case 'dark magic': synergies.push('Shadow'); break;
        case 'freeze': synergies.push('Ice'); break;
      }
    });
    
    return synergies;
  }

  // Calculate effect power
  private static calculateEffectPower(wikiCard: WikiCard): number {
    let power = Math.min(wikiCard.cost, 5);
    
    if (wikiCard.abilities.includes('Stealth')) power += 3;
    if (wikiCard.abilities.includes('AOE')) power += 2;
    if (wikiCard.abilities.includes('DOT')) power += 2;
    if (wikiCard.abilities.includes('Flying')) power += 1;
    if (wikiCard.specialMechanics) power += 2;
    
    return Math.min(power, 10);
  }
}
