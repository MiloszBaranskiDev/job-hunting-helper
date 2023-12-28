import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardOffersSingleOfferComponent } from './jhh-client-dashboard-offers-single-offer.component';

describe('JhhClientDashboardOffersSingleOfferComponent', () => {
  let component: JhhClientDashboardOffersSingleOfferComponent;
  let fixture: ComponentFixture<JhhClientDashboardOffersSingleOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardOffersSingleOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardOffersSingleOfferComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
