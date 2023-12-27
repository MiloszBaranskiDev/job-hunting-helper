import {
  AfterViewInit,
  Component,
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

import { Offer } from '@jhh/shared/interfaces';
import { OfferPriority, OfferStatus } from '@jhh/shared/enums';

import { MenuComponent } from '../menu/menu.component';

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
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges {
  @Input({ required: true }) offers: Offer[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Offer>;
  readonly offerStatus: typeof OfferStatus = OfferStatus;

  readonly displayedColumns: string[] = [
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

  private updateTableData(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'priority':
          return this.priorityMapping[item.priority];
        case 'status':
          return this.statusMapping[item.status];
        default:
          return (item as any)[property];
      }
    };
  }
}
