import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardToolbarComponent } from './jhh-client-dashboard-toolbar.component';

describe('JhhClientDashboardFeatureToolbarComponent', () => {
  let component: JhhClientDashboardToolbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
