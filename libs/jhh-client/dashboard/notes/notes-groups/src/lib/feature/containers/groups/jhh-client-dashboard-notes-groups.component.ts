import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, tap } from 'rxjs';

import { GroupsListComponent } from '../../components/groups-list/groups-list.component';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { SortingComponent } from '../../components/sorting/sorting.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/remove-group';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/edit-group';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { QueryParamsService } from '../../services/query-params/query-params.service';

import { NotesGroup } from '@jhh/shared/interfaces';
import { NotesGroupsSort } from '../../enums/notes-groups-sort';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    GroupsListComponent,
    AddGroupComponent,
    SortingComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
    PaginationComponent,
    SearchBarComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-groups.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-groups.component.scss'],
})
export class JhhClientDashboardNotesGroupsComponent
  implements OnInit, OnDestroy
{
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  notesGroups$: Observable<NotesGroup[]>;
  sortedNotesGroups$: Observable<NotesGroup[]>;

  readonly groupsPerPage: number = 16;
  totalPages: number;

  ngOnInit(): void {
    this.notesGroups$ = this.notesFacade.notesGroups$;
    this.queryParamsService.setFromCurrentRoute();

    this.queryParamsService.updateQueryParams();

    this.sortedNotesGroups$ = combineLatest([
      this.notesGroups$,
      this.queryParamsService.getCurrentSort$(),
      this.queryParamsService.getCurrentPage$(),
    ]).pipe(
      tap(([groups]) => {
        this.totalPages = Math.ceil(groups.length / this.groupsPerPage);
        this.cdr.detectChanges();
      }),
      map(([groups, sort, currentPage]) => {
        const sortedGroups: NotesGroup[] = this.sortGroups(groups, sort);
        const start: number = (currentPage - 1) * this.groupsPerPage;
        const end: number = start + this.groupsPerPage;
        return sortedGroups.slice(start, end);
      })
    );
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  private sortGroups(
    groups: NotesGroup[],
    sort: NotesGroupsSort
  ): NotesGroup[] {
    switch (sort) {
      case NotesGroupsSort.Latest:
        return groups
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      case NotesGroupsSort.LastEdited:
        return groups
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      case NotesGroupsSort.AlphabeticalAsc:
        return groups.slice().sort((a, b) => a.name.localeCompare(b.name));
      case NotesGroupsSort.AlphabeticalDesc:
        return groups.slice().sort((a, b) => b.name.localeCompare(a.name));
      case NotesGroupsSort.NumberOfNotesAsc:
        return groups.slice().sort((a, b) => a.notes.length - b.notes.length);
      case NotesGroupsSort.NumberOfNotesDesc:
        return groups.slice().sort((a, b) => b.notes.length - a.notes.length);
      default:
        return groups;
    }
  }
}
