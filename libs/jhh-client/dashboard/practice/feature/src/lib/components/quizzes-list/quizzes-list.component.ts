import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { Quiz } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-practice-quizzes-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quizzes-list.component.html',
  styleUrls: ['./quizzes-list.component.scss'],
})
export class QuizzesListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);

  @Input({ required: true }) quizzes: Quiz[];

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }
}
