import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardFooterComponent } from './jhh-client-dashboard-footer.component';

describe('JhhClientDashboardFooterComponent', () => {
  let component: JhhClientDashboardFooterComponent;
  let fixture: ComponentFixture<JhhClientDashboardFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
