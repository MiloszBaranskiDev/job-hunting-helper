import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { NotesListSort } from '@jhh/jhh-client/dashboard/notes/enums';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private readonly DEFAULT_PAGE: number =
    Number(this.route.snapshot.queryParamMap.get('page')) || 1;
  private readonly DEFAULT_SORT: NotesListSort =
    (this.route.snapshot.queryParamMap.get('sort') as NotesListSort) ||
    NotesListSort.Latest;

  private currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.DEFAULT_PAGE
  );
  private currentSort$: BehaviorSubject<NotesListSort> =
    new BehaviorSubject<NotesListSort>(this.DEFAULT_SORT);

  getCurrentPage$(): BehaviorSubject<number> {
    return this.currentPage$;
  }

  getCurrentSort$(): BehaviorSubject<NotesListSort> {
    return this.currentSort$;
  }

  updateCurrentPage(newPage: number): void {
    this.currentPage$.next(newPage);
    this.updateQueryParams();
  }

  updateCurrentSort(newSort: NotesListSort): void {
    this.currentSort$.next(newSort);
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage$.getValue(),
        sort: this.currentSort$.getValue(),
      },
      queryParamsHandling: 'merge',
    });
  }

  clearQueryParams(): void {
    this.currentPage$.next(this.DEFAULT_PAGE);
    this.currentSort$.next(this.DEFAULT_SORT);
  }
}
