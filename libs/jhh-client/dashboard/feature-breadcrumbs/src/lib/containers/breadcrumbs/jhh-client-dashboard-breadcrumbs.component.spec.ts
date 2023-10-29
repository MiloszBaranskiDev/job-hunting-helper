import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JhhClientDashboardBreadcrumbsComponent } from 'libs/jhh-client/dashboard/feature-breadcrumbs/src/lib/containers/breadcrumbs/jhh-client-dashboard-breadcrumbs.component';

describe('JhhDashboardBreadcrumbsComponent', () => {
  let component: JhhClientDashboardBreadcrumbsComponent;
  let fixture: ComponentFixture<JhhClientDashboardBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardBreadcrumbsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
