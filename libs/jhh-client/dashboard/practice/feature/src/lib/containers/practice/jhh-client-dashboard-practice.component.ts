import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { PracticeFacade } from '@jhh/jhh-client/dashboard/practice/data-access';

import { QuizzesListComponent } from '../../components/quizzes-list/quizzes-list.component';

import { Quiz } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-practice',
  standalone: true,
  imports: [CommonModule, QuizzesListComponent],
  templateUrl: './jhh-client-dashboard-practice.component.html',
  styleUrls: ['./jhh-client-dashboard-practice.component.scss'],
})
export class JhhClientDashboardPracticeComponent implements OnInit {
  private readonly practiceFacade: PracticeFacade = inject(PracticeFacade);

  quizzes$: Observable<Quiz[]>;

  ngOnInit(): void {
    this.quizzes$ = this.practiceFacade.quizzes$;
  }
}
