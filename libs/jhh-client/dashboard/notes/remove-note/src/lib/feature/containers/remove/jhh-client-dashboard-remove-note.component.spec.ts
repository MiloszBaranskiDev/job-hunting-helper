import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardRemoveNoteComponent } from './jhh-client-dashboard-remove-note.component';

describe('JhhClientDashboardRemoveNoteComponent', () => {
  let component: JhhClientDashboardRemoveNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardRemoveNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
