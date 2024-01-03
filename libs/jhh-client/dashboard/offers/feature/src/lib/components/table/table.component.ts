import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MenuComponent } from '../menu/menu.component';

import { Offer } from '@jhh/shared/interfaces';
import { OfferPriority, OfferStatus } from '@jhh/shared/enums';

import { RemoveOffersDialogService } from '@jhh/jhh-client/dashboard/offers/feature-remove-offers';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

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
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
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
  readonly offerStatus: typeof OfferStatus = OfferStatus;

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
    this.updateTableData();
    this.removeOffersInProgress$ = this.offersFacade.removeOffersInProgress$;
    this.removeOffersSuccess$ = this.offersFacade.removeOffersSuccess$;

    this.handleRemoveSuccess();
  }

  ngAfterViewInit(): void {
    this.updateTableData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offers']) {
      this.dataSource = new MatTableDataSource(this.offers);
      this.updateTableData();
    }
  }

  applyFilter(event: Event): void {
    const filterValue: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSortChange(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  areAllSelected(): boolean {
    const numSelected: number = this.selection.selected.length;
    const numRows: number = this.dataSource.data.length;

    return numSelected === numRows;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.areAllSelected();
  }

  toggleAll(): void {
    if (this.areAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  checkboxToggle(row: Offer): void {
    this.selection.toggle(row);
  }

  removeSelectedOffers(): void {
    const selectedOffers: Offer[] = this.selection.selected;
    if (selectedOffers.length > 0) {
      this.removeOffersDialogService.openDialog(selectedOffers);
    }
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

  private updateTableData(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
