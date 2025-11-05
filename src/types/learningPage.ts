import { VideoTutorial, Ebook, SampleData, Tool, LearningResource } from './learning';

export interface VideoTutorialWithBookmark extends VideoTutorial {
  isBookmarked: boolean;
}

export interface EbookWithBookmark extends Ebook {
  isBookmarked: boolean;
}

export interface SampleDataWithBookmark extends SampleData {
  isBookmarked: boolean;
}

export interface ToolWithBookmark extends Tool {
  isBookmarked: boolean;
}

export type ResourceType = VideoTutorialWithBookmark | EbookWithBookmark | SampleDataWithBookmark | ToolWithBookmark;

export type ResourceCategory = 'videos' | 'ebooks' | 'tools' | 'datasets';

export interface TabConfig {
  id: string;
  label: string;
  value: ResourceCategory;
  icon: React.ReactNode;
}
