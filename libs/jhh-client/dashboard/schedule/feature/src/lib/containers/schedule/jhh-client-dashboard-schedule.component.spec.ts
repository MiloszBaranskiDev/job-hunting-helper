import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardScheduleComponent } from './jhh-client-dashboard-schedule.component';

describe('JhhClientDashboardScheduleComponent', () => {
  let component: JhhClientDashboardScheduleComponent;
  let fixture: ComponentFixture<JhhClientDashboardScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
