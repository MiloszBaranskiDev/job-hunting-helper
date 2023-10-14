import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNoteContentEditorComponent } from './jhh-client-dashboard-note-content-editor.component';

describe('JhhClientDashboardNoteContentEditorComponent', () => {
  let component: JhhClientDashboardNoteContentEditorComponent;
  let fixture: ComponentFixture<JhhClientDashboardNoteContentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNoteContentEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNoteContentEditorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
