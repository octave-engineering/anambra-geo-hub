import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, MapPin, Database, Upload, Users, Home, Info, BookOpen, BarChart3 } from "lucide-react";
import anambraLogo from "@/assets/anambra-logo.png";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Data Repository", href: "/repository", icon: Database },
    { name: "Submit Data", href: "/submit", icon: Upload },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Tools & Learning", href: "/learning", icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-amber p-1">
              <img 
                src={anambraLogo} 
                alt="Anambra State Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-inter font-bold text-foreground">
                Anambra GeoHub
              </h1>
              <p className="text-xs text-muted-foreground">Health Data Repository</p>
            </div>
          </Link>

          {/* Mobile Center Logo - Only on small screens */}
          <div className="flex md:hidden items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-primary rounded-full">
                  <span className="text-primary-foreground font-semibold text-sm text-center">
                      Anambra Health GeoHub
                  </span>
              </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-amber"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            <Button asChild variant="outline" size="sm" className="ml-4">
              <Link to="/login">
                <Users className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1">
                    <img 
                      src={anambraLogo} 
                      alt="Anambra State Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="font-inter font-bold">Anambra GeoHub</h2>
                    <p className="text-xs text-muted-foreground">Health Data Repository</p>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-amber"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-4 border-t">
                  <Button asChild className="w-full">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Users className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="w-full bg-amber-50 border-t border-b border-amber-200 text-amber-900">
        <div className="container mx-auto px-4 py-2 text-center text-sm sm:text-base font-medium">
          This website is a work in progress and currently a working demo. Features, functionalities and data may change.
        </div>
      </div>
    </header>
  );
};

export default Header;