import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { QueryParamsService } from '../../services/query-params/query-params.service';

@Component({
  selector: 'jhh-notes-groups-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  @Input() totalPages: number;

  currentPage$: BehaviorSubject<number>;

  ngOnInit(): void {
    this.currentPage$ = this.queryParamsService.getCurrentPage$();
  }

  get currentPage(): number {
    return this.currentPage$.getValue();
  }

  set currentPage(value: number) {
    if (value >= 1 && value <= this.totalPages) {
      this.queryParamsService.updateCurrentPage(value);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.queryParamsService.updateCurrentPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.queryParamsService.updateCurrentPage(this.currentPage + 1);
    }
  }

  validateAndSetPage(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    const pageNumber: number = Number(value);
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.queryParamsService.updateCurrentPage(pageNumber);
    }
  }
}
