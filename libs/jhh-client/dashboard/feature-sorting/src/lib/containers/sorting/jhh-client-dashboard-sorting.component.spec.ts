import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardSortingComponent } from './jhh-client-dashboard-sorting.component';

describe('JhhClientDashboardSortingComponent', () => {
  let component: JhhClientDashboardSortingComponent;
  let fixture: ComponentFixture<JhhClientDashboardSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardSortingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
