import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardEditPracticeQuizComponent } from './jhh-client-dashboard-edit-practice-quiz.component';

describe('JhhClientDashboardEditPracticeQuizComponent', () => {
  let component: JhhClientDashboardEditPracticeQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditPracticeQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditPracticeQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardEditPracticeQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
