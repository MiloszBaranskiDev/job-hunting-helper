import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardPracticeComponent } from './jhh-client-dashboard-practice.component';

describe('JhhClientDashboardPracticeComponent', () => {
  let component: JhhClientDashboardPracticeComponent;
  let fixture: ComponentFixture<JhhClientDashboardPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPracticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
