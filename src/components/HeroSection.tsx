import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Crown } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-background/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <Badge variant="outline" className="text-accent border-accent">
            <Crown className="w-4 h-4 mr-2" />
            Rang #1 Deck Builder
          </Badge>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
            MINION MASTERS
          </h1>
          
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Deck Builder für Champions
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Erstelle durchdachte, siegreiche Decks mit datengestützten Strategien. 
            Erreiche Platz 1 mit optimierten Meta-Builds und professionellen Guides.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="victory" size="lg" className="text-lg px-8 py-6">
              <Trophy className="w-5 h-5 mr-2" />
              Deck Builder starten
            </Button>
            
            <Button variant="gaming" size="lg" className="text-lg px-8 py-6">
              <Target className="w-5 h-5 mr-2" />
              Meta-Decks entdecken
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-gaming-gold">95%</div>
              <div className="text-muted-foreground">Win-Rate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-gaming-purple">500+</div>
              <div className="text-muted-foreground">Meta Decks</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-gaming-blue">10K+</div>
              <div className="text-muted-foreground">Champions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gaming-purple/20 rounded-full animate-pulse" />
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-gaming-gold/20 rounded-full animate-bounce" />
      <div className="absolute top-1/3 right-10 w-8 h-8 bg-gaming-blue/20 rounded-full animate-pulse" />
    </section>
  );
}