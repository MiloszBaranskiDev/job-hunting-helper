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
import { FilterComponent } from '../filter/filter.component';

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
  OffersTableColumn,
} from '@jhh/jhh-client/dashboard/offers/domain';

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

  readonly offersTableColumn: typeof OffersTableColumn = OffersTableColumn;
  readonly offersTableColumnValues: OffersTableColumn[] =
    Object.values(OffersTableColumn);
  readonly offersPerPageValues: number[] = Object.values(OffersPerPage).filter(
    (value): value is number => typeof value === 'number'
  );

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
    this.extendOffer();
    this.queryParamsService.setFromCurrentRoute();
    this.queryParamsService.updateQueryParams();

    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;
    this.loadExchangeRatesSuccess$ =
      this.offersFacade.loadExchangeRatesSuccess$;
    this.currentCurrency$ = this.currencyService.currentCurrency$;
    this.exchangeRates$ = this.offersFacade.exchangeRates$;

    this.watchCurrencyAndExchangeRateChanges();
    this.handleRemoveSuccess();
  }

  ngAfterViewInit(): void {
    this.paginator = this.paginatorComponent.getPaginator();
    this.useQueryParams();
    this.updateTableSettings();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.extendOffer();
      this.watchCurrencyAndExchangeRateChanges();
      this.updateTableSettings();

      if (
        this.paginator &&
        this.paginatorPage * this.paginatorSize >=
          this.dataSource.data.length &&
        this.paginatorPage > 0
      ) {
        this.paginator.previousPage();
        this.paginatorPage = Math.max(this.paginatorPage - 1, 0);
      }
    }
  }

  onPaginatorReady(paginator: MatPaginator): void {
    this.dataSource.paginator = paginator;
  }

  applyFilter(event: Event | string): void {
    this.dataSource.filter = (
      typeof event === 'string'
        ? event
        : (event?.target as HTMLInputElement)?.value || ''
    )
      .trim()
      .toLowerCase();
    this.queryParamsService.updateCurrentFilter(this.dataSource.filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0;
  }

  areAllSelectedOnCurrentPage(): boolean {
    const startIndex: number = this.paginatorPage * this.paginatorSize;
    const endIndex: number = startIndex + this.paginatorSize;

    return this.dataSource.data
      .slice(startIndex, endIndex)
      .every((row) => this.selection.isSelected(row));
  }

  toggleAllOnCurrentPage(): void {
    const areAllSelectedOnCurrentPage: boolean =
      this.areAllSelectedOnCurrentPage();

    this.dataSource.data
      .slice(
        this.paginatorPage * this.paginatorSize,
        (this.paginatorPage + 1) * this.paginatorSize
      )
      .forEach((row) =>
        areAllSelectedOnCurrentPage
          ? this.selection.deselect(row)
          : this.selection.select(row)
      );
  }

  removeSelectedOffers(): void {
    if (this.selection.selected.length) {
      this.removeOffersDialogService.openDialog(this.selection.selected);
    }
  }

  handleSort({ active, direction }: Sort): void {
    this.dataSource.paginator?.firstPage();
    this.queryParamsService.updateCurrentSort(
      `${active && direction ? `${active},${direction}` : ','}`
    );
  }

  private extendOffer(exchangeRates: ExchangeRate[] | null = null): void {
    this.dataSource = new MatTableDataSource(
      this.offers.map(
        (offer) =>
          ({
            ...offer,
            statusIcon: GetOfferStatusIcon(offer.status),
            convertedSalary: GetOfferSalaryConversion(
              offer.salaryCurrency,
              offer.minSalary,
              offer.maxSalary,
              this.currentCurrency$?.getValue() ?? undefined,
              exchangeRates ?? undefined
            ),
          } as ExtendedOffer)
      )
    );
  }

  private watchCurrencyAndExchangeRateChanges(): void {
    this.loadExchangeRatesSuccess$
      ?.pipe(
        filter(Boolean),
        switchMap(() => this.currentCurrency$),
        switchMap(() =>
          this.exchangeRates$.pipe(
            tap((exchangeRates) => {
              this.extendOffer(exchangeRates);
            })
          )
        ),
        tap(() => {
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

  private setSortingDataAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case OffersTableColumn.Priority:
          return this.priorityMapping[item.priority];
        case OffersTableColumn.Status:
          return this.statusMapping[item.status];
        case OffersTableColumn.Salary:
          if (item.convertedSalary) {
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

  private isValidSort(active: string, direction: string): boolean {
    const isValidDirection: boolean = ['asc', 'desc', ''].includes(direction);
    const isValidColumn: boolean = this.offersTableColumnValues.includes(
      active as OffersTableColumn
    );

    return isValidDirection && isValidColumn;
  }

  private getSortableSalaryValue(
    item: ExtendedOffer,
    isConverted: boolean = false
  ): number {
    const salaryRange = isConverted
      ? item.convertedSalary
      : { min: item.minSalary, max: item.maxSalary };
    const min: number = salaryRange?.min || 0;
    const max: number = salaryRange?.max || 0;

    return min && max ? (min + max) / 2 : min || max;
  }

  private handleRemoveSuccess(): void {
    this.removeOffersSuccess$
      .pipe(
        filter((val) => val),
        tap(() => {
          this.selection.clear();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private useQueryParams(): void {
    this.queryParamsService
      .getAllQueryParams$()
      .pipe(
        tap(({ filter, perPage, page, sort }) => {
          this.filterValue = filter === 'null' ? '' : filter;

          this.paginatorSize = this.offersPerPageValues.includes(perPage)
            ? perPage
            : OffersPerPage.Ten;
          if (!this.offersPerPageValues.includes(perPage)) {
            this.queryParamsService.updateCurrentPerPage(OffersPerPage.Ten);
          }

          const totalPages: number = Math.ceil(
            this.dataSource.data.length / this.paginatorSize
          );
          this.paginatorPage =
            !Number.isInteger(page) || page < 1 || page > totalPages
              ? 1
              : page - 1;
          if (this.paginatorPage + 1 !== page) {
            this.queryParamsService.updateCurrentPage(1);
          }

          const [active, direction] = sort.split(',');
          if (
            this.isValidSort(active, direction) &&
            (this.sort.active !== active || this.sort.direction !== direction)
          ) {
            this.sort.active = active;
            this.sort.direction = direction as 'asc' | 'desc' | '';
            this.sort.sortChange.emit({
              active,
              direction: direction as SortDirection,
            });
          } else if (!this.isValidSort(active, direction)) {
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
}
