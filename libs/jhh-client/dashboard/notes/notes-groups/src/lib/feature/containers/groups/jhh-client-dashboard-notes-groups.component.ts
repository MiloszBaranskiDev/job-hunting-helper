import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { GroupsListComponent } from '../../components/groups-list/groups-list.component';
import { AddGroupComponent } from '../../components/add-group/add-group.component';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/remove-group';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { NotesGroup } from '@jhh/shared/interfaces';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/edit-group';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    GroupsListComponent,
    AddGroupComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-groups.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-groups.component.scss'],
})
export class JhhClientDashboardNotesGroupsComponent implements OnInit {
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  notesGroups$: Observable<NotesGroup[]>;

  ngOnInit(): void {
    this.notesGroups$ = this.notesFacade.notesGroups$;
  }
}
