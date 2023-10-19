import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';

import { QueryParamsService } from '../../services/query-params/query-params.service';

import { NotesListSort } from '@jhh/jhh-client/dashboard/notes/enums';

@Component({
  selector: 'jhh-notes-sorting',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
})
export class SortingComponent implements OnInit {
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  readonly notesListSort: NotesListSort[] = Object.values(NotesListSort);

  currentSort$: Observable<NotesListSort>;

  ngOnInit(): void {
    this.currentSort$ = this.queryParamsService.getCurrentSort$();
  }

  handleSortChange(newSort: NotesListSort): void {
    if (this.notesListSort.includes(newSort)) {
      this.queryParamsService.updateCurrentSort(newSort);
    }
  }
}
