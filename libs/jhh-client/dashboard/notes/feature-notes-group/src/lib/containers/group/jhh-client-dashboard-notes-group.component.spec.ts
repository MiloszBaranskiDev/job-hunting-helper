import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNotesGroupComponent } from './jhh-client-dashboard-notes-group.component';

describe('JhhClientDashboardNotesGroupComponent', () => {
  let component: JhhClientDashboardNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
