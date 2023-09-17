import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhClientDashboardUiToolbarComponent } from './jhh-client-dashboard-ui-toolbar.component';

describe('JhhClientDashboardUiToolbarComponent', () => {
  let component: JhhClientDashboardUiToolbarComponent;
  let fixture: ComponentFixture<JhhClientDashboardUiToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JhhClientDashboardUiToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardUiToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
