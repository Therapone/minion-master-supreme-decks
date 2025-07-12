import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { MetaDecks } from "@/components/MetaDecks";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <Features />
      <MetaDecks />
    </div>
  );
};

export default Index;
