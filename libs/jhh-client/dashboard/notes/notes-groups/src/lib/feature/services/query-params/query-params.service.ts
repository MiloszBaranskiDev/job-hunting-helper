import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';

import { NotesGroupsSort } from '../../enums/notes-groups-sort';

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly location: Location = inject(Location);

  private defaultPage: number = 1;
  private defaultSort: NotesGroupsSort = NotesGroupsSort.Latest;

  private currentPage$: BehaviorSubject<number> = new BehaviorSubject<number>(
    this.defaultPage
  );
  private currentSort$: BehaviorSubject<NotesGroupsSort> =
    new BehaviorSubject<NotesGroupsSort>(this.defaultSort);

  getCurrentPage$(): BehaviorSubject<number> {
    return this.currentPage$;
  }

  getCurrentSort$(): BehaviorSubject<NotesGroupsSort> {
    return this.currentSort$;
  }

  updateCurrentPage(newPage: number): void {
    this.currentPage$.next(newPage);
    this.updateQueryParams();
    window.scrollTo(0, 0);
  }

  updateCurrentSort(newSort: NotesGroupsSort): void {
    this.currentSort$.next(newSort);
    this.currentPage$.next(1);
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const urlWithoutParams: string = this.router.url.split('?')[0];
    const newUrl: string = `${urlWithoutParams}?page=${this.currentPage$.getValue()}&sort=${this.currentSort$.getValue()}`;
    this.location.replaceState(newUrl);
  }

  clearQueryParams(): void {
    this.currentPage$.next(this.defaultPage);
    this.currentSort$.next(this.defaultSort);
  }

  setFromCurrentRoute(): void {
    this.currentPage$.next(this.currentPageFromRoute());
    this.currentSort$.next(this.currentSortFromRoute());
  }

  private currentPageFromRoute(): number {
    return Number(this.route.snapshot.queryParamMap.get('page')) || 1;
  }

  private currentSortFromRoute(): NotesGroupsSort {
    return (
      (this.route.snapshot.queryParamMap.get('sort') as NotesGroupsSort) ||
      NotesGroupsSort.Latest
    );
  }
}
