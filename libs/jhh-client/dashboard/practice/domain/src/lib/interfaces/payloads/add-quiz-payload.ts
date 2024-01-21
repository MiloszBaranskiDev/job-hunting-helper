import { QuizItem } from '@jhh/shared/interfaces';

export interface AddQuizPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  items: QuizItem[];
}
