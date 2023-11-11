import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlsComponent } from '../../components/controls/controls.component';

import { QueryParamsService } from '@jhh/jhh-client/dashboard/notes/data-access';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'jhh-notes-pagination',
  standalone: true,
  imports: [CommonModule, ControlsComponent],
  templateUrl: './jhh-client-dashboard-notes-pagination.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-pagination.component.scss'],
})
export class JhhClientDashboardNotesPaginationComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  @Input() totalPages: number;

  currentPage$: BehaviorSubject<number>;

  ngOnInit(): void {
    this.currentPage$ = this.queryParamsService.getCurrentPage$();

    this.currentPage$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((page) => {
          if (!this.isValidPage(page)) {
            this.queryParamsService.updateCurrentPage(
              this.queryParamsService.defaultPage
            );
          }
        })
      )
      .subscribe();
  }

  get currentPage(): number {
    return this.currentPage$.getValue();
  }

  handlePageChange(newPage: number): void {
    if (this.isValidPage(newPage)) {
      this.queryParamsService.updateCurrentPage(newPage);
    }
  }

  private isValidPage(page: number): boolean {
    return Number.isInteger(page) && page >= 1 && page <= this.totalPages;
  }
}
