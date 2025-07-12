import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain,
  Target,
  BarChart3,
  Zap,
  Shield,
  Users
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "KI-gestützte Strategien",
    description: "Intelligente Algorithmen analysieren Meta-Trends und erstellen optimale Deck-Kombinationen",
    gradient: "from-gaming-purple to-gaming-blue"
  },
  {
    icon: Target,
    title: "Präzise Counters",
    description: "Erkenne gegnerische Strategien und wähle das perfekte Counter-Deck für jede Situation",
    gradient: "from-gaming-blue to-gaming-gold"
  },
  {
    icon: BarChart3,
    title: "Live Win-Rate Tracking",
    description: "Verfolge deine Performance in Echtzeit mit detaillierten Statistiken und Trends",
    gradient: "from-gaming-gold to-gaming-red"
  },
  {
    icon: Zap,
    title: "Instant Deck Import",
    description: "Importiere Meta-Decks mit einem Klick direkt in dein Spiel für sofortigen Erfolg",
    gradient: "from-gaming-red to-gaming-purple"
  },
  {
    icon: Shield,
    title: "Pro-Level Guides",
    description: "Detaillierte Strategien von Top-Spielern mit Schritt-für-Schritt Anleitungen",
    gradient: "from-gaming-purple to-gaming-gold"
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Teile Decks mit der Community und lerne von den besten Spielern weltweit",
    gradient: "from-gaming-blue to-gaming-red"
  }
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            Warum <span className="bg-gradient-gaming bg-clip-text text-transparent">Minion Masters Pro</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professionelle Tools und datengestützte Insights für Champions, 
            die nicht nur spielen, sondern dominieren wollen.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-gaming transition-all duration-500 hover:scale-105 border-border hover:border-primary/30"
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}