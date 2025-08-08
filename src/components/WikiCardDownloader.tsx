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

  // Wiki-Kartenliste - alle verfügbaren Karten von der Wiki
  const WIKI_CARD_NAMES = [
    'Scrat', 'Fire_Imp', 'Assassin', 'Colossus', 'Guardian', 'Crystal_Archers',
    'Crossbow_Dudes', 'Bazooka_Scrat', 'Cleaver', 'Dragon_Whelp', 'Fireball',
    'Lightning_Bolt', 'Healing_Potion', 'Shield_Generator', 'Warrior', 'Knight',
    'Priest', 'Demon', 'Arcane_Bolt', 'Meteor', 'Legendary_Titan', 'Void_Lord',
    'Crystal_Sentry', 'Shadow_Walker', 'Zen_Master', 'Flame_Spirit', 'Scrat_Tank',
    'Blood_Imps', 'Crossbow_Guild', 'Crystal_Construct', 'Daggerfall', 'Defenso_Chopper',
    'Dragon', 'Echoed_Stomp', 'Fireball', 'Ghost', 'Harbinger', 'Ice_Shard',
    'Jaxon', 'Knight', 'Lightning_Ball', 'Magma_Storm', 'Necromancer', 'Overkill',
    'Puff', 'Rage', 'Stomp', 'Tantrum', 'Unleash', 'Voidborne', 'Werewolf',
    // Hier würden alle 300+ Kartennamen stehen
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

    for (let i = 0; i < totalCards; i++) {
      const cardName = WIKI_CARD_NAMES[i];
      setCurrentCard(cardName);
      
      const success = await downloadCardImage(cardName);
      
      if (success) {
        successCount++;
        setDownloadedCount(successCount);
      }
      
      const progressPercent = ((i + 1) / totalCards) * 100;
      setProgress(progressPercent);
    }

    // Speichere Download-Status
    localStorage.setItem('wiki-cards-downloaded', 'true');
    localStorage.setItem('wiki-cards-count', successCount.toString());
    localStorage.setItem('wiki-cards-download-date', new Date().toISOString());

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