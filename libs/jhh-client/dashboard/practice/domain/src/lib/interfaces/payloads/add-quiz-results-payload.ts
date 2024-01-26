import { QuizResult } from '@jhh/shared/interfaces';

export interface AddQuizResultsPayload {
  quizId: string;
  items: QuizResult[];
  totalScore: number;
  percentage: number;
}
