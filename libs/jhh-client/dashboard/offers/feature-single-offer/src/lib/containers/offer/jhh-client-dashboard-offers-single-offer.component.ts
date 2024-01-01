import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, first, Observable, pluck, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

import { StatusUpdatesComponent } from '../../components/status-updates/status-updates.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ControlsComponent } from '../../components/controls/controls.component';
import { DescriptionComponent } from '../../components/description/description.component';
import { DetailsComponent } from '../../components/details/details.component';
import { JhhClientDashboardEditOfferComponent } from '@jhh/jhh-client/dashboard/offers/feature-edit-offer';

import { Offer } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-offer',
  standalone: true,
  imports: [
    CommonModule,
    StatusUpdatesComponent,
    HeaderComponent,
    ControlsComponent,
    DescriptionComponent,
    DetailsComponent,
    JhhClientDashboardEditOfferComponent,
  ],
  templateUrl: './jhh-client-dashboard-offers-single-offer.component.html',
  styleUrls: ['./jhh-client-dashboard-offers-single-offer.component.scss'],
})
export class JhhClientDashboardOffersSingleOfferComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  offer$: Observable<Offer>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.offer$ = this.route.params.pipe(
      pluck('offerSlug'),
      switchMap((slug: string) => this.offersFacade.getOffer$BySlug(slug)),
      filter((offer): offer is Offer => !!offer),
      tap((offer) => {
        this.breadcrumbsService.updateBreadcrumbLabelByUrl(
          this.router.url.split('?')[0],
          offer.position
        );
        this.titleService.setTitle(`Offer - ${offer.position}`);
      })
    );

    this.offer$.pipe(first()).subscribe();
  }
}
