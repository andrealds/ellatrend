// Interface para um story individual
export interface Story {
  id: string;
  title: string;
  content: string;
  image: string;
  type: 'beauty-tip' | 'makeup-tip' | 'food-tip' | 'wellness' | 'recipe' | 'motivation' | 'tutorial' | 'fashion-tip';
  category: string;
  duration?: string;
}

// Interface para uma categoria de stories
export interface StoryCategory {
  id: number;
  category: string;
  title: string;
  stories: Story[];
  color: string;
  backgroundImage: string;
}

// Interface para o arquivo JSON de stories
export interface StoriesData {
  stories: Story[];
}

// Interface para resposta do hook useStaticData
export interface StoriesResponse {
  stories: Story[];
}
