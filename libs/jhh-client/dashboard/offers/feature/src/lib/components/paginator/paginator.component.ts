import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

import { QueryParamsService } from '../../services/query-params/query-params.service';

@Component({
  selector: 'jhh-offers-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements AfterViewInit {
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);

  @Input({ required: true }) paginatorPage: number;
  @Input({ required: true }) paginatorSize: number;
  @Input({ required: true }) offersPerPageValues: number[];
  @Output() paginatorReady: EventEmitter<MatPaginator> =
    new EventEmitter<MatPaginator>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit(): void {
    this.paginatorReady.emit(this.paginator);
  }

  getPaginator(): MatPaginator {
    return this.paginator;
  }

  handlePaginator(event: PageEvent): void {
    if (this.paginatorPage !== undefined && this.paginatorSize !== undefined) {
      if (event.pageIndex !== event.previousPageIndex) {
        this.queryParamsService.updateCurrentPage(event.pageIndex + 1);
      }

      if (event.pageSize !== this.paginatorSize) {
        this.queryParamsService.updateCurrentPerPage(event.pageSize);
      }
    }
  }
}
