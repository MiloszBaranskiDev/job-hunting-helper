import addQuiz from './add-quiz';
import removeQuiz from './remove-quiz';
import addQuizResults from './add-quiz-results';

export function JhhServerControllerPractice() {
  return {
    addQuiz,
    removeQuiz,
    addQuizResults,
  };
}
