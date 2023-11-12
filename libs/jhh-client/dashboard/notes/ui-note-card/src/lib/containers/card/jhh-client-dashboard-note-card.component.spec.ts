import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNoteCardComponent } from './jhh-client-dashboard-note-card.component';

describe('JhhClientDashboardNoteCardComponent', () => {
  let component: JhhClientDashboardNoteCardComponent;
  let fixture: ComponentFixture<JhhClientDashboardNoteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNoteCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNoteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
