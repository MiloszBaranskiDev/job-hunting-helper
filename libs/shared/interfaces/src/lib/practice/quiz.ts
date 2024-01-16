import { QuizItem } from './quiz-item';

export interface Quiz {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  items: QuizItem[];
}
