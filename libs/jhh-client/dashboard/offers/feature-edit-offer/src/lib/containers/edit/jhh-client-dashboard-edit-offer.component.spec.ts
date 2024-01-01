import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardEditOfferComponent } from './jhh-client-dashboard-edit-offer.component';

describe('JhhClientDashboardEditOfferComponentComponent', () => {
  let component: JhhClientDashboardEditOfferComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardEditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
