import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { QueryParamsService } from '@jhh/jhh-client/dashboard/notes/data-access';
import { SelectComponent } from 'libs/jhh-client/dashboard/notes/feature-sorting/src/lib/components/select/select.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'jhh-notes-sorting',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './jhh-client-dashboard-notes-sorting.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-sorting.component.scss'],
})
export class JhhClientDashboardNotesSortingComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  @Input() sortOptionsValues: string[];

  currentSort$: Observable<string>;

  ngOnInit(): void {
    this.currentSort$ = this.queryParamsService.getCurrentSort$();

    this.currentSort$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((sort) => {
          if (!this.isValidSort(sort)) {
            this.queryParamsService.updateCurrentSort(
              this.queryParamsService.defaultSort
            );
          }
        })
      )
      .subscribe();
  }

  onSortChange(newSort: string): void {
    if (this.isValidSort(newSort)) {
      this.queryParamsService.updateCurrentSort(newSort);
    }
  }

  private isValidSort(sort: string): boolean {
    return this.sortOptionsValues.includes(sort);
  }
}
