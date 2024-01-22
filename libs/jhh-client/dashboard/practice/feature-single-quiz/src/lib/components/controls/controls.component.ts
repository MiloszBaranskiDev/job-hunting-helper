import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { RemovePracticeQuizDialogService } from '@jhh/jhh-client/dashboard/practice/feature-remove-quiz';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { Quiz } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-practice-quiz-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly removePracticeQuizDialogService: RemovePracticeQuizDialogService =
    inject(RemovePracticeQuizDialogService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  @Input({ required: true }) quiz: Quiz;
  @Input({ required: true }) isPlayMode$: BehaviorSubject<boolean>;

  removeQuizSuccess$: Observable<boolean>;

  ngOnInit(): void {
    this.removeQuizSuccess$ = this.practiceFacade.removeQuizSuccess$;

    this.navigateAfterRemove();
  }

  turnPlayMode(): void {
    this.isPlayMode$.next(true);
  }

  openRemoveQuizDialog(): void {
    this.removePracticeQuizDialogService.openDialog(this.quiz);
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
