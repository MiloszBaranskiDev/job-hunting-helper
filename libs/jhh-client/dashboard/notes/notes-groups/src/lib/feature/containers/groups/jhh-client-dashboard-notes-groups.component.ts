import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable } from 'rxjs';

import { GroupsListComponent } from '../../components/groups-list/groups-list.component';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { SortingComponent } from '../../components/sorting/sorting.component';
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
  ],
  templateUrl: './jhh-client-dashboard-notes-groups.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-groups.component.scss'],
})
export class JhhClientDashboardNotesGroupsComponent
  implements OnInit, OnDestroy
{
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  notesGroups$: Observable<NotesGroup[]>;
  sortedNotesGroups$: Observable<NotesGroup[]>;
  notesGroupsSort$: Observable<NotesGroupsSort>;

  ngOnInit(): void {
    this.notesGroups$ = this.notesFacade.notesGroups$;

    this.queryParamsService.setFromCurrentRoute();
    this.queryParamsService.updateQueryParams();
    this.notesGroupsSort$ = this.queryParamsService.getCurrentSort$();

    this.sortedNotesGroups$ = combineLatest([
      this.notesGroups$,
      this.notesGroupsSort$,
    ]).pipe(
      map(([groups, sort]) => {
        return this.sortGroups(groups, sort);
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
