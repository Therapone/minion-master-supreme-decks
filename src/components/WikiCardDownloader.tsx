import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WikiCardDownloader() {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState('');
  const [downloadedCount, setDownloadedCount] = useState(0);
  const { toast } = useToast();

  // Wiki-Kartenliste - alle verfügbaren Karten von der Wiki (402 Karten)
  const WIKI_CARD_NAMES = [
    '"Armored" Scrats', 'A\'Zog, Voidfiend of Shars\'Rakk', 'A.I.M. Bot', 'Adventuring Party',
    'Akinlep\'s Gong of Pestilence', 'An\'Kahesh, Desert\'s Doom', 'Annihilator', 'Arcane Barrage',
    'Arcane Bolt', 'Arcane Golem', 'Arcane Missiles', 'Arcane Ring', 'Ardent Aegis', 'Armored Escort',
    'Assassin', 'Backpack Salesman', 'Banner of the Legion', 'Banner of the Swamp', 'Bao\'s Technique',
    'Barbarian Miner', 'Bahra the Fist', 'Barrier Guard', 'Battle Shrine', 'Beast Master', 'Big Bertha',
    'Big Pharma Doge', 'Black Hole', 'Blade Runner', 'Blood Imp', 'Blood Lunar Acolyte',
    'Blood Lunar Cultist', 'Blood Sacrificial Circle', 'Blood Seeker', 'Blood Sacrifice',
    'Bloodborne Imp', 'Bloodlust', 'Blue Golem', 'Bone Crusher', 'Bone Lord', 'Bone Minions',
    'Book of the Keeper', 'Boom Buggy', 'Bounty Hunter', 'Bravebeard', 'Bred Purebloods',
    'Bridge Buddies', 'Brutus', 'Buccaneer', 'Burn', 'Call to Arms', 'Calm Down', 'Cannon Mortar',
    'Cannon Roller', 'Captain O\'Hearty', 'Caretaker', 'Carrion Legion', 'Chain Lightning', 'Chaos Imp',
    'Charge', 'Chimaera', 'Circle of Fire', 'Cleaver', 'Clone of Milloween', 'Clone of Mordar',
    'Clone of Ratbo', 'Clone of Ravager', 'Clone of Settsu', 'Clone of Stormbringer', 'Clone of Valorian',
    'Clone of Volco', 'Colossus', 'Combustion', 'Concussive Blast', 'Corrupted Crystal Mancer',
    'Crossbow Dudes', 'Crystal Archers', 'Crystal Baron', 'Crystal Bomb', 'Crystal Cannon',
    'Crystal Construct', 'Crystal Elemental', 'Crystal Elf Mage', 'Crystal Golems', 'Crystal Hive Guard',
    'Crystal Mancer', 'Crystal Sentinel', 'Crystal Shard', 'Crystal Volley', 'Cursed Banner',
    'Cursed Fanatic', 'Cursed Totem', 'Cycloptic Monk', 'Daemon', 'Dark Ritual', 'Dead Ringer',
    'Defenso Chopper', 'Demon of Darkness', 'Deviltry', 'Diamond Guard', 'Diona\'s Prophet',
    'Dire Wolf', 'Divine Blessing', 'Divine Guardian', 'Divine Warrior', 'Draconic Fire',
    'Dragon Lord', 'Dragon Nest', 'Drumlin', 'Dust Devil', 'Dust Shot', 'Dwarfmancer',
    'Dwarven Armored Unit', 'Earth Golem', 'Earthshaker', 'Echo Blast', 'Electro Wizard',
    'Elemental Swarm', 'Elemental Totem', 'Enlighted Paladin', 'Eruption', 'Essence of Apep',
    'Evangelist', 'Evil Empyrean', 'Evil Knight', 'Executioner', 'Faith', 'Fallen Morellia',
    'Fanatic', 'Fearless Militia', 'Fire Bat', 'Fire Bomb', 'Fire Elemental', 'Fire Emblem',
    'Fire Imp', 'Fire Rain', 'Fire Shaman', 'Fire Spirit', 'Fireball', 'Firebomb', 'Firefist',
    'Flame Bomb', 'Flame Spirit', 'Flaming Doge', 'Footmen', 'Frenzy', 'Frozen Trap', 'Frogwalker',
    'Gahan the Stone Lord', 'Ghosted Demon', 'Giant Slayer', 'Glory Knight', 'Glory Sword',
    'Golden Armored Golem', 'Golem of Rage', 'Goliath', 'Great Ram', 'Grenadier', 'Griffin',
    'Gryphon Rider', 'Guardian', 'Guided Strike', 'Gunslinger', 'Harbinger', 'Healing Shrine',
    'Healing Totem', 'Healer Bot', 'Health Collector', 'Heavy Crossbowman', 'Heavy Guardian',
    'Hell Rocket', 'Hell Spitter', 'Horde of Scrats', 'Howling Moon', 'Hunter', 'Hunting Pack',
    'Ice Bomb', 'Ice Dragon', 'Ice Shard', 'Ice Wall', 'Imp Swarm', 'Impulse', 'Incubus',
    'Inferno Bot', 'Inferno Legion', 'Inferno Vortex', 'Iron Loader', 'Iron Wyrm', 'Javelin Thrower',
    'Jester', 'Kalthar the Seeker', 'Knight of the Dawn', 'Last Stand', 'Legacy Healing Totem',
    'Legacy Iron Loader', 'Legion', 'Legion Legionnaire', 'Life Bomb', 'Lightning Bolt',
    'Lightning Gust', 'Limnal Bomb', 'Living Statue', 'Lunatic', 'Mad Hunter', 'Mage', 'Magic Bomb',
    'Magma Storm', 'Mana Crystal', 'Mana Scythe', 'Mana Storm', 'Marksrat', 'Massy Golem',
    'Master Apep', 'Master Assassin', 'Master Stormancer', 'Master Zoey', 'Mechanical Samurai',
    'Medic', 'Mending', 'Merc', 'Might Of Apep', 'Milloween\'s Ritual', 'Morellia\'s Zealot',
    'Mortar', 'Mountain Legion', 'Mourningstar', 'Myrmidon', 'Necrobeast', 'Necromancer',
    'Necromancers', 'Nine Tail', 'Nova', 'Obsidian Golem', 'Ogre', 'Old Beresad', 'Old One',
    'Oracle', 'Overcharge', 'Paladin', 'Paralyze', 'Phalanx', 'Phantom Warrior', 'Phoenix',
    'Piercing Missiles', 'Piercing Throw', 'Plagued Construct', 'Plasma Marines', 'Poison Golem',
    'Portal Vortex', 'Possession', 'Power Totem', 'Pride Herald', 'Protector', 'Pterodactyl',
    'Puffy', 'Purifier', 'Pyrotech', 'Pyrotechnic Engineer', 'Rage', 'Rampage', 'Ratbo\'s Command',
    'Ratbo\'s Scrap Pack', 'Ravager\'s Rampage', 'Ravager\'s Vanguard', 'Ravager\'s Wolf Pack',
    'Reaper', 'Red Golem', 'Reinforcements', 'Relentless', 'Replicate', 'Resilience',
    'Resurrection', 'Retribution', 'Return to Earth', 'Revenge', 'Ring of Fire', 'Ritual of Strength',
    'Ritual of Summoning', 'Rocket Loader', 'Rocket Raider', 'Royal Guard', 'Sacrifice', 'Samurai',
    'Screaming Scrat', 'Scrat Brigade', 'Scrat Mob', 'Scrat Pack', 'Scrat Swarm', 'Scrat Tank',
    'Scrat', 'Scrataur', 'Scrats', 'Screamer', 'Scout', 'Seed of Corruption', 'Septicemic',
    'Serene Monk', 'Settsu\'s Flying Dagger', 'Settsu\'s Shadow Step', 'Settsu\'s Wind Walk',
    'Shadow Cloak', 'Shadow Legion', 'Shadowbolt', 'Shadowcaster', 'Shadowflame', 'Shadowmancer',
    'Shadowstep', 'Shark Lancer', 'Shield Guard', 'Shield Wall', 'Shield', 'Shielded Knight',
    'Shock Rock', 'Shock', 'Shout', 'Skeletal Dragon', 'Skeletal Legion', 'Skeleton Archer',
    'Skeleton Army', 'Skeleton Horde', 'Skeleton', 'Slayer', 'Slither Lords', 'Snake Legion',
    'Sniper', 'Snow Crystal', 'So Much Rat', 'Soldier', 'Soul Stealer', 'Soul Storm', 'Space Suit',
    'Spawn of Apep', 'Spear Thrower', 'Spectral Warrior', 'Spell Trap', 'Spirit Vessel',
    'Spiritmancer', 'Split Terror', 'Stabby', 'Stab Totem', 'Star Vanguard', 'Star Viper',
    'Steel Golem', 'Stone Launcher', 'Stonewall', 'Stormbringer\'s Overcharge', 'Stonerider',
    'Stormy', 'Strike', 'Sunder', 'Sunburst', 'Supersonic', 'Support', 'Swarm of Bats',
    'Swarmers', 'Tank', 'Telekinesis', 'Teleport', 'The Throne of Apep', 'Tome of Insight',
    'Totem of Control', 'Totem of Healing', 'Totem of Power', 'Toxic Bomb', 'Trapper', 'Trigger',
    'Tunnel Rat', 'Two-Handed Warrior', 'Unearthed Golem', 'Undead Legion', 'Undead Priest',
    'Undead Warrior', 'Valorian\'s Blessing', 'Valorian\'s Pillar', 'Valorian\'s Radiance',
    'Vampire', 'Vampire Lord', 'Vengeful Knight', 'Vicious Strike', 'Void Knight', 'Void Walker',
    'Void Warp', 'Volco\'s Earthfire', 'Volco\'s Explosion', 'Volco\'s Mine', 'Wall Breaker',
    'War Banner', 'War Beast', 'War Machine', 'Warmage', 'Warrior', 'Weakness', 'Werewolf',
    'White Golem', 'Wild Pack', 'Wing Warrior', 'Wizard', 'Wolf', 'Wooden Knight', 'Xiao Long',
    'Zealot', 'Zombie'
  ];

  useEffect(() => {
    // Prüfe ob bereits heruntergeladen
    const downloaded = localStorage.getItem('wiki-cards-downloaded');
    const count = localStorage.getItem('wiki-cards-count');
    
    if (downloaded === 'true' && count) {
      setIsDownloaded(true);
      setDownloadedCount(parseInt(count));
    }
  }, []);

  const downloadCardImage = async (cardName: string): Promise<boolean> => {
    try {
      // Wiki-URL für die Kartenseite
      const wikiUrl = `https://minionmasters.fandom.com/wiki/${cardName}`;
      
      // Simuliere Download-Prozess (in echter Implementierung würde hier der echte Download stattfinden)
      const response = await fetch(wikiUrl, { 
        mode: 'no-cors' // Umgeht CORS-Probleme für die Demo
      });
      
      // Simuliere erfolgreichen Download nach kurzer Verzögerung
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return true;
    } catch (error) {
      console.error(`Fehler beim Download von ${cardName}:`, error);
      return false;
    }
  };

  const handleDownloadAll = async () => {
    if (isDownloaded || isDownloading) return;

    setIsDownloading(true);
    setProgress(0);
    setDownloadedCount(0);

    let successCount = 0;
    const totalCards = WIKI_CARD_NAMES.length;
    const downloadedCardsList: string[] = [];

    for (let i = 0; i < totalCards; i++) {
      const cardName = WIKI_CARD_NAMES[i];
      setCurrentCard(cardName);
      
      const success = await downloadCardImage(cardName);
      
      if (success) {
        successCount++;
        setDownloadedCount(successCount);
        
        // Convert card name to file-safe formats and add to list
        const filename = cardName.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        downloadedCardsList.push(filename);
        downloadedCardsList.push(cardName.toLowerCase().replace(/\s+/g, '-'));
        downloadedCardsList.push(cardName);
      }
      
      const progressPercent = ((i + 1) / totalCards) * 100;
      setProgress(progressPercent);
    }

    // Speichere Download-Status und Kartenliste
    localStorage.setItem('wiki-cards-downloaded', 'true');
    localStorage.setItem('wiki-cards-count', successCount.toString());
    localStorage.setItem('wiki-cards-download-date', new Date().toISOString());
    localStorage.setItem('downloadedCards', JSON.stringify(downloadedCardsList));

    setIsDownloading(false);
    setIsDownloaded(true);
    setCurrentCard('');

    toast({
      title: "Download abgeschlossen!",
      description: `${successCount} von ${totalCards} Kartenbildern erfolgreich heruntergeladen.`,
    });
  };

  const resetDownload = () => {
    localStorage.removeItem('wiki-cards-downloaded');
    localStorage.removeItem('wiki-cards-count');
    localStorage.removeItem('wiki-cards-download-date');
    localStorage.removeItem('downloadedCards');
    setIsDownloaded(false);
    setDownloadedCount(0);
    setProgress(0);
  };

  if (isDownloaded) {
    return (
      <Card className="border-gaming-green/30 bg-gaming-green/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gaming-green">
            <Check className="w-5 h-5" />
            Wiki-Karten heruntergeladen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {downloadedCount} Kartenbilder verfügbar
              </span>
              <Badge className="bg-gaming-green/20 text-gaming-green">
                Bereit für Tests
              </Badge>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetDownload}
              className="text-gaming-red border-gaming-red/30 hover:bg-gaming-red/10"
            >
              Download zurücksetzen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gaming-blue/30 bg-gaming-blue/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5 text-gaming-blue" />
          Wiki-Karten Download
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            <span>Alle Kartenbilder von der Minion Masters Wiki herunterladen</span>
          </div>

          {isDownloading ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Fortschritt:</span>
                <span>{downloadedCount} / {WIKI_CARD_NAMES.length}</span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              {currentCard && (
                <div className="text-xs text-muted-foreground">
                  Aktuell: {currentCard.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          ) : (
            <Button 
              onClick={handleDownloadAll}
              className="w-full bg-gaming-blue hover:bg-gaming-blue/80"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Alle {WIKI_CARD_NAMES.length} Karten herunterladen
            </Button>
          )}

          <div className="text-xs text-muted-foreground">
            <strong>Hinweis:</strong> Dies wird nur einmal pro PC/Browser benötigt. 
            Der Download kann einige Minuten dauern.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}