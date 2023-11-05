import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';
import { NotesGroup } from '@jhh/shared/interfaces';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { RemoveNotesGroupModalService } from '@jhh/jhh-client/dashboard/notes/remove-group';
import { EditNotesGroupModalService } from '@jhh/jhh-client/dashboard/notes/edit-group';

@Component({
  selector: 'jhh-notes-groups-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editNotesGroupModalService: EditNotesGroupModalService =
    inject(EditNotesGroupModalService);
  private readonly removeNotesGroupModalService: RemoveNotesGroupModalService =
    inject(RemoveNotesGroupModalService);

  @Input() notesGroups$: Observable<NotesGroup[]>;

  breakpoint$: Observable<string>;

  readonly clientRoute: typeof ClientRoute = ClientRoute;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  openEditNotesGroupModal(group: NotesGroup): void {
    this.editNotesGroupModalService.openModal(group);
  }

  openRemoveNotesGroupModal(group: NotesGroup): void {
    this.removeNotesGroupModalService.openModal(group);
  }
}
