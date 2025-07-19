// Dynamischer Minion Masters Wiki-Karten-Loader
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
  specialMechanics?: {
    onPlay?: string;
    onDeath?: string;
    passive?: string;
    triggered?: string;
  };
}

export class WikiCardLoader {
  private static cardCache = new Map<string, WikiCard>();
  private static cardListCache: string[] | null = null;
  
  // Base URL für Wiki-Bilder
  private static readonly WIKI_IMAGE_BASE = 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/';
  
  // Bekannte Karten mit korrekten Daten (werden erweitert)
  private static knownCards: Record<string, Partial<WikiCard>> = {
    'scrat': {
      id: 'scrat',
      name: 'Scrat',
      cost: 1,
      health: 30,
      damage: 15,
      faction: 'Scrat',
      rarity: 'Common',
      type: 'Minion',
      description: 'Schnelle kleine Kreatur',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/5/57/Scrat.png',
      abilities: ['Schnell']
    },
    'fire_imp': {
      id: 'fire_imp',
      name: 'Feuer-Kobold',
      cost: 4,
      health: 130,
      damage: 20,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Hinterlässt eine feurige DOT auf dem Boden',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/a/a2/FireImp.jpg',
      abilities: ['DOT', 'Fernkampf'],
      specialMechanics: {
        triggered: '10 Ticks à 20 Schaden (200 Gesamtschaden)',
        passive: 'AOE-Radius 3, Bewegungsvorhersage'
      }
    },
    'assassin': {
      id: 'assassin',
      name: 'Assassine',
      cost: 4,
      health: 150,
      damage: 70,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Stealth. Dreifacher Schaden aus der Tarnung.',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/6/69/Assassin.png',
      abilities: ['Stealth', 'Melee'],
      specialMechanics: {
        onPlay: 'Sofort getarnt beim Erscheinen',
        triggered: 'Dreifacher Schaden (210) aus der Tarnung',
        passive: 'Wird nach 2 Sekunden ohne Angriff/Schaden wieder getarnt'
      }
    },
    'colossus': {
      id: 'colossus',
      name: 'Koloss',
      cost: 9,
      health: 1000,
      damage: 250,
      faction: 'Voidborne',
      rarity: 'Legendary',
      type: 'Minion',
      description: 'Schlägt Feinde in einem riesigen Bogen vor sich weg.',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/b/bb/Colossus.png',
      abilities: ['AOE', 'Massiv', 'Langsam'],
      specialMechanics: {
        triggered: 'Angriff trifft alle Bodeneinheiten in 180° Bogen',
        passive: 'Sehr langsam (Geschwindigkeit 3), enormer AOE-Schaden'
      }
    },
    'guardian': {
      id: 'guardian',
      name: 'Wächter',
      cost: 5,
      health: 800,
      damage: 100,
      faction: 'Crystal Elf',
      rarity: 'Supreme',
      type: 'Minion',
      description: 'Absorbiert 66% allen Schadens an nahestehenden Crystal Elf Einheiten.',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/f/fd/Guardian.png',
      abilities: ['Schutzschild', 'Crystal Elf Synergie'],
      specialMechanics: {
        passive: 'Absorbiert 66% des Schadens aller Crystal Elf Einheiten in 9 Reichweite',
        triggered: 'Nur 2 Kopien in Teamkämpfen erlaubt'
      }
    },
    // Weitere bekannte Karten hinzufügen...
    'dragon_whelp': {
      id: 'dragon_whelp',
      name: 'Drachenwelpe',
      cost: 2,
      health: 80,
      damage: 35,
      faction: 'Voidborne',
      rarity: 'Common',
      type: 'Minion',
      description: 'Fliegende Einheit mit Fernkampf',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/4/4a/DragonWhelp.png',
      abilities: ['Fliegend', 'Fernkampf']
    },
    'crossbow_dudes': {
      id: 'crossbow_dudes',
      name: 'Armbrust-Typen',
      cost: 2,
      health: 50,
      damage: 20,
      faction: 'Empire',
      rarity: 'Common',
      type: 'Minion',
      description: 'Beschwört 3 Armbrustschützen',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/7/7f/CrossbowDudes.png',
      abilities: ['Fernkampf', 'Mehrfach'],
      specialMechanics: {
        onPlay: 'Beschwört 3 Armbrustschützen mit je 50 HP und 20 Schaden'
      }
    },
    'crystal_archers': {
      id: 'crystal_archers',
      name: 'Kristall-Bogenschützen',
      cost: 4,
      health: 130,
      damage: 50,
      faction: 'Crystal Elf',
      rarity: 'Common',
      type: 'Minion',
      description: 'Fernkampf-Einheit mit hoher Reichweite',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/8/8c/CrystalArchers.png',
      abilities: ['Fernkampf', 'Crystal Elf']
    },
    'legionnaires': {
      id: 'legionnaires',
      name: 'Legionäre',
      cost: 4,
      health: 200,
      damage: 40,
      faction: 'Empire',
      rarity: 'Common',
      type: 'Minion',
      description: 'Gepanzerte Infanterie-Einheit',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/2/2b/Legionnaires.png',
      abilities: ['Rüstung', 'Infanterie']
    },
    'heal_puff': {
      id: 'heal_puff',
      name: 'Heil-Puff',
      cost: 1,
      health: 40,
      damage: 10,
      faction: 'Scrat',
      rarity: 'Common',
      type: 'Minion',
      description: 'Heilt nahestehende Verbündete',
      imageUrl: 'https://static.wikia.nocookie.net/minionmasters_gamepedia_en/images/9/94/HealPuff.png',
      abilities: ['Heilung', 'Unterstützung'],
      specialMechanics: {
        passive: 'Heilt alle verbündeten Einheiten in der Nähe um 15 HP pro Sekunde'
      }
    }
  };

