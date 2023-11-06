import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NotesGroupsSort } from '../../enums/notes-groups-sort';

import { QueryParamsService } from '../../services/query-params/query-params.service';

@Component({
  selector: 'jhh-notes-groups-sorting',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
})
export class SortingComponent implements OnInit {
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  readonly notesGroupsSort: NotesGroupsSort[] = Object.values(NotesGroupsSort);

  currentSort$: Observable<NotesGroupsSort>;

  ngOnInit(): void {
    this.currentSort$ = this.queryParamsService.getCurrentSort$();
  }

  handleSortChange(newSort: NotesGroupsSort): void {
    if (this.notesGroupsSort.includes(newSort)) {
      this.queryParamsService.updateCurrentSort(newSort);
    }
  }
}
