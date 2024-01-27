import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { Quiz } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-practice-quiz-controls',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @Input({ required: true }) quiz: Quiz;
  @Input({ required: true }) isPlayMode$: BehaviorSubject<boolean>;
  @Input({ required: true }) isQuizShuffled$: BehaviorSubject<boolean>;
  @Input({ required: true }) questionsLimit$: BehaviorSubject<number>;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  dialogRef: MatDialogRef<TemplateRef<any>>;

  removeQuizSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.removeQuizSuccess$ = this.practiceFacade.removeQuizSuccess$;

    this.navigateAfterRemove();
  }

  openPlayDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent, { autoFocus: false });
    this.dialogRef.afterClosed().subscribe(() => {
      this.isQuizShuffled$.next(false);
      this.questionsLimit$.next(0);
    });
  }

  turnPlayMode(): void {
    this.isPlayMode$.next(true);
    this.dialogRef.close();
  }

  openRemoveQuizDialog(): void {
    this.removePracticeQuizDialogService.openDialog(this.quiz);
  }

  getQuestionLimits(): number[] {
    const totalQuestions: number = this.quiz.items.length;
    const predefinedOptions: number[] = [5, 10, 15, 25, 40, 50];

    const combinedOptions: number[] = Array.from(
      new Set([...predefinedOptions, totalQuestions])
    );

    const validOptions: number[] = combinedOptions.filter(
      (option) => option <= totalQuestions
    );

    validOptions.sort((a, b) => a - b);

    return validOptions;
  }

  setShuffleQuestions(value: boolean): void {
    this.isQuizShuffled$.next(value);
  }

  setQuestionLimit(value: number): void {
    this.questionsLimit$.next(value);
  }

  private navigateAfterRemove(): void {
    this.removeQuizSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            this.router.navigate([this.router.url.replace(this.quiz.slug, '')]);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
