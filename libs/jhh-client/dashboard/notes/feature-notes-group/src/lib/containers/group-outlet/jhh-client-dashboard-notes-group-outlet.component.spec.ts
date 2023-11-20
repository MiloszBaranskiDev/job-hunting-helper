import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardNotesGroupOutletComponent } from './jhh-client-dashboard-notes-group-outlet.component';

describe('JhhClientDashboardNotesGroupOutletComponent', () => {
  let component: JhhClientDashboardNotesGroupOutletComponent;
  let fixture: ComponentFixture<JhhClientDashboardNotesGroupOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardNotesGroupOutletComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardNotesGroupOutletComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
