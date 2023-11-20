import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardNotesGroupsComponent } from './jhh-client-dashboard-notes-groups.component';

describe('JhhClientDashboardNotesNotesGroupsComponent', () => {
  let component: JhhClientDashboardNotesGroupsComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardNotesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
