import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNotesSingleNoteComponent } from './jhh-client-dashboard-notes-single-note.component';

describe('JhhClientDashboardNotesSingleNoteComponent', () => {
  let component: JhhClientDashboardNotesSingleNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesSingleNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesSingleNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesSingleNoteComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
