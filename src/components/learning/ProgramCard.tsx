import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Award } from "lucide-react";

interface ProgramCardProps {
  program: {
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

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img 
          src={program.image} 
          alt={program.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 brightness-90"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs">
            {program.level}
          </Badge>
          <span className="text-sm text-gray-500">{program.format}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{program.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <span>Self-paced learning</span>
          </div>
          {program.certificate && (
            <div className="flex items-center text-sm text-amber-600">
              <Award className="w-4 h-4 mr-2" />
              <span>Certificate of Completion</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">{program.cost === 'Free' ? 'Free' : `$${program.cost}`}</span>
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
