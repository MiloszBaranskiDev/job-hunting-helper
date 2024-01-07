import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardScheduleShellComponent } from './jhh-client-dashboard-schedule-shell.component';

describe('JhhClientDashboardScheduleShellComponent', () => {
  let component: JhhClientDashboardScheduleShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardScheduleShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardScheduleShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardScheduleShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
