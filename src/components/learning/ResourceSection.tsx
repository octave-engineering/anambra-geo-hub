import { Download, BookOpen, FileText } from "lucide-react";

const resources = [
  {
    id: 'r1',
    title: 'GIS Fundamentals Handbook',
    description: 'Comprehensive guide to GIS concepts and applications in Anambra State.',
    format: 'PDF',
    size: '4.2 MB',
    icon: <BookOpen className="w-6 h-6 text-amber-500" />
  },
  {
    id: 'r2',
    title: 'QGIS Quick Start Guide',
    description: 'Step-by-step instructions for getting started with QGIS.',
    format: 'PDF',
    size: '2.8 MB',
    icon: <FileText className="w-6 h-6 text-amber-500" />
  },
  {
    id: 'r3',
    title: 'Field Data Collection Manual',
    description: 'Best practices for collecting geospatial data in the field.',
    format: 'PDF',
    size: '3.5 MB',
    icon: <FileText className="w-6 h-6 text-amber-500" />
  },
  {
    id: 'r4',
    title: 'Anambra Health Facilities Data',
    description: 'Geospatial dataset of health facilities across Anambra State.',
    format: 'GeoJSON',
    size: '1.2 MB',
    icon: <Download className="w-6 h-6 text-amber-500" />
  }
];

export default function ResourceSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">E-Books & Guides</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Download our collection of guides, manuals, and resources for your learning journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <div 
              key={resource.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                  {resource.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {resource.format}
                  </span>
                  <span className="text-xs text-gray-500">{resource.size}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 px-6 py-3 bg-gray-50">
                <button className="w-full flex items-center justify-center text-sm font-medium text-amber-600 hover:text-amber-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="/resources" 
            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
          >
            View all resources
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
