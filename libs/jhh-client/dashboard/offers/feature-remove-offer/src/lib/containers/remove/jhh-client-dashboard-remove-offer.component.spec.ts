import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardRemoveOfferComponent } from './jhh-client-dashboard-remove-offer.component';

describe('JhhClientDashboardRemoveOfferComponent', () => {
  let component: JhhClientDashboardRemoveOfferComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardRemoveOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
