import landingPageImage from "@/assets/Landing Page.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Target, Eye, Users, ChevronLeft, ChevronRight, Quote, MapPin, Database, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InteractiveAnambraMap from "@/components/InteractiveAnambraMap";
import TestimonialCarousel from "@/components/TestimonialCarousel";

const AboutPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);


  const team = [
    {
      name: "Anambra State Ministry of Health (SMOH)",
      role: "Project Lead & Data Governance",
      description: "Leading the initiative to digitize and democratize health data access across Anambra State.",
    },
    {
      name: "Primary Health Care Development Agency (ASPHCDA)",
      role: "Primary Healthcare Data",
      description: "Contributing primary healthcare facility registry and service delivery data.",
    },
    {
      name: "Umbrella Fund",
      role: "Sponsor",
      description: "Providing financial support and strategic guidance for the Anambra Geospatial Platform initiative.",
    },
    {
      name: "Dev Afrique",
      role: "Technical Partner",
      description: "Collaborating on the development and implementation of the geospatial platform's technical infrastructure.",
    },
  ];

  const testimonials = [
    {
      name: "Amaka Odu",
      role: "Community Health Officer",
      organization: "PHC Nise",
      location: "Awka South LGA, Anambra State",
      quote: "With the new geospatial dashboard, we can now visualize where our immunization coverage is strong and where gaps exist. It helps us plan outreach to hard-to-reach communities instead of relying on guesswork. Data has become a real tool for decision-making at the PHC level."
    },
    {
      name: "Dr. Chibuike Okafor",
      role: "Epidemiologist",
      organization: "Anambra State Ministry of Health",
      location: "Awka, Anambra State",
      quote: "Geospatial disease mapping has changed how we respond to outbreaks. During the recent cholera alerts, we used the spatial data to identify affected wards and deploy rapid response teams faster. It's improving both surveillance and response time across the state."
    },
    {
      name: "Ngozi Eze",
      role: "LGA Health Officer",
      organization: "Anambra East LGA",
      location: "Anambra State",
      quote: "Before this project, our data were scattered — DHIS2 here, Excel there. Now the geospatial platform helps us harmonize facility data with population and disease data. We can see which wards lack PHCs and prioritize new facility locations with evidence."
    },
    {
      name: "Dr. Ifeanyi Nnadi",
      role: "Medical Officer",
      organization: "Anambra State Primary Health Care Development Agency (ASPHCDA)",
      location: "Awka, Anambra State",
      quote: "The geospatial analytics are helping us identify clusters of high malaria incidence and link them with environmental factors. This level of spatial insight was never possible before. It's transforming how we target interventions and allocate limited resources."
    },
    {
      name: "Chidinma Okeke",
      role: "Ward Development Committee Member",
      organization: "Ogbaru Ward 4",
      location: "Anambra State",
      quote: "When we see our community's data on the health map, it feels real. We now understand which households are far from the nearest PHC and why outreach services matter. The map helps us advocate for better facilities with solid evidence."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Responsive Height with Text */}
      <div className="relative w-full min-h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${landingPageImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: 'scale(1.1)',
            filter: 'blur(8px)',
            WebkitFilter: 'blur(8px)'
          }}
          aria-hidden="true"
        >
          {/* Background image with blur effect */}
        </div>
        
        {/* Content directly on the image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto text-black p-4 sm:p-6 md:p-8">
            <div className="p-4 rounded-lg">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-black">
                About the Anambra Geospatial Health Platform
              </h1>
              <div className="space-y-5 text-base sm:text-lg md:text-xl leading-relaxed text-justify">
                <p className="font-medium sm:font-semibold text-black">
                  The Anambra Geospatial Health Platform is a centralized data system that integrates multiple sources of health and geospatial information across the state, including routine data, surveys, and facility mapping. It provides a transparent and comprehensive view of health indicators to support evidence-based decision-making and improved service delivery.
                </p>
                <p className="font-medium sm:font-semibold text-black">
                  By harmonizing diverse datasets and building local capacity for geospatial analytics, the platform aims to strengthen health data quality and governance. It fosters collaboration among government agencies, health institutions, and development partners to enhance monitoring of health trends and improve outcomes for communities across Anambra State.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content container */}
      <main className="relative z-10 bg-white w-full">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-14">
          <Card className="border-l-4 border-l-[#ffaa00] bg-white/95 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffaa00] flex-shrink-0" />
                <span className="text-black">Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                To create a comprehensive, accessible, and secure health data ecosystem that empowers
                evidence-based decision making, improves health outcomes, and strengthens the health
                system across Anambra State through innovative geospatial analytics and data integration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#ffaa00] bg-white/95 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffaa00] flex-shrink-0" />
                <span className="text-black">Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                To be the leading state-level health data platform in Nigeria, setting the standard
                for transparent, accessible, and actionable health information systems that drive
                sustainable improvements in population health and healthcare delivery.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-black">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-200 bg-white/95">
              <CardHeader>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ffaa00]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">📊</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-black">Data Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-base leading-relaxed">
                  Harmonize health data from DHIS2, GRID3, PHC facilities, and disease-specific programs into a unified, standardized repository.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-200 bg-white/95">
              <CardHeader>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ffaa00]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">🗺️</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-black">Geospatial Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-base leading-relaxed">
                  Provide interactive mapping and spatial analysis tools to visualize health patterns, identify hotspots, and support geographic decision making.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-200 bg-white/95">
              <CardHeader>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#ffaa00]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">🔐</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl text-black">Secure Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-base leading-relaxed">
                  Implement role-based access controls ensuring appropriate data sharing while maintaining privacy and security of sensitive health information.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Partners */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-black">
            Key Partners & Stakeholders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {team.map((member, index) => (
              <Card key={index} className="hover:border-[#ffaa00]/30 transition-all duration-200 bg-white/95 shadow-md hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-black">{member.name}</CardTitle>
                  <CardDescription className="text-[#ffaa00] font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* User Testimonials */}
        <section className="py-6 sm:py-10 bg-gray-50 w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-4">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from healthcare professionals, government officials, and community members about their experience with the Anambra Geospatial Platform.
              </p>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="mb-10 sm:mb-14 w-full">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl font-inter font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from transforming health data into actionable insights across Anambra State
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-[#ffaa00]">2,500+</div>
                    <div className="text-base sm:text-lg font-semibold text-foreground">Healthcare Workers</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Active platform users across Anambra State</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-[#ffaa00]">21</div>
                    <div className="text-base sm:text-lg font-semibold text-foreground">LGAs Covered</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Complete statewide coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-[#ffaa00]">50M+</div>
                    <div className="text-base sm:text-lg font-semibold text-foreground">Data Points</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Health records processed and analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-[#ffaa00]">99.9%</div>
                    <div className="text-base sm:text-lg font-semibold text-foreground">Data Accuracy</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Validated and quality-assured information</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Interactive LGA Map Section */}
        <section className="mb-10 sm:mb-14 w-full">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg sm:shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-inter font-bold mb-2">Anambra State LGAs</h2>
                <p className="text-muted-foreground">Interactive map showing data coverage across all 21 Local Government Areas</p>
              </div>
              
              <div className="w-full max-w-4xl mx-auto">
                <InteractiveAnambraMap />
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground text-center">
                <p>Hover over or tap on any LGA to view its details. Use the +/- buttons to zoom in and out.</p>
                <p className="mt-2 text-xs">Note: This is a demo with sample data. Actual data will be displayed in the production version.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-1">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "w-8 bg-[#ffaa00]"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
  );
};

const aboutPageStyles = `
  .about-content {
    position: relative;
    z-index: 1;
    background-color: white;
  }
`;

// Add the styles to the document head
const styleElement = document.createElement('style');
styleElement.innerHTML = aboutPageStyles;
document.head.appendChild(styleElement);

export default AboutPage;