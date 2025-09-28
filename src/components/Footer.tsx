// import { Link } from "react-router-dom";
// import { MapPin, Mail, Phone, Globe, Facebook, Twitter, Linkedin } from "lucide-react";

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-gradient-card border-t">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand Section */}
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-amber">
//                 <MapPin className="h-6 w-6 text-primary-foreground" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-playfair font-bold text-foreground">
//                   Anambra GeoHub
//                 </h3>
//                 <p className="text-sm text-muted-foreground">Health Data Repository</p>
//               </div>
//             </div>
//             <p className="text-muted-foreground max-w-md mb-6">
//               A comprehensive health data platform for Anambra State, providing geospatial 
//               analytics and disease surveillance capabilities to support evidence-based 
//               healthcare decision making.
//             </p>
//             <div className="flex space-x-4">
//               <a 
//                 href="#" 
//                 className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                 aria-label="Facebook"
//               >
//                 <Facebook className="h-5 w-5" />
//               </a>
//               <a 
//                 href="#" 
//                 className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                 aria-label="Twitter"
//               >
//                 <Twitter className="h-5 w-5" />
//               </a>
//               <a 
//                 href="#" 
//                 className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
//                 aria-label="LinkedIn"
//               >
//                 <Linkedin className="h-5 w-5" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="font-playfair font-semibold text-foreground mb-4">Quick Links</h4>
//             <nav className="space-y-2">
//               <Link 
//                 to="/about" 
//                 className="block text-muted-foreground hover:text-primary transition-colors"
//               >
//                 About GeoHub
//               </Link>
//               <Link 
//                 to="/repository" 
//                 className="block text-muted-foreground hover:text-primary transition-colors"
//               >
//                 Data Repository
//               </Link>
//               <Link 
//                 to="/analytics" 
//                 className="block text-muted-foreground hover:text-primary transition-colors"
//               >
//                 Analytics Dashboard
//               </Link>
//               <Link 
//                 to="/submit" 
//                 className="block text-muted-foreground hover:text-primary transition-colors"
//               >
//                 Submit Data
//               </Link>
//             </nav>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h4 className="font-playfair font-semibold text-foreground mb-4">Contact Info</h4>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3 text-muted-foreground">
//                 <MapPin className="h-4 w-4 text-primary" />
//                 <span className="text-sm">Awka, Anambra State, Nigeria</span>
//               </div>
//               <div className="flex items-center space-x-3 text-muted-foreground">
//                 <Mail className="h-4 w-4 text-primary" />
//                 <span className="text-sm">info@anambrageohub.gov.ng</span>
//               </div>
//               <div className="flex items-center space-x-3 text-muted-foreground">
//                 <Phone className="h-4 w-4 text-primary" />
//                 <span className="text-sm">+234 (0) 803 XXX XXXX</span>
//               </div>
//               <div className="flex items-center space-x-3 text-muted-foreground">
//                 <Globe className="h-4 w-4 text-primary" />
//                 <span className="text-sm">www.anambrageohub.gov.ng</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
//           <div className="flex items-center space-x-4 mb-4 md:mb-0">
//             <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 rounded-full">
//               <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
//                 <span className="text-primary-foreground font-bold text-xs">AS</span>
//               </div>
//               <span className="text-sm font-medium text-primary">
//                 Anambra State Government
//               </span>
//             </div>
//           </div>
          
//           <p className="text-sm text-muted-foreground text-center md:text-right">
//             © {currentYear} Anambra State Government. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Globe, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Force scroll to top when clicking footer links
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-amber">
                <MapPin className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-playfair font-bold text-foreground">
                  Anambra GeoHub
                </h3>
                <p className="text-sm text-muted-foreground">Health Data Repository</p>
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
                to="/about" 
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                About GeoHub
              </Link>
              <Link 
                to="/repository" 
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Data Repository
              </Link>
              <Link 
                to="/analytics" 
                onClick={handleLinkClick}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Analytics Dashboard
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
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">AS</span>
              </div>
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
