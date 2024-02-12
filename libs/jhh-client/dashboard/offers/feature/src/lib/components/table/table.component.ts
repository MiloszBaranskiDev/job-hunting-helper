import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
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
import { MatPaginator } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, filter, Observable, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';
import {
  CurrencyService,
  OffersFacade,
} from '@jhh/jhh-client/dashboard/offers/data-access';
import { QueryParamsService } from '../../services/query-params/query-params.service';
import { FormatOfferSalaryPipe } from '@jhh/jhh-client/dashboard/offers/util-format-offer-salary';
import { GetOfferStatusIcon } from '@jhh/jhh-client/dashboard/offers/util-get-offer-status-icon';
import { GetOfferSalaryConversion } from '@jhh/jhh-client/dashboard/offers/util-get-offer-salary-conversion';

import { MenuComponent } from '../menu/menu.component';
import { CurrencyComponent } from '../currency/currency.component';
import { PaginatorComponent } from '../paginator/paginator.component';

import {
  Offer,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';
import {
  ExchangeRate,
  ExtendedOffer,
  OffersPerPage,
} from '@jhh/jhh-client/dashboard/offers/domain';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'jhh-offers-table',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MenuComponent,
    RouterLink,
    MatCheckboxModule,
    MatButtonModule,
    FormatOfferSalaryPipe,
    CurrencyComponent,
    PaginatorComponent,
    FilterComponent,
  ],
  providers: [CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly currencyService: CurrencyService = inject(CurrencyService);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly removeOffersDialogService: RemoveOffersDialogService =
    inject(RemoveOffersDialogService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  @Input({ required: true }) offers: Offer[];

  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;
  @ViewChild(MatSort) sort: MatSort;

  removeOffersInProgress$: Observable<boolean>;
  removeOffersSuccess$: Observable<boolean>;
  loadExchangeRatesSuccess$: Observable<boolean>;
  currentCurrency$: BehaviorSubject<OfferSalaryCurrency | null>;
  exchangeRates$: Observable<ExchangeRate[] | null>;

  paginator: MatPaginator;
  dataSource: MatTableDataSource<ExtendedOffer>;
  selection: SelectionModel<Offer> = new SelectionModel<Offer>(true, []);
  filterValue: string;
  paginatorPage: number;
  paginatorSize: number;

  private loadExchangeRatesSuccess: boolean = false;
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
    this.extendWithStatusIcon();

    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;
    this.loadExchangeRatesSuccess$ =
      this.offersFacade.loadExchangeRatesSuccess$;
    this.currentCurrency$ = this.currencyService.currentCurrency$;
    this.exchangeRates$ = this.offersFacade.exchangeRates$;

    this.queryParamsService.setFromCurrentRoute();
    this.queryParamsService.updateQueryParams();

    this.watchCurrencyAndExchangeRateChanges();
    this.handleRemoveSuccess();
  }

  ngAfterViewInit(): void {
    this.paginator = this.paginatorComponent.getPaginator();
    this.dataSource.paginator = this.paginator;
    this.useQueryParams();
    this.updateTableSettings();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.extendWithStatusIcon();
      this.watchCurrencyAndExchangeRateChanges();
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

  onPaginatorReady(paginator: MatPaginator): void {
    this.dataSource.paginator = paginator;
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

    const currentPageData: ExtendedOffer[] = this.dataSource.data.slice(
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

  private watchCurrencyAndExchangeRateChanges(): void {
    this.loadExchangeRatesSuccess$
      ?.pipe(
        filter(Boolean),
        switchMap(() => this.currentCurrency$),
        switchMap(() => this.convertSalaries()),
        tap(() => {
          this.loadExchangeRatesSuccess = true;
          this.applyFilter(this.filterValue);
          if (this.dataSource && this.sort) {
            this.dataSource.sort = this.sort;
            this.updateTableSettings();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private convertSalaries(): Observable<ExchangeRate[] | null> {
    return this.exchangeRates$.pipe(
      tap((exchangeRates) => {
        this.extendWithConvertedSalary(exchangeRates);
      })
    );
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
          if (this.loadExchangeRatesSuccess && item.convertedSalary) {
            return this.getSortableSalaryValue(item, true);
          } else {
            return this.getSortableSalaryValue(item);
          }
        default:
          return (item as any)[property];
      }
    };
  }

  private updateTableSettings(): void {
    if (this.sort && this.dataSource) {
      this.dataSource.sort = this.sort;
      this.setSortingDataAccessor();
      this.dataSource.sort.sortChange.emit(this.sort);
    }
    this.dataSource.paginator = this.paginator;
  }

  private extendWithStatusIcon(): void {
    this.dataSource = new MatTableDataSource(
      this.offers.map(
        (offer) =>
          ({
            ...offer,
            statusIcon: GetOfferStatusIcon(offer.status),
          } as ExtendedOffer)
      )
    );
  }

  private extendWithConvertedSalary(
    exchangeRates: ExchangeRate[] | null
  ): void {
    this.dataSource = new MatTableDataSource(
      this.offers.map(
        (offer) =>
          ({
            ...offer,
            convertedSalary: GetOfferSalaryConversion(
              offer.salaryCurrency,
              offer.minSalary,
              offer.maxSalary,
              this.currentCurrency$.getValue() ?? undefined,
              exchangeRates ?? undefined
            ),
          } as ExtendedOffer)
      )
    );
  }

  private isValidSort(active: string, direction: string): boolean {
    const isValidColumn: boolean = this.displayedColumns.includes(active);
    const isValidDirection: boolean = ['asc', 'desc', ''].includes(direction);

    return isValidColumn && isValidDirection;
  }

  private getSortableSalaryValue(
    item: ExtendedOffer,
    isConverted: boolean = false
  ): number {
    const min: number | undefined = isConverted
      ? item.convertedSalary?.min
      : item.minSalary;
    const max: number | undefined = isConverted
      ? item.convertedSalary?.max
      : item.maxSalary;

    if (min && max) {
      return (min + max) / 2;
    } else if (min) {
      return min;
    } else if (max) {
      return max;
    } else {
      return 0;
    }
  }
}
