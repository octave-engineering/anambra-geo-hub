import landingPageImage from "@/assets/Landing Page.png";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Target, Eye, Users, ChevronLeft, ChevronRight, Quote, MapPin, Database, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import InteractiveAnambraMap from "@/components/InteractiveAnambraMap";

const AboutPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
      name: "Department of Planning, Research and Statistics (PRS Unit)",
      role: "Data Management & Analytics",
      description: "Providing research, planning and statistical support for health data integration.",
    },
    {
      name: "Development Partners",
      role: "Technical & Financial Support",
      description: "NGOs, donors, and international organizations supporting health system strengthening.",
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
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundImage: `url(${landingPageImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
      
      {/* Main content container with flex-grow to push footer down */}
      <main className="flex-grow relative z-0">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16 px-2 sm:px-0">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-lg flex items-center justify-center shadow-amber flex-shrink-0">
              <Info className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black drop-shadow-sm">
                About Anambra Health GeoHub
              </h1>
              <p className="text-lg sm:text-xl text-[#ffaa00] mt-2 font-medium">
                Transforming health data into actionable insights
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0">
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
        <section className="mb-12 sm:mb-16 px-2 sm:px-0">
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
        <section className="mb-12 sm:mb-16 px-2 sm:px-0">
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
        <section className="mb-12 sm:mb-16 px-2 sm:px-0">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex flex-col sm:flex-row items-center justify-center">
              <span className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#ffaa00] mr-2 sm:mr-3 flex-shrink-0" />
                <span>Voices from the Field</span>
              </span>
              <span className="text-lg sm:text-xl text-[#ffaa00] mt-1 sm:mt-0 sm:ml-2">
                Real Stories of Impact
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
              Voices from health workers and data professionals using spatial intelligence to strengthen primary health care and disease control across Anambra State
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative bg-white/95 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
            {/* Subtle map watermark background with orange accent */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-20 sm:w-32 h-20 sm:h-32 border border-slate-300 rounded-lg"></div>
              <div className="absolute top-1/2 right-1/4 w-16 sm:w-24 h-16 sm:h-24 border border-[#ffaa00] rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-24 sm:w-40 h-16 sm:h-20 border border-slate-300 rounded-lg"></div>
              <div className="absolute top-1/3 right-1/3 w-20 sm:w-28 h-20 sm:h-28 border border-[#ffaa00] rounded-lg"></div>
            </div>

            <div className="relative z-10">
              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffaa00] focus:ring-offset-2"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </button>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-[#ffaa00]' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffaa00] focus:ring-offset-2"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </button>
              </div>

              {/* Testimonial Content */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="text-center mb-2 sm:mb-8">
                  <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-[#ffaa00] mx-auto mb-3 sm:mb-4" />
                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                  <div className="space-y-1">
                    <h4 className="text-base sm:text-lg font-semibold text-black">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-sm text-[#ffaa00] font-medium">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm text-gray-600 mt-1">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span>{testimonials[currentTestimonial].organization}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span>{testimonials[currentTestimonial].location}</span>
                    </div>
                  </div>
                </div>
              </div>

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
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-inter font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real results from transforming health data into actionable insights across Anambra State
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-4xl font-bold text-[#ffaa00]">2,500+</div>
                    <div className="text-lg font-semibold text-foreground">Healthcare Workers</div>
                    <div className="text-sm text-muted-foreground">Active platform users across Anambra State</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-4xl font-bold text-[#ffaa00]">21</div>
                    <div className="text-lg font-semibold text-foreground">LGAs Covered</div>
                    <div className="text-sm text-muted-foreground">Complete statewide coverage</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-4xl font-bold text-[#ffaa00]">50M+</div>
                    <div className="text-lg font-semibold text-foreground">Data Points</div>
                    <div className="text-sm text-muted-foreground">Health records processed and analyzed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-[#ffaa00] flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-4xl font-bold text-[#ffaa00]">99.9%</div>
                    <div className="text-lg font-semibold text-foreground">Data Accuracy</div>
                    <div className="text-sm text-muted-foreground">Validated and quality-assured information</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-inter font-bold text-center mb-8">
            Technology & Standards
          </h2>
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-lg mb-4">Data Standards</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• DHIS2 Data Exchange Standards</li>
                    <li>• HL7 FHIR for Health Information Exchange</li>
                    <li>• WHO Health Data Standards</li>
                    <li>• GeoJSON for Spatial Data</li>
                    <li>• ISO 27001 Security Standards</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-4">Technical Infrastructure</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• QGIS Integration for Spatial Analysis</li>
                    <li>• PostGIS for Geospatial Database</li>
                    <li>• Real-time API Connections</li>
                    <li>• Cloud-based Storage & Processing</li>
                    <li>• Mobile-responsive Web Interface</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive LGA Map Section */}
        <section className="mb-16">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
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
        </div>
      </main>
    </div>
  );
};

export default AboutPage;