import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardOffersShellComponent } from './jhh-client-dashboard-offers-shell.component';

describe('JhhClientDashboardOffersShellComponent', () => {
  let component: JhhClientDashboardOffersShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardOffersShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardOffersShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardOffersShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