  // Lade alle verfügbaren Kartennamen von der Wiki
  static async loadCardList(): Promise<string[]> {
    if (this.cardListCache) {
      return this.cardListCache;
    }

    try {
      // Simuliere Laden der Kartenliste (in echter Implementierung würde man die Wiki-API verwenden)
      this.cardListCache = [
        'scrat', 'fire_imp', 'assassin', 'colossus', 'guardian', 'dragon_whelp',
        'crossbow_dudes', 'crystal_archers', 'legionnaires', 'heal_puff',
        // Weitere Karten aus der echten Wiki...
        'arcane_bolt', 'fireball', 'lightning_bolt', 'healing_shrine',
        'crystal_sentry', 'demon_warrior', 'divine_warrior', 'ghost',
        'grenadier', 'harbinger', 'knight', 'priest', 'warrior',
        'blue_golem', 'boom_buggy', 'drone_walker', 'living_statue',
        'meteor', 'annihilator', 'dragon_pack', 'legendary_titan'
      ];
      
      return this.cardListCache;
    } catch (error) {
      console.error('Fehler beim Laden der Kartenliste:', error);
      return Object.keys(this.knownCards);
    }
  }

  // Lade spezifische Karte
  static async loadCard(cardId: string): Promise<WikiCard | null> {
    // Aus Cache laden
    if (this.cardCache.has(cardId)) {
      return this.cardCache.get(cardId)!;
    }

    // Aus bekannten Karten laden
    if (this.knownCards[cardId]) {
      const knownCard = this.knownCards[cardId];
      const fullCard: WikiCard = {
        id: cardId,
        name: knownCard.name || 'Unbekannte Karte',
        cost: knownCard.cost || 1,
        health: knownCard.health || 50,
        damage: knownCard.damage || 25,
        faction: knownCard.faction || 'Neutral',
        rarity: knownCard.rarity || 'Common',
        type: knownCard.type || 'Minion',
        description: knownCard.description || '',
        imageUrl: knownCard.imageUrl || this.generateImageUrl(cardId),
        abilities: knownCard.abilities || [],
        specialMechanics: knownCard.specialMechanics
      };
      
      this.cardCache.set(cardId, fullCard);
      return fullCard;
    }

    // Fallback: Generiere Karte basierend auf Name
    const generatedCard = this.generateFallbackCard(cardId);
    this.cardCache.set(cardId, generatedCard);
    return generatedCard;
  }

