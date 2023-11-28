import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardBoardComponent } from './jhh-client-dashboard-board.component';

describe('JhhClientDashboardBoardComponent', () => {
  let component: JhhClientDashboardBoardComponent;
  let fixture: ComponentFixture<JhhClientDashboardBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
