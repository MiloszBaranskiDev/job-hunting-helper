import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  MatSort,
  MatSortModule,
  Sort,
  SortDirection,
} from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from '../menu/menu.component';

import { Offer } from '@jhh/shared/interfaces';
import { OfferPriority, OfferStatus } from '@jhh/shared/enums';
import { OffersPerPage } from '@jhh/jhh-client/dashboard/offers/domain';

import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { QueryParamsService } from '../../services/query-params/query-params.service';
import { FormatOfferSalaryPipe } from '@jhh/jhh-client/dashboard/offers/util-format-offer-salary';

@Component({
  selector: 'jhh-offers-table',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MenuComponent,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    RouterLink,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    FormatOfferSalaryPipe,
  ],
  providers: [CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  @Input({ required: true }) offers: Offer[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  removeOffersInProgress$: Observable<boolean>;
  removeOffersSuccess$: Observable<boolean>;

  dataSource: MatTableDataSource<Offer>;
  selection: SelectionModel<Offer> = new SelectionModel<Offer>(true, []);

  filterValue: string;
  paginatorPage: number;
  paginatorSize: number;

  readonly offerStatus: typeof OfferStatus = OfferStatus;
  readonly offersPerPageValues: number[] = Object.values(OffersPerPage).filter(
    (value): value is number => typeof value === 'number'
  );
  readonly displayedColumns: string[] = [
    'select',
    'position',
    'company',
    'location',
    'salary',
    'status',
    'priority',
    'actions',
  ];
  readonly priorityMapping: { [key: string]: number } = {
    [OfferPriority.High]: 3,
    [OfferPriority.Medium]: 2,
    [OfferPriority.Low]: 1,
  };
  readonly statusMapping: { [key: string]: number } = {
    [OfferStatus.Rejected]: 6,
    [OfferStatus.Accepted]: 5,
    [OfferStatus.OfferReceived]: 4,
    [OfferStatus.Interviewing]: 3,
    [OfferStatus.Applied]: 2,
    [OfferStatus.NotApplied]: 1,
  };

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.offers);
    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;

    this.queryParamsService.setFromCurrentRoute();
    this.queryParamsService.updateQueryParams();

    this.handleRemoveSuccess();
  }

  ngAfterViewInit(): void {
    this.useQueryParams();
    this.updateTableSettings();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.dataSource = new MatTableDataSource(this.offers);
      this.updateTableSettings();

      if (this.paginator) {
        const totalItems: number = this.dataSource.data.length;
        if (
          this.paginatorPage * this.paginatorSize >= totalItems &&
          this.paginatorPage > 0
        ) {
          this.paginator.previousPage();
          this.paginatorPage =
            this.paginatorPage > 1
              ? this.paginatorPage - 1
              : this.paginatorPage;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  applyFilter(event: Event | string): void {
    const filterValue: string =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.queryParamsService.updateCurrentFilter(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  areAllSelected(): boolean {
    const startIndex: number = this.paginatorPage * this.paginatorSize;
    const endIndex: number = startIndex + this.paginatorSize;
    const currentPageData: Offer[] = this.dataSource.data.slice(
      startIndex,
      endIndex
    );

    const numSelected: number = currentPageData.filter((row) =>
      this.selection.isSelected(row)
    ).length;
    const numRows: number = currentPageData.length;

    return numSelected === numRows;
  }

  areAllSelectedOnCurrentPage(): boolean {
    const startIndex: number = this.paginatorPage * this.paginatorSize;
    const endIndex: number = startIndex + this.paginatorSize;

    const currentPageData: Offer[] = this.dataSource.data.slice(
      startIndex,
      endIndex
    );

    const numSelected: number = currentPageData.filter((row) =>
      this.selection.isSelected(row)
    ).length;

    return currentPageData.length > 0 && numSelected === currentPageData.length;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.areAllSelected();
  }

  toggleAllOnCurrentPage(): void {
    const startIndex: number = this.paginatorPage * this.paginatorSize;
    const endIndex: number = startIndex + this.paginatorSize;
    const currentPageData: Offer[] = this.dataSource.data.slice(
      startIndex,
      endIndex
    );

    if (this.areAllSelectedOnCurrentPage()) {
      currentPageData.forEach((row) => this.selection.deselect(row));
    } else {
      currentPageData.forEach((row) => this.selection.select(row));
    }
  }

  toggleCheckbox(row: Offer): void {
    this.selection.toggle(row);
  }

  removeSelectedOffers(): void {
    const selectedOffers: Offer[] = this.selection.selected;
    if (selectedOffers.length > 0) {
      this.removeOffersDialogService.openDialog(selectedOffers);
    }
  }

  handleSort(sortState: Sort): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    const { active, direction } = sortState;
    this.queryParamsService.updateCurrentSort(
      `${active && direction !== '' ? active : ''},${direction || ''}`
    );
  }

  handlePaginator(event: PageEvent): void {
    if (event.pageIndex !== event.previousPageIndex) {
      this.queryParamsService.updateCurrentPage(event.pageIndex + 1);
    }

    if (event.pageSize !== this.paginatorSize) {
      this.queryParamsService.updateCurrentPerPage(event.pageSize);
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  private useQueryParams(): void {
    this.queryParamsService
      .getAllQueryParams$()
      .pipe(
        tap((val) => {
          this.filterValue = val.filter === 'null' ? '' : val.filter;

          if (this.offersPerPageValues.includes(val.perPage)) {
            this.paginatorSize = val.perPage;
          } else {
            this.paginatorSize = OffersPerPage.Fifteen;
            this.queryParamsService.updateCurrentPerPage(OffersPerPage.Fifteen);
          }

          const totalItems: number = this.dataSource.data.length;
          const totalPages: number = Math.ceil(totalItems / this.paginatorSize);

          if (
            !Number.isInteger(val.page) ||
            val.page < 1 ||
            val.page > totalPages
          ) {
            this.paginatorPage = 1;
            this.queryParamsService.updateCurrentPage(1);
          } else {
            this.paginatorPage = val.page - 1;
          }

          const [active, direction] = val.sort.split(',');
          if (this.isValidSort(active, direction)) {
            if (
              this.sort.active !== active ||
              this.sort.direction !== direction
            ) {
              this.sort.active = active;
              this.sort.direction = direction as 'asc' | 'desc' | '';
              this.sort.sortChange.emit({
                active,
                direction: direction as SortDirection,
              });
            }
          } else {
            this.queryParamsService.updateCurrentSort(',');
            this.sort.active = '';
            this.sort.direction = '';
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.applyFilter(this.filterValue);
    this.paginator.pageIndex = this.paginatorPage;
    this.paginator.pageSize = this.paginatorSize;
    this.setSortingDataAccessor();
  }

  private handleRemoveSuccess(): void {
    this.removeOffersSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            this.selection.clear();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private setSortingDataAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'priority':
          return this.priorityMapping[item.priority];
        case 'status':
          return this.statusMapping[item.status];
        case 'salary':
          return this.getSortableSalaryValue(item);
        default:
          return (item as any)[property];
      }
    };
  }

  private updateTableSettings(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setSortingDataAccessor();
  }

  private isValidSort(active: string, direction: string): boolean {
    const isValidColumn: boolean = this.displayedColumns.includes(active);
    const isValidDirection: boolean = ['asc', 'desc', ''].includes(direction);
    return isValidColumn && isValidDirection;
  }

  private getSortableSalaryValue(item: Offer): number {
    if (item.minSalary && item.maxSalary) {
      return (item.minSalary + item.maxSalary) / 2;
    } else if (item.minSalary) {
      return item.minSalary;
    } else if (item.maxSalary) {
      return item.maxSalary;
    } else {
      return 0;
    }
  }
}
