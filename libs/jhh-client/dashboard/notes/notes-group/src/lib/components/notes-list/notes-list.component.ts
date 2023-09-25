import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Note } from '@jhh/shared/interfaces';

import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { OrderByPipe } from '@jhh/jhh-client/shared/pipes';

@Component({
  selector: 'jhh-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    OrderByPipe,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);

  @Input() notes$: Observable<Note[]>;

  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;
  }
}
