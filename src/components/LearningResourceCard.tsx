import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Book,
  Wrench,
  Database,
  FileText,
  ExternalLink,
  Clock,
  Star,
  Download,
  Users,
  BookOpen
} from "lucide-react";
import { LearningResource } from "@/types/learning";

interface LearningResourceCardProps {
  resource: LearningResource;
}

const LearningResourceCard = ({ resource }: LearningResourceCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'ebook':
        return <Book className="h-5 w-5" />;
      case 'tool':
        return <Wrench className="h-5 w-5" />;
      case 'sample-data':
        return <Database className="h-5 w-5" />;
      case 'documentation':
        return <FileText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'ebook':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tool':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sample-data':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'documentation':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'All Levels':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#ffaa00] hover:border-l-[#e69900]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#ffaa00]/10 rounded-lg flex items-center justify-center">
              {getTypeIcon(resource.type)}
            </div>
            <Badge variant="outline" className={getTypeColor(resource.type)}>
              {resource.type}
            </Badge>
          </div>
          <Badge variant="outline" className={getLevelColor(resource.level)}>
            {resource.level}
          </Badge>
        </div>

        <CardTitle className="text-lg group-hover:text-[#ffaa00] transition-colors">
          {resource.title}
        </CardTitle>

        <CardDescription className="text-sm">
          {resource.category} • {resource.description.length > 100
            ? `${resource.description.substring(0, 100)}...`
            : resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Resource-specific metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          {resource.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{resource.duration}</span>
            </div>
          )}
          {resource.pages && (
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>{resource.pages} pages</span>
            </div>
          )}
          {resource.size && (
            <div className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>{resource.size}</span>
            </div>
          )}
        </div>

        {/* Rating and views for videos */}
        {resource.rating && resource.views && (
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{resource.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{resource.views} views</span>
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.topics.slice(0, 3).map((topic, topicIndex) => (
            <Badge key={topicIndex} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
          {resource.topics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.topics.length - 3} more
            </Badge>
          )}
        </div>

        {/* Features for tools and sample data */}
        {resource.features && (
          <div className="bg-[#ffaa00]/5 rounded-lg p-3 mb-4">
            <div className="text-xs font-medium text-[#ffaa00] mb-1">Features:</div>
            <div className="text-xs text-muted-foreground">{resource.features}</div>
          </div>
        )}

        <Button asChild className="w-full bg-[#ffaa00] hover:bg-[#e69900] text-white group-hover:shadow-md transition-all duration-300">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            {resource.type === 'video' && <Play className="mr-2 h-4 w-4" />}
            {resource.type === 'ebook' && <Book className="mr-2 h-4 w-4" />}
            {resource.type === 'tool' && <Download className="mr-2 h-4 w-4" />}
            {resource.type === 'sample-data' && <Database className="mr-2 h-4 w-4" />}
            {resource.type === 'documentation' && <ExternalLink className="mr-2 h-4 w-4" />}
            {resource.format ? `Open ${resource.format}` : 'Access Resource'}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default LearningResourceCard;
