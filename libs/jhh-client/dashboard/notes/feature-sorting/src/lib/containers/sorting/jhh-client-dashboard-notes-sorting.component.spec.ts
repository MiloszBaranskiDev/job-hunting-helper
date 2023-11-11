import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNotesSortingComponent } from './jhh-client-dashboard-notes-sorting.component';

describe('JhhClientDashboardNotesSortingComponent', () => {
  let component: JhhClientDashboardNotesSortingComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesSortingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
