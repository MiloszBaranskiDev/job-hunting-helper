import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { Offer } from '@jhh/shared/interfaces';
import { OfferPriority, OfferStatus } from '@jhh/shared/enums';

@Component({
  selector: 'jhh-offers-table',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule, MatIconModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) offers: Offer[];

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Offer>;
  readonly displayedColumns: string[] = [
    'position',
    'company',
    'location',
    'salary',
    'status',
    'priority',
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
