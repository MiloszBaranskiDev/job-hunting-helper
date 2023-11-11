import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNotesPaginationComponent } from './jhh-client-dashboard-notes-pagination.component';

describe('JhhClientDashboardNotesPaginationComponent', () => {
  let component: JhhClientDashboardNotesPaginationComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesPaginationComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
