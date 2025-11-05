import { BookOpen, GraduationCap, Download } from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-amber-500" />,
    title: "Our Training Approach",
    description: "Hands-on, practical training focused on real-world applications in Anambra State.",
    link: "/about/training"
  },
  {
    icon: <BookOpen className="w-10 h-10 text-amber-500" />,
    title: "Learning Guide",
    description: "Step-by-step guidance to navigate our learning resources and training programs.",
    link: "/learning/guide"
  },
  {
    icon: <Download className="w-10 h-10 text-amber-500" />,
    title: "Datasets & Downloads",
    description: "Access geospatial datasets and resources for Anambra State.",
    link: "/resources/datasets"
  }
];

export default function FeatureTiles() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <a 
                href={feature.link} 
                className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
              >
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
