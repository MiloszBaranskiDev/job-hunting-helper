import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardTitleComponent } from './jhh-client-dashboard-title.component';

describe('JhhClientDashboardTitleComponent', () => {
  let component: JhhClientDashboardTitleComponent;
  let fixture: ComponentFixture<JhhClientDashboardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
