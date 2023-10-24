import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardChangeNoteGroupComponent } from './jhh-client-dashboard-change-note-group.component';

describe('JhhClientDashboardChangeNoteGroupComponent', () => {
  let component: JhhClientDashboardChangeNoteGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardChangeNoteGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardChangeNoteGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardChangeNoteGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
