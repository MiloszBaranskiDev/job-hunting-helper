import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, filter, map, Observable, tap } from 'rxjs';

import { GroupsListComponent } from '../../components/groups-list/groups-list.component';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/remove-group';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/edit-group';
import { JhhClientDashboardSearchbarComponent } from '@jhh/jhh-client/dashboard/feature-searchbar';
import { JhhClientDashboardNotesSortingComponent } from '@jhh/jhh-client/dashboard/notes/feature-sorting';
import { JhhClientDashboardNotesPaginationComponent } from '@jhh/jhh-client/dashboard/notes/feature-pagination';

import {
  NotesFacade,
  QueryParamsService,
} from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroup } from '@jhh/shared/interfaces';
import { NotesGroupsSort } from '../../enums/notes-groups-sort';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    GroupsListComponent,
    AddGroupComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
    JhhClientDashboardSearchbarComponent,
    JhhClientDashboardNotesSortingComponent,
    JhhClientDashboardNotesPaginationComponent,
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

  notesGroups$: Observable<NotesGroup[] | null>;
  sortedNotesGroups$: Observable<NotesGroup[] | null>;

  readonly sortOptionsValues: string[] = Object.values(NotesGroupsSort);
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
      filter((groups) => !!groups),
      tap(([groups]) => {
        this.totalPages = Math.ceil(groups!.length / this.groupsPerPage);
        this.cdr.detectChanges();
      }),
      map(([groups]) => {
        const currentPage: number = this.queryParamsService
          .getCurrentPage$()
          .getValue();
        const currentSort: string = this.queryParamsService
          .getCurrentSort$()
          .getValue();
        const sortedGroups: NotesGroup[] = this.sortGroups(
          groups!,
          currentSort as NotesGroupsSort
        );
        const start: number = (currentPage - 1) * this.groupsPerPage;
        const end: number = start + this.groupsPerPage;
        return sortedGroups.slice(start, end);
      })
    );
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  searchGroups = (query: string): Observable<NotesGroup[] | null> => {
    return this.notesFacade.searchNotesGroups$ByName(query);
  };

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
      case NotesGroupsSort.AmountOfNotesAsc:
        return groups.slice().sort((a, b) => a.notes.length - b.notes.length);
      case NotesGroupsSort.AmountOfNotesDesc:
        return groups.slice().sort((a, b) => b.notes.length - a.notes.length);
      default:
        return groups;
    }
  }
}
