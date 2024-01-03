import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardRemoveOffersComponent } from 'libs/jhh-client/dashboard/offers/feature-remove-offers/src/lib/containers/remove/jhh-client-dashboard-remove-offers.component';

describe('JhhClientDashboardRemoveOfferComponent', () => {
  let component: JhhClientDashboardRemoveOffersComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveOffersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardRemoveOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
