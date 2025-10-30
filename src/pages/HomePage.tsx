import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Map, BarChart3, Users, Shield, Zap } from "lucide-react";
import phcFacility from "@/assets/phc-facility-1.jpg";
import healthWorkers from "@/assets/health-workers.jpg";
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden text-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/src/assets/Map-Video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Content */}
              <div className="relative z-10">
                <h1 className="font-bold leading-tight text-center text-[#ffaa00] px-4">
                  <div className="text-4xl sm:text-5xl lg:text-6xl whitespace-nowrap mb-1">Welcome To</div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl whitespace-normal break-words mb-6">Anambra Health GeoHub</div>
                </h1>
                <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto leading-relaxed text-center mb-10">
                  Harness the power of health and geospatial data to drive smarter decisions across Anambra State.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-auto px-8 mx-auto sm:mx-0 bg-[#ffaa00] border-2 border-[#ffaa00] text-white hover:bg-[#ffaa00] hover:border-[#ffaa00] transition-all duration-200 hover:shadow-lg"
              >
                <Link to="/dataportal" className="whitespace-nowrap">
                  Browse Repository
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-4">
              Powerful Features for Health Data Management
            </h2>
            <p className="text-xl text-gray-800 font-medium max-w-3xl mx-auto">
              Comprehensive tools and capabilities to manage, analyze, and visualize health data across Anambra State
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border hover:border-primary/20 transition-all duration-200 hover:shadow-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
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
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-4">
              Health Facilities in Anambra State
            </h2>
            <p className="text-xl text-gray-800 font-medium max-w-2xl mx-auto">
              Comprehensive healthcare infrastructure serving communities across all 21 Local Government Areas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border hover:border-primary/20 transition-all duration-200 hover:shadow-card">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={phcFacility} 
                  alt="Primary Health Care Facility" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Primary Health Care Centers</h3>
                <p className="text-muted-foreground">
                  Modern PHC facilities providing essential healthcare services including maternal health, immunization, and basic medical care to communities across Anambra State.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border hover:border-primary/20 transition-all duration-200 hover:shadow-card">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={healthWorkers} 
                  alt="Healthcare Workers" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Healthcare Professionals</h3>
                <p className="text-muted-foreground">
                  Dedicated medical professionals working tirelessly to provide quality healthcare services, disease surveillance, and health education to communities.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border hover:border-primary/20 transition-all duration-200 hover:shadow-card">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={ruralHealthFacility} 
                  alt="Rural Health Facility" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Rural Health Facilities</h3>
                <p className="text-muted-foreground">
                  Community-based health facilities equipped with modern medical equipment and sustainable power solutions to serve rural populations effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-4">
              Real-World Applications
            </h2>
            <p className="text-xl text-gray-800 font-medium max-w-2xl mx-auto">
              See how Anambra GeoHub transforms health data into actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center border hover:border-primary/20 transition-all duration-200 hover:shadow-card">
                <CardHeader>
                  <div className="text-6xl mb-4">{useCase.image}</div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-primary-foreground mb-6">
            Ready to Explore Health Data?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of health professionals, researchers, and policymakers using Anambra GeoHub to make data-driven decisions.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="bg-[#ffaa00] border-2 border-[#ffaa00] text-white hover:bg-[#ffaa00] hover:border-[#ffaa00] transition-all duration-200 px-8 hover:shadow-lg">
              <Link to="/dataportal">
                Browse Repository
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
