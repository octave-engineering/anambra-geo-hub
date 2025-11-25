import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, MapPin, Database, Upload, Users, Home, Info, BookOpen, BarChart3, Map, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import anambraLogo from "@/assets/anambra-logo.png";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getUserInitials = (username: string | undefined) => {
    if (!username) return 'U';
    return username.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'partner': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Data Portal", href: "/dataportal", icon: Database },
    { name: "Submit Data", href: "/submit", icon: Upload },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "GIS Mapping", href: "/gis-mapping", icon: MapPin },
    { name: "GIS Map", href: "/gis-map", icon: Map },
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
              <p className="text-xs text-muted-foreground">Health Data Portal</p>
            </div>
          </Link>

          {/* Mobile Title - Only on small screens */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 max-w-[50%] px-2">
            <span className="text-primary-foreground font-semibold text-sm text-center whitespace-nowrap overflow-hidden text-ellipsis block">
              Anambra Health GeoHub
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-center space-x-2 px-2 lg:px-4 py-2 rounded-lg transition-all duration-200 group ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-amber"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  title={item.name}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden lg:inline text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
            {/* User Menu / Login Button */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-2 lg:ml-4 flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getUserInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium">{user.username}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <span className={`text-xs px-2 py-1 rounded-full w-fit ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 ml-2 lg:ml-4">
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">
                    <Users className="h-4 w-4 lg:mr-2" />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">
                    <span className="text-sm font-medium">Sign up</span>
                  </Link>
                </Button>
              </div>
            )}
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
                    <p className="text-xs text-muted-foreground">Health Data Portal</p>
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
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getUserInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* User Actions */}
                      <div className="space-y-2">
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                          <Link to="/settings" onClick={() => setIsOpen(false)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Link>
                        </Button>
                        <Button 
                          onClick={handleLogout} 
                          variant="destructive" 
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild className="w-full">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Users className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}
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