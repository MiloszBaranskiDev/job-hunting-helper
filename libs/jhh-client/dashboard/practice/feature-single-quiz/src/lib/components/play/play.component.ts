import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { GetPercentageClass } from '@jhh/jhh-client/dashboard/practice/util-get-percentage-class';

import { Quiz, QuizItem, QuizResult } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-practice-quiz-play',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent {
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @Input({ required: true }) quiz: Quiz;
  @Input({ required: true }) isPlayMode$: BehaviorSubject<boolean>;

  currentQuestionIndex: number = 0;
  selectedAnswers: Map<number, string[]> = new Map<number, string[]>();
  quizResults: QuizResult[];
  totalScore: number;
  percentage: number;

  get progressPercentage(): number {
    const totalQuestions: number = this.quiz.items.length;
    const answeredQuestions: number = Array.from(
      this.selectedAnswers.entries()
    ).filter(([index, answers]) => answers.length > 0).length;

    return (answeredQuestions / totalQuestions) * 100;
  }

  get allQuestionsAnswered(): boolean {
    return this.quiz.items.every(
      (_, index) =>
        this.selectedAnswers.has(index) &&
        this.selectedAnswers.get(index)!.length > 0
    );
  }

  get percentageClass(): string {
    return GetPercentageClass(this.percentage);
  }

  getMaxSelectableAnswers(questionIndex: number): number {
    const question: QuizItem = this.quiz.items[questionIndex];
    return question.answers.filter((answer) => answer.isCorrect).length;
  }

  onSelectAnswer(questionIndex: number, answerText: string): void {
    if (this.isMultipleChoice(questionIndex)) {
      const currentAnswers: string[] =
        this.selectedAnswers.get(questionIndex) || [];
      const answerIndex: number = currentAnswers.indexOf(answerText);
      if (answerIndex > -1) {
        currentAnswers.splice(answerIndex, 1);
      } else {
        currentAnswers.push(answerText);
      }
      this.selectedAnswers.set(questionIndex, [...currentAnswers]);
    } else {
      this.selectedAnswers.set(questionIndex, [answerText]);
    }
  }

  shouldDisableAnswer(questionIndex: number, answerText: string): boolean {
    const currentAnswers: string[] =
      this.selectedAnswers.get(questionIndex) || [];
    const maxSelectable: number = this.getMaxSelectableAnswers(questionIndex);

    return (
      currentAnswers.length >= maxSelectable &&
      !currentAnswers.includes(answerText)
    );
  }

  isMultipleChoice(questionIndex: number): boolean {
    const question: QuizItem = this.quiz.items[questionIndex];
    const correctAnswersCount: number = question.answers.filter(
      (answer) => answer.isCorrect
    ).length;

    return correctAnswersCount > 1;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quiz.items.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  goToQuestion(questionIndex: number): void {
    this.currentQuestionIndex = questionIndex;
  }

  playAgain(): void {
    this.currentQuestionIndex = 0;
    this.selectedAnswers.clear();
    this.quizResults = [];
  }

  quitQuiz(): void {
    this.isPlayMode$.next(false);
  }

  onSubmitQuiz(): void {
    this.quizResults = this.quiz.items.map((item, index) => {
      const userAnswers: string[] = this.selectedAnswers.get(index) || [];
      const correctAnswers: string[] = item.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.text);
      const isCorrect: boolean =
        userAnswers.sort().join(',') === correctAnswers.sort().join(',');

      return {
        question: item.question,
        userAnswers,
        correctAnswers,
        isCorrect,
      };
    });

    this.totalScore = this.quizResults.filter(
      (result) => result.isCorrect
    ).length;
    this.percentage = Number(
      ((this.totalScore / this.quiz.items.length) * 100).toFixed()
    );

    if (this.quizResults.length > 0) {
      this.practiceFacade.addQuizResults(
        this.quiz.id,
        this.quizResults,
        this.totalScore,
        this.percentage
      );
    }
  }
}
