import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardPaginationComponent } from './jhh-client-dashboard-pagination.component';

describe('JhhClientDashboardPaginationComponent', () => {
  let component: JhhClientDashboardPaginationComponent;
  let fixture: ComponentFixture<JhhClientDashboardPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
