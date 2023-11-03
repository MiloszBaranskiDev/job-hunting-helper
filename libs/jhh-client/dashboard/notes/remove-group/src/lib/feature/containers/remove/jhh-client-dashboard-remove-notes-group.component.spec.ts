import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardRemoveNotesGroupComponent } from './jhh-client-dashboard-remove-notes-group.component';

describe('JhhClientDashboardRemoveNotesGroupComponent', () => {
  let component: JhhClientDashboardRemoveNotesGroupComponent;
  let fixture: ComponentFixture<JhhClientDashboardRemoveNotesGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardRemoveNotesGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardRemoveNotesGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
