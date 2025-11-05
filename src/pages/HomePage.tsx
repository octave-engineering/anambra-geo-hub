import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Map, BarChart3, Users, Shield, Zap } from "lucide-react";
import phcFacility from "@/assets/phc-facility-1.jpg";
import healthWorkers from "@/assets/health-workers.png";
import ruralHealthFacility from "@/assets/rural-health-facility.jpg";
import heroImage from "@/assets/map.png";
import heroBg from "@/assets/hero-bg-main.svg";
import background from "@/assets/geo-hub-backgroun.jpeg";
import landingPageImage from "@/assets/Landing Page.png";

const HomePage = () => {
  const features = [
    {
      icon: Database,
      title: "Comprehensive Data Repository",
      description:
        "Access 20+ health datasets from DHIS2, GRID3, PHC facilities, and disease-specific units including HIV, TB, Malaria, and NTDs.",
    },
    {
      icon: Map,
      title: "Interactive Geospatial Maps",
      description:
        "Visualize health data across all 21 Local Government Areas in Anambra State with interactive mapping tools.",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Monitor disease trends, facility performance, and population health indicators with dynamic dashboards.",
    },
    {
      icon: Users,
      title: "Multi-level Access",
      description:
        "Role-based access for government officials, NGOs, development partners, and public users.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Enterprise-grade security ensuring data privacy and compliance with health information standards.",
    },
    {
      icon: Zap,
      title: "QGIS Integration",
      description:
        "Seamlessly integrate with QGIS and PostGIS for advanced geospatial analysis and modeling.",
    },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset video when component unmounts
  useEffect(() => {
    const video = videoRef.current;
    
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []);

  const useCases = [
    {
      title: "Disease Surveillance",
      description:
        "Track disease outbreaks and monitor epidemiological trends across the state.",
      image: "🦠",
    },
    {
      title: "Health Facility Planning",
      description:
        "Optimize health facility locations and resource allocation using geospatial data.",
      image: "🏥",
    },
    {
      title: "Population Health Analytics",
      description:
        "Analyze population health indicators and demographic trends for evidence-based planning.",
      image: "👥",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden text-center px-4 sm:px-6">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={`${import.meta.env.BASE_URL}Map-Video.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Content */}
              <div className="relative z-10">
                <h1 className="font-bold leading-tight text-center text-[#ffaa00] px-2 sm:px-4">
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-1">Welcome To</div>
                  <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight">Anambra Health GeoHub</div>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white font-medium sm:font-semibold max-w-3xl mx-auto leading-relaxed text-center mb-8 sm:mb-10 px-2 sm:px-4">
                  Harness the power of health and geospatial data to drive smarter decisions across Anambra State.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-[#ffaa00] border-2 border-[#ffaa00] text-white hover:bg-[#ffaa00] hover:border-[#ffaa00] transition-all duration-200 hover:shadow-lg"
              >
                <Link to="/dataportal" className="whitespace-nowrap flex items-center justify-center">
                  Browse Repository
                  <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-bold text-foreground mb-3 sm:mb-4">
              Powerful Features for Health Data Management
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 sm:text-gray-800 font-medium max-w-3xl mx-auto">
              Comprehensive tools and capabilities to manage, analyze, and visualize health data across Anambra State
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="h-full border hover:border-primary/20 transition-all duration-200 hover:shadow-card"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Facilities Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-bold text-foreground mb-3 sm:mb-4">
              Health Facilities in Anambra State
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 sm:text-gray-800 font-medium max-w-2xl mx-auto">
              Comprehensive healthcare infrastructure serving communities across all 21 Local Government Areas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                image: phcFacility,
                title: "Primary Health Care Centers",
                description: "Modern PHC facilities providing essential healthcare services including maternal health, immunization, and basic medical care to communities across Anambra State.",
                alt: "Primary Health Care Facility"
              },
              {
                image: healthWorkers,
                title: "Healthcare Professionals",
                description: "Dedicated medical professionals working tirelessly to provide quality healthcare services, disease surveillance, and health education to communities.",
                alt: "Healthcare Workers"
              },
              {
                image: ruralHealthFacility,
                title: "Rural Health Facilities",
                description: "Community-based health facilities equipped with modern medical equipment and sustainable power solutions to serve rural populations effectively.",
                alt: "Rural Health Facility"
              }
            ].map((item, index) => (
              <Card 
                key={index}
                className="h-full overflow-hidden border hover:border-primary/20 transition-all duration-200 hover:shadow-card flex flex-col"
              >
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mt-auto">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-bold text-foreground mb-3 sm:mb-4">
              Real-World Applications
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 sm:text-gray-800 font-medium max-w-2xl mx-auto">
              See how Anambra GeoHub transforms health data into actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {useCases.map((useCase, index) => (
              <Card 
                key={index} 
                className="h-full text-center border hover:border-primary/20 transition-all duration-200 hover:shadow-card flex flex-col"
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{useCase.image}</div>
                  <CardTitle className="text-lg sm:text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm sm:text-base">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-inter font-bold text-primary-foreground mb-4 sm:mb-6">
            Ready to Explore Health Data?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of health professionals, researchers, and policymakers using Anambra GeoHub to make data-driven decisions.
          </p>
          <div className="flex justify-center">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-[#ffaa00] border-2 border-[#ffaa00] text-white hover:bg-[#ffaa00] hover:border-[#ffaa00] transition-all duration-200 hover:shadow-lg"
            >
              <Link to="/dataportal" className="flex items-center justify-center">
                Browse Repository
                <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