  // Generiere Fallback-Karte für unbekannte Karten
  private static generateFallbackCard(cardId: string): WikiCard {
    const name = this.formatCardName(cardId);
    
    // Basis-Stats basierend auf Namen-Pattern
    let cost = 3, health = 100, damage = 40;
    let faction = 'Neutral';
    let rarity = 'Common';
    let abilities: string[] = [];

    // Intelligente Ableitung basierend auf Kartennamen
    if (cardId.includes('scrat')) {
      faction = 'Scrat';
      cost = Math.max(1, Math.floor(Math.random() * 3) + 1);
      health = Math.floor(Math.random() * 60) + 20;
      damage = Math.floor(Math.random() * 30) + 10;
      abilities = ['Schnell'];
    } else if (cardId.includes('dragon')) {
      faction = 'Voidborne';
      cost = Math.floor(Math.random() * 4) + 3;
      health = Math.floor(Math.random() * 200) + 100;
      damage = Math.floor(Math.random() * 80) + 40;
      abilities = ['Fliegend'];
      if (Math.random() > 0.5) abilities.push('Feueratem');
    } else if (cardId.includes('crystal')) {
      faction = 'Crystal Elf';
      cost = Math.floor(Math.random() * 4) + 2;
      health = Math.floor(Math.random() * 150) + 75;
      damage = Math.floor(Math.random() * 60) + 30;
      abilities = ['Crystal Elf'];
    } else if (cardId.includes('demon') || cardId.includes('void')) {
      faction = 'Voidborne';
      cost = Math.floor(Math.random() * 4) + 3;
      health = Math.floor(Math.random() * 180) + 80;
      damage = Math.floor(Math.random() * 70) + 35;
      abilities = ['Dunkel'];
    } else if (cardId.includes('empire') || cardId.includes('legion')) {
      faction = 'Empire';
      cost = Math.floor(Math.random() * 4) + 2;
      health = Math.floor(Math.random() * 160) + 90;
      damage = Math.floor(Math.random() * 50) + 25;
      abilities = ['Rüstung'];
    }

    // Seltenheit basierend auf Kosten
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
      type: 'Minion',
      description: `Automatisch generierte ${name}`,
      imageUrl: this.generateImageUrl(cardId),
      abilities
    };
  }

  // Formatiere Kartennamen
  private static formatCardName(cardId: string): string {
    return cardId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Generiere Wiki-Bild-URL
  private static generateImageUrl(cardId: string): string {
    const formattedName = cardId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    return `${this.WIKI_IMAGE_BASE}${formattedName}.png`;
  }

  // Lade mehrere Karten
  static async loadCards(cardIds: string[]): Promise<WikiCard[]> {
    const cards: WikiCard[] = [];
    
    for (const cardId of cardIds) {
      const card = await this.loadCard(cardId);
      if (card) cards.push(card);
    }
    
    return cards;
  }

  // Lade zufällige Karten
  static async loadRandomCards(count: number): Promise<WikiCard[]> {
    const cardList = await this.loadCardList();
    const shuffled = [...cardList].sort(() => Math.random() - 0.5);
    const selectedIds = shuffled.slice(0, count);
    
    return this.loadCards(selectedIds);
  }

  // Cache leeren
  static clearCache(): void {
    this.cardCache.clear();
    this.cardListCache = null;
  }

  // Konvertiere zu internem Card-Format
  static wikiToInternalCard(wikiCard: WikiCard): any {
    // Mapping für deutsche Fraktionen
    const factionMap: Record<string, string> = {
      'Voidborne': 'Leere',
      'Crystal Elf': 'Zen-Chi',
      'Empire': 'Imperium',
      'Scrat': 'Scrat',
      'Neutral': 'Neutral'
    };

    // Mapping für deutsche Seltenheiten
    const rarityMap: Record<string, string> = {
      'Common': 'Gewöhnlich',
      'Rare': 'Selten',
      'Epic': 'Episch',
      'Legendary': 'Legendär',
      'Supreme': 'Legendär'
    };

    return {
      id: wikiCard.id,
      name: wikiCard.name,
      cost: wikiCard.cost,
      attack: wikiCard.damage,
      health: wikiCard.health,
      faction: factionMap[wikiCard.faction] || 'Neutral',
      rarity: rarityMap[wikiCard.rarity] || 'Gewöhnlich',
      type: wikiCard.type === 'Minion' ? 'Kreatur' : wikiCard.type === 'Spell' ? 'Zauber' : 'Gebäude',
      abilities: wikiCard.abilities,
      specialEffects: wikiCard.specialMechanics,
      synergies: this.generateSynergies(wikiCard.abilities),
      image: wikiCard.imageUrl,
      effectPower: this.calculateEffectPower(wikiCard)
    };
  }

  // Generiere Synergien
  private static generateSynergies(abilities: string[]): string[] {
    const synergies: string[] = [];
    
    abilities.forEach(ability => {
      switch (ability.toLowerCase()) {
        case 'stealth': synergies.push('Schatten'); break;
        case 'fliegend': synergies.push('Luft'); break;
        case 'dot': synergies.push('Feuer'); break;
        case 'heilung': synergies.push('Unterstützung'); break;
        case 'crystal elf': synergies.push('Zen-Chi'); break;
        case 'schnell': synergies.push('Geschwindigkeit'); break;
        case 'aoe': synergies.push('Flächenschaden'); break;
      }
    });
    
    return synergies;
  }

  // Berechne Effektstärke
  private static calculateEffectPower(wikiCard: WikiCard): number {
    let power = Math.min(wikiCard.cost, 5);
    
    if (wikiCard.abilities.includes('Stealth')) power += 3;
    if (wikiCard.abilities.includes('AOE')) power += 2;
    if (wikiCard.abilities.includes('DOT')) power += 2;
    if (wikiCard.abilities.includes('Fliegend')) power += 1;
    if (wikiCard.specialMechanics) power += 2;
    
    return Math.min(power, 10);
  }
}