import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Globe, Facebook, Twitter, Linkedin } from "lucide-react";
import anambraLogo from "@/assets/anambra-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Force scroll to top when clicking footer links
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white/95 backdrop-blur-sm shadow-xl border-t relative z-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-amber">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-inter font-bold text-foreground">
                  Anambra GeoHub
                </h3>
                <p className="text-sm text-muted-foreground">Health Data Portal</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              A comprehensive health data platform for Anambra State, providing geospatial 
              analytics and disease surveillance capabilities to support evidence-based 
              healthcare decision making.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/dataportal"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Data Portal
              </Link>
              <Link
                to="/analytics"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Analytics
              </Link>
              <Link
                to="/learning"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Learning
              </Link>
              <Link
                to="/submit"
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Submit Data
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold text-foreground mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Awka, Anambra State, Nigeria</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">info@anambrageohub.gov.ng</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+234 (0) 803 XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm">www.anambrageohub.gov.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
              <img
                src={anambraLogo}
                alt="Anambra State Logo"
                className="w-6 h-6 rounded-sm object-contain bg-white"
              />
              <span className="text-sm font-medium text-primary">
                Anambra State Government
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © {currentYear} Anambra State Government. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
