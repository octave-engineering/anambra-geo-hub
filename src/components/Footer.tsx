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
    <footer className="bg-white border-t pb-0 mt-auto font-sans">
      {/* Funded By and Powered By Section */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">Funded By:</span>
              <img 
                src="/logos/UmbrellaFund.png" 
                alt="Umbrella Fund" 
                className="h-6 object-contain"
                style={{ maxWidth: '120px' }}
              />
            </div>
            
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">Powered By:</span>
              <img 
                src="/logos/OctaveAnalytics.png" 
                alt="Octave Analytics" 
                className="h-5 object-contain"
                style={{ maxWidth: '100px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Anambra GeoHub</h3>
                <p className="text-sm text-gray-700 leading-relaxed">Health Data Portal</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              A comprehensive health data platform for Anambra State, providing 
              geospatial analytics and disease surveillance capabilities.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/dataportal" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  Data Portal
                </Link>
              </li>
              <li>
                <Link to="/submit" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  Submit Data
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/gis-mapping" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  GIS Mapping
                </Link>
              </li>
              <li>
                <Link to="/gis-map" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  GIS Map
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-700 hover:text-primary text-sm transition-colors duration-200" onClick={handleLinkClick}>
                  Tools & Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Awka, Anambra State, Nigeria</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:info@anambrageohub.gov.ng" className="text-sm text-gray-700 hover:text-primary transition-colors duration-200">
                  info@anambrageohub.gov.ng
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+2348030000000" className="text-sm text-gray-700 hover:text-primary transition-colors duration-200">
                  +234 (0) 803 XXX XXXX
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="https://www.anambrageohub.gov.ng" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-primary transition-colors duration-200">
                  www.anambrageohub.gov.ng
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/5 rounded-lg">
              <img
                src={anambraLogo}
                alt="Anambra State Logo"
                className="w-5 h-5 rounded-sm object-contain"
              />
              <span className="text-sm font-medium text-gray-800">
                Anambra State Government
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center md:text-right">
            © {currentYear} Anambra State Government. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
