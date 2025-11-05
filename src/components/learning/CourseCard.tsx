import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, BookOpen, CheckCircle } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    format: string;
    certificate: boolean;
    cost: string;
    image: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 brightness-90"
        />
        <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-amber-600" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
          <span className="text-xs text-gray-500">{course.duration}</span>
        </div>
        
        <h3 className="font-semibold text-base mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{course.format}</span>
          </div>
          
          <div className="flex items-center">
            {course.certificate && (
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            )}
            <span className="text-xs font-medium">
              {course.cost === 'Free' ? 'Free' : `$${course.cost}`}
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
}
