import React from 'react';
import { BookOpen, Video, Database, Map, FileText, ClipboardCheck, Users, Award, Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CourseOutline = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Course Introduction */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          <BookOpen className="inline-block w-8 h-8 mr-2 text-amber-600" />
          Geospatial Health Data Analysis with QGIS & PostGIS for Anambra State
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-l-4 border-amber-500">
            <CardHeader>
              <CardTitle>Why This Course Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                In Anambra State, where healthcare accessibility varies across regions, geospatial analysis is crucial for:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Identifying healthcare deserts and underserved communities</li>
                <li>Optimizing resource allocation for better healthcare delivery</li>
                <li>Tracking disease outbreaks and planning interventions</li>
                <li>Supporting evidence-based decision making in public health</li>
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-800">Public Health Professionals</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800">GIS Specialists</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800">Healthcare Administrators</Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800">Students & Researchers</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <div className="flex items-start">
                  <Map className="w-4 h-4 mt-1 mr-2 text-amber-600 flex-shrink-0" />
                  <span>QGIS Fundamentals</span>
                </div>
                <div className="flex items-start">
                  <Database className="w-4 h-4 mt-1 mr-2 text-amber-600 flex-shrink-0" />
                  <span>PostGIS Setup & Queries</span>
                </div>
                <div className="flex items-start">
                  <FileText className="w-4 h-4 mt-1 mr-2 text-amber-600 flex-shrink-0" />
                  <span>Health Data Analysis</span>
                </div>
                <div className="flex items-start">
                  <ClipboardCheck className="w-4 h-4 mt-1 mr-2 text-amber-600 flex-shrink-0" />
                  <span>Spatial Analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-amber-600" />
          Course Modules
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium text-amber-600">Module {index + 1}</span>
                    <CardTitle className="text-xl mt-1">{module.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    {module.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-2 text-gray-800">Learning Objectives:</h4>
                <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
                  {module.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
                
                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <Video className="w-4 h-4 mr-1 text-amber-600" />
                  <span className="mr-4">{module.videos} videos</span>
                  
                  <ClipboardCheck className="w-4 h-4 mr-1 text-amber-600" />
                  <span>{module.exercises} exercises</span>
                </div>
                
                <Button variant="outline" size="sm" className="mt-4 w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                  View Module
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-2 text-amber-600" />
          Required Tools & Software
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="flex flex-col h-full">
              <div className="p-6 pb-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </div>
              <div className="p-6 pt-4 mt-auto">
                <a 
                  href={tool.downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-amber-700 hover:underline"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download {tool.name}
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Join our community of geospatial health professionals and start transforming public health in Anambra State today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-amber-600 hover:bg-amber-700">
            Enroll Now
          </Button>
          <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
            Explore Free Resources
          </Button>
        </div>
      </section>
    </div>
  );
};

// Mock data for modules
const modules = [
  {
    title: "Introduction to Geospatial Health Data",
    duration: "2 weeks",
    objectives: [
      "Understand the role of GIS in public health",
      "Navigate QGIS interface and basic tools",
      "Source and import health data for Anambra State"
    ],
    videos: 5,
    exercises: 3
  },
  {
    title: "QGIS Fundamentals for Health Mapping",
    duration: "3 weeks",
    objectives: [
      "Create and style health facility maps",
      "Perform basic spatial analysis",
      "Generate thematic maps for health indicators"
    ],
    videos: 7,
    exercises: 4
  },
  {
    title: "Introduction to PostGIS",
    duration: "2 weeks",
    objectives: [
      "Install and configure PostgreSQL with PostGIS",
      "Import/export spatial data",
      "Perform basic spatial queries"
    ],
    videos: 4,
    exercises: 3
  },
  {
    title: "Spatial Analysis for Health Data",
    duration: "3 weeks",
    objectives: [
      "Conduct proximity analysis of health facilities",
      "Calculate service areas and coverage",
      "Perform hotspot analysis for disease outbreaks"
    ],
    videos: 6,
    exercises: 5
  },
  {
    title: "Advanced Visualization Techniques",
    duration: "2 weeks",
    objectives: [
      "Create interactive web maps",
      "Design effective data visualizations",
      "Produce publication-quality maps"
    ],
    videos: 5,
    exercises: 3
  },
  {
    title: "Capstone Project",
    duration: "4 weeks",
    objectives: [
      "Apply skills to a real-world health scenario",
      "Develop a complete spatial analysis workflow",
      "Present findings effectively"
    ],
    videos: 3,
    exercises: 1
  }
];

// Mock data for tools
const tools = [
  {
    name: "QGIS",
    description: "Free and open source Geographic Information System for viewing, editing, and analyzing geospatial data.",
    icon: <Map className="w-6 h-6 text-amber-600" />,
    downloadUrl: "https://qgis.org/en/site/"
  },
  {
    name: "PostgreSQL + PostGIS",
    description: "Advanced open source database with spatial extensions for storing and querying spatial data.",
    icon: <Database className="w-6 h-6 text-amber-600" />,
    downloadUrl: "https://postgis.net/install/"
  },
  {
    name: "Sample Datasets",
    description: "Curated collection of Anambra State health data and administrative boundaries to get you started.",
    icon: <Download className="w-6 h-6 text-amber-600" />,
    downloadUrl: "#datasets"
  }
];

export default CourseOutline;
