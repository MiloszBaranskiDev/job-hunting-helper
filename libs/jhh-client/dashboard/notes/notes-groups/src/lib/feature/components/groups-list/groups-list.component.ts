import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { NotesGroup } from '@jhh/shared/interfaces';

import { OrderByPipe } from '@jhh/jhh-client/shared/pipes';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

@Component({
  selector: 'jhh-notes-groups-list',
  standalone: true,
  imports: [CommonModule, OrderByPipe],
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);

  @Input() notesGroups$: Observable<NotesGroup[]>;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }
}
