import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { NotesGroup } from '@jhh/shared/domain';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { RemoveNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-remove-group';
import { EditNotesGroupDialogService } from '@jhh/jhh-client/dashboard/notes/feature-edit-group';

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
  private readonly editNotesGroupDialogService: EditNotesGroupDialogService =
    inject(EditNotesGroupDialogService);
  private readonly removeNotesGroupDialogService: RemoveNotesGroupDialogService =
    inject(RemoveNotesGroupDialogService);

  @Input() sortedNotesGroups: NotesGroup[] | null;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }

  trackByFn(index: number, item: NotesGroup): string {
    return item.id;
  }

  openEditNotesGroupDialog(group: NotesGroup): void {
    this.editNotesGroupDialogService.openDialog(group);
  }

  openRemoveNotesGroupDialog(group: NotesGroup): void {
    this.removeNotesGroupDialogService.openDialog(group);
  }
}
