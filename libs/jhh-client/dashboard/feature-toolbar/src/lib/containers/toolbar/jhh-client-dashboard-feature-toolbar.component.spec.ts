import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardFeatureToolbarComponent } from './jhh-client-dashboard-feature-toolbar.component';

describe('JhhClientDashboardFeatureToolbarComponent', () => {
  let component: JhhClientDashboardFeatureToolbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardFeatureToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardFeatureToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardFeatureToolbarComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
