import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardShellComponent } from './jhh-client-dashboard-shell.component';

describe('JhhClientDashboardShellComponent', () => {
  let component: JhhClientDashboardShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
