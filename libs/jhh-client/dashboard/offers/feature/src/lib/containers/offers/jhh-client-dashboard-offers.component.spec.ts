import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardOffersComponent } from './jhh-client-dashboard-offers.component';

describe('JhhClientDashboardOffersComponent', () => {
  let component: JhhClientDashboardOffersComponent;
  let fixture: ComponentFixture<JhhClientDashboardOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardOffersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
