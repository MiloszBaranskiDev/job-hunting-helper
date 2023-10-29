import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { NavComponent } from 'libs/jhh-client/dashboard/feature-breadcrumbs/src/lib/components/nav/nav.component';

import { BreadcrumbsService } from '../../service/breadcrumbs.service';

import { Breadcrumb } from '../../interfaces/breadcrumb';

@Component({
  selector: 'jhh-breadcrumbs',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './jhh-client-dashboard-breadcrumbs.component.html',
  styleUrls: ['./jhh-client-dashboard-breadcrumbs.component.scss'],
})
export class JhhClientDashboardBreadcrumbsComponent implements OnInit {
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);

  breadcrumbs$: Observable<Breadcrumb[]>;

  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
  }
}
