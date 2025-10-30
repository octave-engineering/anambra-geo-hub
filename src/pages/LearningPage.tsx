import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Play, 
  Download, 
  ExternalLink, 
  FileText, 
  Video,
  Star,
  Globe,
  Database,
  Archive,
  Eye,
  CheckCircle,
  Monitor,
  Map,
  Layers,
  Search,
  Filter,
  Server,
  Code,
  Users,
  ArrowRight,
  BarChart3,
  Book,
  FileCode,
  MapPin,
  Smartphone,
  Cloud,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Quote
} from "lucide-react";

const LearningPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Recent YouTube Tutorials (2024-2025)
  const videoTutorials = [
    // Newly Added Videos
    {
      title: "QGIS Full Course for Beginners: Master GIS Mapping & Analysis for Free!",
      description: "Complete beginner's guide to QGIS covering mapping, analysis, and visualization techniques",
      duration: "2h 45m",
      level: "Beginner",
      views: "1.8M",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/xKlk3IXyPMo/maxresdefault.jpg",
      url: "https://youtu.be/xKlk3IXyPMo?si=UV6y4C9zp8NJTuHK",
      instructor: "GeoDelta Labs",
      topics: ["QGIS Basics", "Mapping", "Spatial Analysis", "Beginner Friendly"],
      category: "QGIS"
    },
    {
      title: "What is GIS? A Guide to Geographic Information Systems",
      description: "Comprehensive introduction to Geographic Information Systems and their applications",
      duration: "35m",
      level: "Beginner",
      views: "950K",
      rating: 4.7,
      thumbnail: "https://img.youtube.com/vi/Hau_ZCmN8eU/maxresdefault.jpg",
      url: "https://youtu.be/Hau_ZCmN8eU?si=X1FAZIwfk4Gag-wf",
      instructor: "GIS & RS Professionals",
      topics: ["GIS Fundamentals", "Spatial Analysis", "Data Visualization", "Applications"],
      category: "Geospatial Basics"
    },
    {
      title: "What is GeoSpatial Data?",
      description: "Understanding the fundamentals of geospatial data and its significance",
      duration: "28m",
      level: "Beginner",
      views: "420K",
      rating: 4.6,
      thumbnail: "https://img.youtube.com/vi/zp6Q4FMamqk/maxresdefault.jpg",
      url: "https://youtu.be/zp6Q4FMamqk?si=4TP4LMOka3adbqRS",
      instructor: "Spatial Data Science",
      topics: ["Geospatial Data", "Data Types", "Spatial Analysis", "Applications"],
      category: "Geospatial Basics"
    },
    {
      title: "What is Spatial Data? A Beginners Guide",
      description: "Introduction to spatial data concepts and their importance in geospatial analysis",
      duration: "32m",
      level: "Beginner",
      views: "380K",
      rating: 4.5,
      thumbnail: "https://img.youtube.com/vi/QMmk49KTCxk/maxresdefault.jpg",
      url: "https://youtu.be/QMmk49KTCxk?si=YoXm5M25PmBjM2LL",
      instructor: "GeoTech",
      topics: ["Spatial Data", "GIS Fundamentals", "Data Types", "Analysis"],
      category: "Geospatial Basics"
    },
    // Existing Videos
    {
      title: "QGIS Training Tutorials",
      description: "Comprehensive QGIS training covering essential tools and techniques for geospatial analysis",
      duration: "1h 15m",
      level: "Beginner to Intermediate",
      views: "256K",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/8oEnJvLzDnQ/maxresdefault.jpg",
      url: "https://youtu.be/8oEnJvLzDnQ?si=L7gkpgeW4uKJIMVW",
      instructor: "GIS Training Center",
      topics: ["QGIS Basics", "Spatial Analysis", "Data Visualization", "Practical Examples"],
      category: "QGIS"
    },
    // Geospatial Data Tutorials
    {
      title: "What is Geospatial Data?",
      description: "Introduction to geospatial data concepts, types, and applications in various fields",
      duration: "45m",
      level: "Beginner",
      views: "189K",
      rating: 4.7,
      thumbnail: "https://img.youtube.com/vi/FoLA4gGQGrE/maxresdefault.jpg",
      url: "https://youtu.be/FoLA4gGQGrE?si=Snv5hurvbK20KXRK",
      instructor: "GeoData Institute",
      topics: ["Data Types", "Spatial Analysis", "GIS Fundamentals", "Real-world Applications"],
      category: "Geospatial Basics"
    },
    {
      title: "Why Geospatial Data Matters for Health Equity",
      description: "Exploring the critical role of geospatial data in understanding and addressing health disparities",
      duration: "1h 5m",
      level: "Intermediate",
      views: "142K",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/FoLA4gGQGrE/maxresdefault.jpg",
      url: "https://youtu.be/FoLA4gGQGrE?si=Snv5hurvbK20KXRK",
      instructor: "Health Geomatics Lab",
      topics: ["Health Equity", "Spatial Analysis", "Public Health", "Data Visualization"],
      category: "Health GIS"
    },
    {
      title: "QGIS for Absolute Beginners 2025",
      description: "Step-by-step beginner tutorial covering QGIS fundamentals with the latest features",
      duration: "2h 30m",
      level: "Beginner",
      views: "1.5M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/OOuq7BkUxc0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=OOuq7BkUxc0",
      instructor: "GIS Academy",
      topics: ["QGIS Fundamentals", "Interface", "Basic Operations", "2025 Features"],
      category: "QGIS"
    },
    {
      title: "Learn GIS – QGIS Full Course for Beginners (2024)",
      description: "Comprehensive full course including data loading, styling, and spatial analysis",
      duration: "4h 15m",
      level: "Beginner",
      views: "2.1M",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/SovdBaus7pM/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=SovdBaus7pM",
      instructor: "Matt Forrest",
      topics: ["Complete Course", "Data Loading", "Styling", "Spatial Analysis"],
      category: "QGIS"
    },
    {
      title: "Introduction to QGIS (Full Course)",
      description: "Covers mapping, data processing, georeferencing, and advanced QGIS techniques",
      duration: "3h 45m",
      level: "Beginner to Intermediate",
      views: "1.8M",
      rating: 4.9,
      thumbnail: "https://img.youtube.com/vi/pGm7w-LywO0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=pGm7w-LywO0",
      instructor: "Spatial Thoughts",
      topics: ["Mapping", "Data Processing", "Georeferencing", "Advanced Techniques"],
      category: "QGIS"
    },
    {
      title: "QGIS Training Tutorials",
      description: "Comprehensive QGIS training covering essential tools and techniques for geospatial analysis",
      duration: "1h 15m",
      level: "Beginner to Intermediate",
      views: "256K",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/8oEnJvLzDnQ/maxresdefault.jpg",
      url: "https://youtu.be/8oEnJvLzDnQ?si=L7gkpgeW4uKJIMVW",
      instructor: "GIS Training Center",
      topics: ["QGIS Basics", "Spatial Analysis", "Data Visualization", "Practical Examples"],
      category: "QGIS"
    },
    // KoboToolbox Tutorials
    {
      title: "KoboToolbox for Beginners - Complete Guide",
      description: "A comprehensive tutorial on getting started with KoboToolbox for data collection and form creation",
      duration: "1h 12m",
      level: "Beginner",
      views: "42K",
      rating: 4.7,
      thumbnail: "https://img.youtube.com/vi/Eh-yYEwpLAo/maxresdefault.jpg",
      url: "https://youtu.be/Eh-yYEwpLAo?si=2iTcLitPyv0A3Xzu",
      instructor: "KoboToolbox",
      topics: ["Getting Started", "Form Creation", "Data Collection", "Basic Features"],
      category: "KoboToolbox"
    },
    {
      title: "KoboToolbox - Complete Tutorial",
      description: "Learn how to use KoboToolbox for field data collection and management",
      duration: "45m",
      level: "Beginner to Intermediate",
      views: "35K",
      rating: 4.6,
      thumbnail: "https://img.youtube.com/vi/3w9-Y0KbOV0/maxresdefault.jpg",
      url: "https://youtu.be/3w9-Y0KbOV0?si=m19KsmnxA5arr5Ve",
      instructor: "GeoDev",
      topics: ["Form Design", "Data Collection", "Analysis", "Best Practices"],
      category: "KoboToolbox"
    },
    // PostGIS Tutorials
    {
      title: "Getting started with PostGIS (Supabase)",
      description: "Demonstrates creating geospatial tables, queries, and spatial operations in PostGIS",
      duration: "1h 20m",
      level: "Beginner",
      views: "456K",
      rating: 4.7,
      thumbnail: "https://img.youtube.com/vi/MWfB0t5u3V0/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=MWfB0t5u3V0",
      instructor: "Supabase",
      topics: ["PostGIS Setup", "Spatial Tables", "Spatial Queries", "Database Operations"],
      category: "PostGIS"
    },
    {
      title: "Create Spatial APIs with FastAPI + PostGIS",
      description: "Shows how to build web APIs that serve geospatial data using FastAPI and PostGIS",
      duration: "2h 30m",
      level: "Advanced",
      views: "89K",
      rating: 4.8,
      thumbnail: "https://img.youtube.com/vi/3slZwYvjvWg/maxresdefault.jpg",
      url: "https://www.youtube.com/watch?v=3slZwYvjvWg",
      instructor: "API Developer",
      topics: ["Web APIs", "FastAPI", "Geospatial APIs", "Data Serving"],
      category: "Web Development"
    }
  ];

  // E-books and Documentation
  const ebooks = [
    {
      title: "QGIS Training Manual (Official Guide)",
      description: "Official QGIS training manual with comprehensive tutorials, exercises, and sample data",
      type: "Official Documentation",
      pages: "800+",
      size: "Online",
      url: "https://docs.qgis.org/latest/en/docs/training_manual/",
      topics: ["Official Guide", "Tutorials", "Exercises", "Sample Data"]
    },
    {
      title: "WHO Geospatial Toolkit for Public Health",
      description: "World Health Organization's comprehensive toolkit for using GIS in public health applications",
      type: "WHO Publication",
      pages: "450",
      size: "18MB PDF",
      url: "https://apps.who.int/iris/handle/10665/337626",
      topics: ["Public Health", "WHO Standards", "Health Applications", "Best Practices"]
    },
    {
      title: "GRID3 Nigeria – Geospatial Data Documentation",
      description: "Documentation and datasets on population, settlements, and health infrastructure in Nigeria",
      type: "Data Portal",
      pages: "Online",
      size: "Portal",
      url: "https://nigeria.grid3.org/resources",
      topics: ["Nigeria Data", "Population", "Settlements", "Health Infrastructure"]
    },
    {
      title: "PostGIS in Action (Manning) – Sample Chapters",
      description: "Advanced spatial analysis, geoprocessing, and database optimization in PostGIS",
      type: "Book Sample",
      pages: "200+",
      size: "PDF",
      url: "https://www.manning.com/books/postgis-in-action-third-edition",
      topics: ["Advanced Analysis", "Geoprocessing", "Database Optimization", "Spatial Queries"]
    },
    {
      title: "GIS for Health & Epidemiology Reference Guide",
      description: "Comprehensive reference for applying GIS techniques to health and epidemiological studies",
      type: "Reference Guide",
      pages: "300",
      size: "15MB PDF",
      url: "https://www.cdc.gov/gis/",
      topics: ["Health GIS", "Epidemiology", "Spatial Analysis", "Disease Mapping"]
    },
    {
      title: "Spatial SQL for Geospatial Analysis",
      description: "Complete guide to using SQL for spatial analysis and geospatial database queries",
      type: "Technical Guide",
      pages: "250",
      size: "12MB PDF",
      url: "https://postgis.net/workshops/postgis-intro/",
      topics: ["Spatial SQL", "Database Queries", "Spatial Analysis", "Performance"]
    },
    {
      title: "QGIS for Epidemiology: Workshop Manual (WHO)",
      description: "WHO workshop materials for mapping and analyzing health data in QGIS",
      type: "Workshop Manual",
      pages: "150",
      size: "8MB PDF",
      url: "https://www.who.int/publications/i/item/9789240036086",
      topics: ["Epidemiology", "Health Mapping", "WHO Materials", "Workshop Guide"]
    },
    {
      title: "OpenStreetMap Beginner's Manual",
      description: "Step-by-step guide for contributing to and extracting data from OpenStreetMap",
      type: "Tutorial Manual",
      pages: "200",
      size: "10MB PDF",
      url: "https://learnosm.org/en/",
      topics: ["OpenStreetMap", "Data Contribution", "Mapping", "Data Extraction"]
    },
    {
      title: "Georeferencing and Raster GIS Techniques",
      description: "Advanced techniques for georeferencing raster data and working with imagery in GIS",
      type: "Technical Guide",
      pages: "180",
      size: "9MB PDF",
      url: "https://docs.qgis.org/latest/en/docs/user_manual/working_with_raster/georeferencer.html",
      topics: ["Georeferencing", "Raster Data", "Imagery", "Spatial Reference"]
    },
    {
      title: "Cloud-Native GIS & Modern Geospatial Architectures",
      description: "Guide to building scalable, cloud-based geospatial applications and architectures",
      type: "Architecture Guide",
      pages: "400",
      size: "20MB PDF",
      url: "https://cloud.google.com/solutions/geospatial",
      topics: ["Cloud GIS", "Scalable Architecture", "Modern GIS", "Cloud Deployment"]
    }
  ];

  // Sample Data and Hands-on Tutorials
  const sampleData = [
    {
      title: "QGIS Sample Data Sets",
      description: "Official QGIS training datasets including shapefiles, rasters, and project files",
      format: "GitHub Repository",
      size: "500MB",
      features: "Multiple Datasets",
      url: "https://github.com/qgis/QGIS-Training-Data",
      topics: ["Training Data", "Shapefiles", "Rasters", "Project Files"]
    },
    {
      title: "GRID3 Nigeria Health Facility Dataset",
      description: "Locations and attributes of health facilities across Nigeria with detailed metadata",
      format: "Shapefile/CSV",
      size: "25MB",
      features: "Health Facilities",
      url: "https://data.grid3.org/datasets/nigeria-health-facilities",
      topics: ["Health Facilities", "Nigeria Data", "Locations", "Attributes"]
    },
    {
      title: "Anambra State Sample Data Package",
      description: "Curated dataset for Anambra State including PHCs, population, and administrative boundaries",
      format: "ZIP Archive",
      size: "50MB",
      features: "Anambra Data",
      url: "https://data.grid3.org/datasets/nigeria-health-facilities",
      topics: ["Anambra State", "PHC Data", "Population", "Boundaries"]
    },
    {
      title: "PostgreSQL Spatial Database Dumps",
      description: "Pre-configured PostgreSQL dumps with PostGIS extensions and sample spatial data",
      format: "SQL Dumps",
      size: "100MB",
      features: "Database Dumps",
      url: "https://github.com/qgis/QGIS-Training-Data",
      topics: ["PostgreSQL", "PostGIS", "Database Dumps", "Sample Data"]
    },
    {
      title: "DHIS2 Training Hub",
      description: "Courses on data entry, analytics, and integration with geospatial platforms",
      format: "Online Platform",
      size: "Portal",
      features: "Training Courses",
      url: "https://academy.dhis2.org/",
      topics: ["Data Entry", "Analytics", "Integration", "Health Information Systems"]
    }
  ];

  // Core Tools and Platforms
  const tools = [
    {
      name: "QGIS",
      icon: Map,
      description: "Open-source GIS software used for mapping and spatial analysis.",
      role: "Used to visualize and analyze health facility data, disease trends, and population coverage across Anambra LGAs.",
      useCase: "Creating interactive maps showing health facility distribution and identifying underserved areas in Anambra State.",
      downloadLinks: [
        { title: "Download QGIS (Windows)", url: "https://qgis.org/en/site/forusers/download.html", platform: "Windows" },
        { title: "Download QGIS (macOS)", url: "https://qgis.org/en/site/forusers/download.html", platform: "macOS" },
        { title: "Download QGIS (Linux)", url: "https://qgis.org/en/site/forusers/download.html", platform: "Linux" }
      ],
      learningLinks: [
        { title: "QGIS Training Manual", url: "https://docs.qgis.org/3.28/en/docs/training_manual/" },
        { title: "QGIS Tutorials and Tips", url: "https://www.qgistutorials.com/en/" }
      ],
      category: "Desktop GIS"
    },
    {
      name: "PostgreSQL + PostGIS",
      icon: Database,
      description: "Powerful open-source spatial database system.",
      role: "Stores and manages all geospatial datasets (PHCs, wards, disease data). Enables fast queries and integration between data layers.",
      useCase: "Managing and querying spatial health data, performing complex geographic analysis, and serving data to web applications.",
      downloadLinks: [
        { title: "Download PostgreSQL", url: "https://www.postgresql.org/download/", platform: "All Platforms" },
        { title: "PostGIS Installation", url: "https://postgis.net/install/", platform: "Extension" }
      ],
      learningLinks: [
        { title: "PostGIS Workshop", url: "https://postgis.net/workshops/postgis-intro/" },
        { title: "PostGIS Documentation", url: "https://postgis.net/documentation/" }
      ],
      category: "Database"
    },
    {
      name: "KoBoCollect",
      icon: Smartphone,
      description: "Mobile data collection tool for health surveys and facility assessments.",
      role: "Enables field data collection from PHCs and wards using Android devices, feeding directly into the geospatial database.",
      useCase: "Collecting real-time health facility assessments and community surveys that automatically sync with the central database.",
      downloadLinks: [
        { title: "Download KoBoCollect (Android)", url: "https://play.google.com/store/apps/details?id=org.koboc.collect.android", platform: "Android" },
        { title: "KoBoToolbox Web Platform", url: "https://kf.kobotoolbox.org/", platform: "Web" }
      ],
      learningLinks: [
        { title: "KoBoToolbox Training Guide", url: "https://support.kobotoolbox.org/" },
        { title: "KoBoCollect YouTube Tutorials", url: "https://www.youtube.com/results?search_query=KoBoCollect+tutorial" }
      ],
      category: "Mobile Data Collection"
    },
    {
      name: "Cloud Platform",
      icon: Cloud,
      description: "The hosting environment for storing, managing, and serving geospatial data online.",
      role: "Hosts the spatial database and dashboards, enabling secure data access and visualization through the project's web portal.",
      useCase: "Providing 24/7 access to health data through secure web portals and enabling real-time collaboration across Anambra State.",
      downloadLinks: [
        { title: "Google Cloud Platform", url: "https://cloud.google.com/", platform: "Cloud Service" },
        { title: "AWS GIS Services", url: "https://aws.amazon.com/gis/", platform: "Cloud Service" },
        { title: "Microsoft Azure Maps", url: "https://azure.microsoft.com/en-us/products/azure-maps/", platform: "Cloud Service" }
      ],
      learningLinks: [
        { title: "Google Cloud GIS Overview", url: "https://cloud.google.com/solutions/gis" },
        { title: "PostGIS on Cloud Deployment Guide", url: "https://postgis.net/documentation/" }
      ],
      category: "Cloud Infrastructure"
    }
  ];

  // Learning Path Steps
  const learningPath = [
    {
      step: 1,
      title: "QGIS Basics",
      description: "Start with QGIS fundamentals, interface, and basic mapping operations",
      icon: Map,
      color: "bg-blue-500",
      duration: "2-3 weeks"
    },
    {
      step: 2,
      title: "PostGIS & Database Integration",
      description: "Move to spatial databases, PostGIS setup, and database integration",
      icon: Database,
      color: "bg-green-500",
      duration: "2-3 weeks"
    },
    {
      step: 3,
      title: "Web Mapping & APIs",
      description: "Then learn web mapping, APIs, and data publishing techniques",
      icon: Server,
      color: "bg-purple-500",
      duration: "3-4 weeks"
    },
    {
      step: 4,
      title: "Dashboard & Advanced Topics",
      description: "Finally master dashboards, advanced analysis, and cloud deployment",
      icon: Monitor,
      color: "bg-orange-500",
      duration: "4-6 weeks"
    }
  ];

  // Filter tutorials based on search term
  const filteredVideos = videoTutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredEbooks = ebooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSampleData = sampleData.filter(data =>
    data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header with Banner */}
        <div className="relative mb-16">
          <div className="bg-white/90 rounded-2xl p-12 text-center shadow-sm">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center shadow-amber">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
            <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-inter font-bold text-foreground">
                  Tools & Learning
                </h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              This section highlights the core tools and platforms powering the Anambra State Geospatial Health Project. Each tool plays a key role in collecting, managing, and analyzing spatial health data across the state. Explore tutorials, documentation, and learning resources to get started.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tutorials, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white border-2 border-primary/20 rounded-xl shadow-lg">
            <TabsTrigger value="videos" className="rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-[#ffa600] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffa600] hover:bg-[#ffa600]/80 hover:text-white border border-primary/10">
              🎥 Video Tutorials
            </TabsTrigger>
            <TabsTrigger value="ebooks" className="rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-[#ffa600] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffa600] hover:bg-[#ffa600]/80 hover:text-white border border-primary/10">
              📚 E-Books & Guides
            </TabsTrigger>
            <TabsTrigger value="tools" className="rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-[#ffa600] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffa600] hover:bg-[#ffa600]/80 hover:text-white border border-primary/10">
              🔧 Core Tools
            </TabsTrigger>
            <TabsTrigger value="datasets" className="rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-[#ffa600] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffa600] hover:bg-[#ffa600]/80 hover:text-white border border-primary/10">
              🧩 Sample Data & Tutorials
            </TabsTrigger>
            <TabsTrigger value="path" className="rounded-lg font-medium transition-all duration-300 data-[state=active]:bg-[#ffa600] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffa600] hover:bg-[#ffa600]/80 hover:text-white border border-primary/10">
              💡 Learning Path
            </TabsTrigger>
          </TabsList>

          {/* Video Tutorials Tab */}
          <TabsContent value="videos" className="space-y-8 mt-8 bg-white rounded-2xl p-8" id="videos">
            <section>
              <h2 className="text-3xl font-inter font-bold mb-6 flex items-center">
                <Video className="h-8 w-8 text-primary mr-3" />
                Video Tutorials
              </h2>
              
              {/* Featured Playlist Section */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-4 flex items-center">
                  <Layers className="mr-2 h-6 w-6 text-[#ffaa00]" />
                  Featured Playlist
                </h3>
                <div className="bg-gradient-to-r from-amber-50 to-white p-6 rounded-xl border border-amber-100">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <a href="https://youtu.be/rCnBpJ6h1fU?si=eoRRQpzpXSuPfjPp" target="_blank" rel="noopener noreferrer" className="block group">
                        <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                          <img 
                            src="https://img.youtube.com/vi/rCnBpJ6h1fU/maxresdefault.jpg" 
                            alt="QGIS & Geospatial Analysis Playlist"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 rounded-full p-3">
                              <Play className="h-6 w-6 text-[#ffaa00]" fill="currentColor" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            24 videos
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="md:w-2/3">
                      <h4 className="text-xl font-semibold mb-2">QGIS & Geospatial Analysis</h4>
                      <p className="text-muted-foreground mb-4">
                        A comprehensive collection of QGIS tutorials and geospatial analysis techniques. This playlist covers everything from basic GIS concepts to advanced spatial analysis methods.
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary">QGIS</Badge>
                        <Badge variant="secondary">Spatial Analysis</Badge>
                        <Badge variant="secondary">Data Visualization</Badge>
                        <Badge variant="secondary">Beginner to Advanced</Badge>
                      </div>
                      <Button asChild>
                        <a href="https://youtu.be/rCnBpJ6h1fU?si=eoRRQpzpXSuPfjPp" target="_blank" rel="noopener noreferrer">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Playlist on YouTube
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold mb-6 mt-12">Individual Tutorials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((tutorial, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
                    <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 rounded-full p-4 transform transition-transform group-hover:scale-110">
                            <Play className="h-8 w-8 text-[#ffaa00]" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg line-clamp-2">{tutorial.title}</h3>
                      </CardContent>
                    </a>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Core Tools Tab */}
          <TabsContent value="tools" className="space-y-8 mt-8 bg-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-inter font-bold mb-4">Core Geospatial Tools & Platforms</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Essential tools powering the Anambra State Geospatial Health Project for data collection, analysis, and visualization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{tool.name}</CardTitle>
                          <CardDescription className="text-primary font-medium">
                            {tool.category}
                          </CardDescription>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {tool.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-primary/5 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">Role in Project</h4>
                        <p className="text-sm text-muted-foreground">{tool.role}</p>
                      </div>

                      <div className="bg-accent/50 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">Example Use Case</h4>
                        <p className="text-sm text-muted-foreground">{tool.useCase}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Download Links</h4>
                        <div className="space-y-2">
                          {tool.downloadLinks.map((link, linkIndex) => (
                            <Button
                              key={linkIndex}
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                {link.title} ({link.platform})
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Learning Resources</h4>
                        <div className="space-y-2">
                          {tool.learningLinks.map((link, linkIndex) => (
                            <Button
                              key={linkIndex}
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {link.title}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          <TabsContent value="ebooks" className="space-y-8 mt-8 bg-white rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEbooks.map((book, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Book className="h-5 w-5 text-primary" />
                      <span>{book.title}</span>
                    </CardTitle>
                    <CardDescription>{book.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>{book.pages}</span>
                        <span>{book.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {book.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <a href={book.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Resource
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="datasets" className="space-y-8 mt-8 bg-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-inter font-bold mb-4">Sample Data & Hands-on Tutorials</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download sample datasets and follow hands-on tutorials to practice your geospatial analysis skills with real data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSampleData.map((dataset, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileCode className="h-5 w-5 text-primary" />
                      <span>{dataset.title}</span>
                    </CardTitle>
                    <CardDescription>{dataset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Format:</span>
                        <span>{dataset.format}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{dataset.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Features:</span>
                        <span>{dataset.features}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {dataset.topics.map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Button asChild className="w-full">
                      <a href={dataset.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download / Access
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Path Tab */}
          <TabsContent value="path" className="space-y-8 mt-8 bg-white rounded-2xl p-8">
            <div className="space-y-8">
              {[
                {
                  title: 'Getting Started',
                  description: 'Learn the basics of geospatial analysis',
                  icon: Map,
                  color: 'bg-blue-100 text-blue-600',
                  steps: 3
                },
                {
                  title: 'Intermediate Skills',
                  description: 'Advance your geospatial analysis techniques',
                  icon: Layers,
                  color: 'bg-purple-100 text-purple-600',
                  steps: 4
                },
                {
                  title: 'Advanced Applications',
                  description: 'Master complex geospatial workflows',
                  icon: BarChart3,
                  color: 'bg-green-100 text-green-600',
                  steps: 3
                }
              ].map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="text-muted-foreground mb-2">{step.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>{step.steps} steps</span>
                          <span className="mx-2">•</span>
                          <Button variant="link" className="p-0 h-auto text-blue-600">
                            Start Learning
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default LearningPage;