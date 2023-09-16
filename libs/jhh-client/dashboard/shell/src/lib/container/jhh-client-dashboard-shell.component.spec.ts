import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardShellComponent } from './jhh-client-dashboard-shell.component';
import { JhhClientSharedUiToolbarComponent } from '@jhh/jhh-client/shared/ui-toolbar';
import { JhhClientSharedUiSidebarComponent } from '@jhh/jhh-client/shared/ui-sidebar';
import { DebugElement } from '@angular/core';

describe('JhhClientDashboardShellComponent', () => {
  let component: JhhClientDashboardShellComponent;
  let fixture: ComponentFixture<JhhClientDashboardShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        JhhClientDashboardShellComponent,
        JhhClientSharedUiToolbarComponent,
        JhhClientSharedUiSidebarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render JhhClientSharedUiToolbarComponent', () => {
    const toolbar: DebugElement = fixture.debugElement.query(
      By.directive(JhhClientSharedUiToolbarComponent)
    );
    expect(toolbar).not.toBeNull();
  });

  it('should render JhhClientSharedUiSidebarComponent', () => {
    const sidebar: DebugElement = fixture.debugElement.query(
      By.directive(JhhClientSharedUiSidebarComponent)
    );
    expect(sidebar).not.toBeNull();
  });

  it('should render RouterOutlet', () => {
    const routerOutlet: DebugElement = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutlet).not.toBeNull();
  });
});
