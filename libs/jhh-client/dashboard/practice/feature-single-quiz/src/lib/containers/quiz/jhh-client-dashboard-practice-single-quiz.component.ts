import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, Observable, pluck, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { Quiz } from '@jhh/shared/interfaces';

import { QuestionsComponent } from '../../components/questions/questions.component';
import { DetailsComponent } from '../../components/details/details.component';
import { ControlsComponent } from '../../components/controls/controls.component';

@Component({
  selector: 'jhh-practice-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuestionsComponent,
    DetailsComponent,
    ControlsComponent,
  ],
  templateUrl: './jhh-client-dashboard-practice-single-quiz.component.html',
  styleUrls: ['./jhh-client-dashboard-practice-single-quiz.component.scss'],
})
export class JhhClientDashboardPracticeSingleQuizComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  quiz$: Observable<Quiz>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.quiz$ = this.route.params.pipe(
      pluck('quizSlug'),
      switchMap((slug: string) => this.practiceFacade.getQuiz$BySlug(slug)),
      filter((quiz): quiz is Quiz => !!quiz),
      tap((quiz) => {
        this.breadcrumbsService.updateBreadcrumbLabelByUrl(
          this.router.url.split('?')[0],
          quiz.name
        );
        this.titleService.setTitle(`Quiz - ${quiz.name}`);
      })
    );
  }
}
