import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Target, Eye, Users, Award, ArrowRight, ChevronLeft, ChevronRight, Quote, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-amber">
              <Info className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-inter font-bold text-foreground">
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
          <h2 className="text-3xl font-inter font-bold text-center mb-8">
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
          <h2 className="text-3xl font-inter font-bold text-center mb-8">
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

        {/* User Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-inter font-bold mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              Voices from the Field — Real Stories of Impact (Anambra State)
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Voices from health workers and data professionals using spatial intelligence to strengthen primary health care and disease control across Anambra State
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative bg-gradient-to-br from-slate-50 via-orange-50/40 to-blue-50/30 rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100">
            {/* Subtle map watermark background with orange accent */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-slate-300 rounded-lg"></div>
              <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-orange-200 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/3 w-40 h-20 border border-slate-300 rounded-lg"></div>
              <div className="absolute top-1/3 right-1/3 w-28 h-28 border border-orange-200 rounded-lg"></div>
            </div>

            <div className="relative z-10">
              {/* Navigation Arrows */}
              <div className="flex justify-between items-center mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentTestimonial
                          ? "bg-primary scale-125"
                          : "bg-primary/30 hover:bg-primary/50"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Testimonial Content */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="mb-8">
                  <Quote className="h-12 w-12 text-primary/30 mx-auto mb-4" />
                  <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed italic mb-6">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800 text-lg">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-primary font-medium">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-sm text-slate-600">
                      {testimonials[currentTestimonial].organization}, {testimonials[currentTestimonial].location}
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
                          ? "w-8 bg-primary"
                          : "w-2 bg-primary/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16">
          <h2 className="text-3xl font-inter font-bold text-center mb-8">
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
          <h2 className="text-3xl font-inter font-bold text-primary-foreground mb-4">
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