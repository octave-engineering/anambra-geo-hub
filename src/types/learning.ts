export type Topic = string;

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'ebook' | 'tool' | 'sample-data' | 'documentation';
  category: string;
  topics: Topic[];
  url: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration?: string;
  pages?: string;
  size?: string;
  rating?: number;
  views?: string;
  thumbnail?: string;
  instructor?: string;
  features?: string;
  previewUrl?: string;
  downloadUrl?: string;
  downloads?: string;
  format?: string;
  role?: string;
  useCase?: string;
  downloadLinks?: Array<{
    title: string;
    url: string;
    platform?: string;
  }>;
  learningLinks?: Array<{
    title: string;
    url: string;
  }>;
}

export interface Tool extends Omit<LearningResource, 'type'> {
  type: 'tool';
  icon: string;
  docs: string;
  download: string;
  isFree: boolean;
  role: string;
  useCase: string;
  downloadLinks: Array<{
    title: string;
    url: string;
    platform?: string;
  }>;
  learningLinks: Array<{
    title: string;
    url: string;
  }>;
}

export interface VideoTutorial extends LearningResource {
  type: 'video';
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  views: string;
  rating: number;
  thumbnail: string;
  instructor: string;
  category: string;
}

export interface Ebook extends LearningResource {
  type: 'ebook';
  pages: string;
  size: string;
  previewUrl: string;
  downloadUrl: string;
}

export interface SampleData extends LearningResource {
  type: 'sample-data';
  size: string;
  format: string;
  downloads: string;
  previewUrl: string;
  downloadUrl: string;
}

export interface Documentation extends LearningResource {
  type: 'documentation';
  size: string;
  format: string;
  lastUpdated: string;
}
