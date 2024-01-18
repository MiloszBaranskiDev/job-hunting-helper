import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardPracticeSingleQuizComponent } from './jhh-client-dashboard-practice-single-quiz.component';

describe('JhhClientDashboardPracticeSingleQuizComponent', () => {
  let component: JhhClientDashboardPracticeSingleQuizComponent;
  let fixture: ComponentFixture<JhhClientDashboardPracticeSingleQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPracticeSingleQuizComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardPracticeSingleQuizComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
