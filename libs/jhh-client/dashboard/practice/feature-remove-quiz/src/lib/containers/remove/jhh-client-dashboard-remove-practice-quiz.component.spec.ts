import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardRemovePracticeQuizComponent } from './jhh-client-dashboard-remove-practice-quiz.component';

describe('JhhClientDashboardRemovePracticeQuizComponent', () => {
  let component: JhhClientDashboardRemovePracticeQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemovePracticeQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemovePracticeQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardRemovePracticeQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
