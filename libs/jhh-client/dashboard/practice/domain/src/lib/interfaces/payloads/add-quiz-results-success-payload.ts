import { QuizResults } from '@jhh/shared/interfaces';

export interface AddQuizResultsSuccessPayload {
  quizId: string;
  addedResults: QuizResults;
}
