import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardEditNoteComponent } from '../../containers/edit/jhh-client-dashboard-edit-note.component';

describe('JhhDashboardEditNoteComponent', () => {
  let component: JhhClientDashboardEditNoteComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditNoteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardEditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
