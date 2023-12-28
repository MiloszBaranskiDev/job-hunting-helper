import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, first, Observable, pluck, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';

import { Offer } from '@jhh/shared/interfaces';
import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';

@Component({
  selector: 'jhh-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jhh-client-dashboard-offers-single-offer.component.html',
  styleUrls: ['./jhh-client-dashboard-offers-single-offer.component.scss'],
})
export class JhhClientDashboardOffersSingleOfferComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);

  offer$: Observable<Offer>;

  ngOnInit(): void {
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
