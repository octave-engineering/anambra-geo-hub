import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Target, Eye, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  const team = [
    {
      name: "Anambra State Ministry of Health",
      role: "Project Lead & Data Governance",
      description: "Leading the initiative to digitize and democratize health data access across Anambra State.",
    },
    {
      name: "GRID3 Nigeria",
      role: "Geospatial Data Partner",
      description: "Providing high-resolution geospatial data and mapping infrastructure support.",
    },
    {
      name: "NPHCDA",
      role: "Primary Healthcare Data",
      description: "Contributing primary healthcare facility registry and service delivery data.",
    },
    {
      name: "Development Partners",
      role: "Technical & Financial Support",
      description: "NGOs, donors, and international organizations supporting health system strengthening.",
    },
  ];

  const achievements = [
    { number: "20+", label: "Health Datasets", description: "Comprehensive data from multiple sources" },
    { number: "21", label: "LGAs Covered", description: "Complete geographic coverage of Anambra State" },
    { number: "500+", label: "Health Facilities", description: "Mapped and registered facilities" },
    { number: "100%", label: "Data Quality", description: "Standardized and validated datasets" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-amber">
              <MapPin className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground">
                About Anambra Health GeoHub
              </h1>
              <p className="text-xl text-muted-foreground">
                Transforming health data into actionable insights
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To create a comprehensive, accessible, and secure health data ecosystem that empowers 
                evidence-based decision making, improves health outcomes, and strengthens the health 
                system across Anambra State through innovative geospatial analytics and data integration.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Eye className="h-6 w-6 text-primary" />
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be the leading state-level health data platform in Nigeria, setting the standard 
                for transparent, accessible, and actionable health information systems that drive 
                sustainable improvements in population health and healthcare delivery.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center mb-8">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-card transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <CardTitle>Data Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Harmonize health data from DHIS2, GRID3, PHC facilities, and disease-specific 
                  programs into a unified, standardized repository.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🗺️</span>
                </div>
                <CardTitle>Geospatial Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Provide interactive mapping and spatial analysis tools to visualize health 
                  patterns, identify hotspots, and support geographic decision making.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-card transition-all duration-200">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔐</span>
                </div>
                <CardTitle>Secure Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Implement role-based access controls ensuring appropriate data sharing while 
                  maintaining privacy and security of sensitive health information.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Partners */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center mb-8">
            Key Partners & Stakeholders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="hover:border-primary/20 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center mb-8">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-200">
                <CardContent className="p-6">
                  <div className="text-4xl font-playfair font-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  <div className="font-semibold text-foreground mb-2">
                    {achievement.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement.description}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-playfair font-bold text-center mb-8">
            Technology & Standards
          </h2>
          <Card>
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

        {/* CTA */}
        <section className="text-center bg-gradient-primary rounded-2xl p-12">
          <h2 className="text-3xl font-playfair font-bold text-primary-foreground mb-4">
            Ready to Explore Health Data?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join us in transforming healthcare through data-driven insights and evidence-based decision making.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link to="/repository">
                Browse Data Repository
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/login">
                Get Access
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;