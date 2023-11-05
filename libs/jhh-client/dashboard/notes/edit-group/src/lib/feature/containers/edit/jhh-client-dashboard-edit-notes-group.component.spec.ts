import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardEditNotesGroupComponent } from 'libs/jhh-client/dashboard/notes/edit-group/src/lib/containers/edit/jhh-client-dashboard-edit-notes-group.component';

describe('JhhClientDashboardNotesEditNotesGroupComponent', () => {
  let component: JhhClientDashboardEditNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardEditNotesGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardEditNotesGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardEditNotesGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
