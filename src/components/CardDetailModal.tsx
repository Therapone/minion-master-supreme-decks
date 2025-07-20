import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/data/cards";
import { X, Sword, Shield, Zap, Star } from "lucide-react";

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardDetailModal({ card, isOpen, onClose }: CardDetailModalProps) {
  if (!card) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendär': return 'bg-gradient-to-r from-gaming-gold to-yellow-400 text-black';
      case 'Episch': return 'bg-gradient-to-r from-gaming-purple to-purple-400 text-white';
      case 'Selten': return 'bg-gradient-to-r from-gaming-blue to-blue-400 text-white';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-300 text-black';
    }
  };

  const getFactionColor = (faction: string) => {
    switch (faction) {
      case 'Leere': return 'text-purple-400';
      case 'Imperium': return 'text-blue-400';
      case 'Legion': return 'text-red-400';
      case 'Scrat': return 'text-orange-400';
      case 'Zen-Chi': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{card.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Kartenbild und Grundinfos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kartenbild */}
            <div className="space-y-4">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-muted bg-muted/10">
                {card.image ? (
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Sword className="w-16 h-16 mx-auto mb-2" />
                      <p>Kein Bild verfügbar</p>
                    </div>
                  </div>
                )}
                
                {/* Mana-Kosten Overlay */}
                <div className={`absolute top-3 left-3 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${
                  card.cost <= 2 ? 'bg-gaming-purple text-white' :
                  card.cost <= 4 ? 'bg-gaming-blue text-white' :
                  card.cost <= 6 ? 'bg-gaming-gold text-black' :
                  'bg-gaming-red text-white'
                }`}>
                  {card.cost}
                </div>
              </div>
            </div>

            {/* Karteninformationen */}
            <div className="space-y-4">
              {/* Grundlegende Infos */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getRarityColor(card.rarity)} variant="secondary">
                    {card.rarity}
                  </Badge>
                  <Badge variant="outline" className={getFactionColor(card.faction)}>
                    {card.faction}
                  </Badge>
                  <Badge variant="outline">
                    {card.type}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-gaming-red">{card.attack}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Sword className="w-3 h-3" />
                      Angriff
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-gaming-green">{card.health}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Leben
                    </div>
                  </div>
                  {card.effectPower && (
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-gaming-purple">{card.effectPower}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3" />
                        Effekt
                      </div>
                    </div>
                  )}
                </div>

                {/* Kosten/Mana */}
                <div className="p-3 bg-gradient-to-r from-gaming-blue/20 to-gaming-purple/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gaming-blue">{card.cost}</div>
                    <div className="text-sm text-muted-foreground">Mana-Kosten</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fähigkeiten */}
          {card.abilities && card.abilities.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Fähigkeiten</h3>
              <div className="flex flex-wrap gap-2">
                {card.abilities.map((ability, index) => (
                  <Badge key={index} variant="secondary" className="bg-gaming-blue/20 text-gaming-blue">
                    {ability}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Spezialeffekte */}
          {card.specialEffects && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Spezialeffekte</h3>
              <div className="space-y-2">
                {card.specialEffects.onPlay && (
                  <div className="p-3 bg-gaming-green/10 border border-gaming-green/20 rounded-lg">
                    <div className="font-semibold text-gaming-green text-sm">Beim Spielen:</div>
                    <div className="text-sm mt-1">{card.specialEffects.onPlay}</div>
                  </div>
                )}
                {card.specialEffects.onDeath && (
                  <div className="p-3 bg-gaming-red/10 border border-gaming-red/20 rounded-lg">
                    <div className="font-semibold text-gaming-red text-sm">Beim Tod:</div>
                    <div className="text-sm mt-1">{card.specialEffects.onDeath}</div>
                  </div>
                )}
                {card.specialEffects.passive && (
                  <div className="p-3 bg-gaming-purple/10 border border-gaming-purple/20 rounded-lg">
                    <div className="font-semibold text-gaming-purple text-sm">Passiv:</div>
                    <div className="text-sm mt-1">{card.specialEffects.passive}</div>
                  </div>
                )}
                {card.specialEffects.triggered && (
                  <div className="p-3 bg-gaming-gold/10 border border-gaming-gold/20 rounded-lg">
                    <div className="font-semibold text-gaming-gold text-sm">Ausgelöst:</div>
                    <div className="text-sm mt-1">{card.specialEffects.triggered}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Synergien */}
          {card.synergies && card.synergies.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Synergien</h3>
              <div className="flex flex-wrap gap-2">
                {card.synergies.map((synergy, index) => (
                  <Badge key={index} variant="outline" className="bg-gaming-purple/10 text-gaming-purple border-gaming-purple/30">
                    <Star className="w-3 h-3 mr-1" />
                    {synergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Strategische Bewertung */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Strategische Bewertung</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {Math.round((card.attack + card.health) / card.cost * 10) / 10}
                  </div>
                  <div className="text-xs text-muted-foreground">Stats/Mana</div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {card.effectPower || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Effekt-Power</div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {(card.synergies?.length || 0) + (card.abilities?.length || 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Vielseitigkeit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}