import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Globe, Facebook, Twitter, Linkedin } from "lucide-react";

const NewFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t">
      {/* Funded By and Powered By Section */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Funded By:</span>
              <img 
                src="/logos/UmbrellaFund.png" 
                alt="Umbrella Fund" 
                className="h-6 object-contain"
                style={{ maxWidth: '120px' }}
              />
            </div>
            
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Powered By:</span>
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
                <p className="text-sm text-gray-600">Health Data Portal</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
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
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/maps" className="text-gray-600 hover:text-primary text-sm" onClick={handleLinkClick}>
                  Interactive Maps
                </Link>
              </li>
              <li>
                <Link to="/data" className="text-gray-600 hover:text-primary text-sm" onClick={handleLinkClick}>
                  Data Explorer
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary text-sm" onClick={handleLinkClick}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Anambra State Ministry of Health,<br />
                  Government House, Awka,<br />
                  Anambra State, Nigeria
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <a href="mailto:info@anambrageohub.gov.ng" className="text-sm text-gray-600 hover:text-primary">
                  info@anambrageohub.gov.ng
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-3" />
                <a href="tel:+2348030000000" className="text-sm text-gray-600 hover:text-primary">
                  +234 803 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Anambra State Government. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
