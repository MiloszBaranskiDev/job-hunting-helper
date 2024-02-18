import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardHomeComponent } from './jhh-client-dashboard-home.component';

describe('JhhClientDashboardHomeComponent', () => {
  let component: JhhClientDashboardHomeComponent;
  let fixture: ComponentFixture<JhhClientDashboardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
