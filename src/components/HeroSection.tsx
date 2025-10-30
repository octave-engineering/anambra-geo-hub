
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Map, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { forwardRef } from "react";
import landingPageImage from "@/assets/Landing Page.png";

const HeroSection = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${landingPageImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-primary/30 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-12 h-12 bg-primary/25 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-24 h-24 bg-primary/15 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-8 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Powered by Anambra State Government
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-inter font-bold mb-6 leading-tight text-center">
            <span className="text-black block mb-2 font-bold">Welcome to</span>
            <span className="text-[#fac114] font-bold">Anambra</span>
            <span className="text-black font-bold"> GeoHub</span>
            
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto leading-relaxed bg-white/70 p-2 rounded">
            Comprehensive health data portal and geospatial analytics platform 
            for evidence-based healthcare decision making in Anambra State
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg shadow-card border">
              <Database className="h-6 w-6 text-primary" />
              <span className="font-medium">20+ Datasets</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg shadow-card border">
              <Map className="h-6 w-6 text-primary" />
              <span className="font-medium">Interactive Maps</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-4 bg-card rounded-lg shadow-card border">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-medium">Real-time Analytics</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-6 text-lg shadow-amber animate-pulse-glow"
            >
              <Link to="/repository">
                Explore Portal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg border-primary/20 hover:bg-primary/5"
            >
              <Link to="/analytics">
                View Analytics
                <BarChart3 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-inter font-bold text-primary mb-2">20+</div>
              <div className="text-sm text-muted-foreground">Health Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-inter font-bold text-primary mb-2">21</div>
              <div className="text-sm text-muted-foreground">Local Governments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-inter font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Data Coverage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-inter font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
