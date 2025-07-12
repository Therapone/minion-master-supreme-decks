import { Button } from "@/components/ui/button";
import { 
  Sword, 
  Trophy, 
  BookOpen, 
  BarChart3, 
  User,
  Menu,
  Crown
} from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "Deck Builder", icon: Sword, href: "#builder" },
    { name: "Meta Decks", icon: Trophy, href: "#meta" },
    { name: "Guides", icon: BookOpen, href: "#guides" },
    { name: "Stats", icon: BarChart3, href: "#stats" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-gaming rounded-md flex items-center justify-center">
              <Crown className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Minion Masters Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={item.href} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </a>
              </Button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Anmelden
            </Button>
            <Button variant="gaming" size="sm" className="hidden md:flex">
              Pro werden
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a href={item.href} className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                </Button>
              ))}
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Anmelden
                </Button>
                <Button variant="gaming" size="sm" className="w-full">
                  Pro werden
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}