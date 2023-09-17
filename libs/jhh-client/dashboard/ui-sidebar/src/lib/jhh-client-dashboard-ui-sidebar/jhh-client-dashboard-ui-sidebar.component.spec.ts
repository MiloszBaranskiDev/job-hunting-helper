import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

import { JhhClientDashboardUiSidebarComponent } from './jhh-client-dashboard-ui-sidebar.component';

import { SidebarService } from '../service/sidebar.service';

describe('JhhClientDashboardUiSidebarComponent', () => {
  let component: JhhClientDashboardUiSidebarComponent;
  let fixture: ComponentFixture<JhhClientDashboardUiSidebarComponent>;
  let mockSidebarService: any;

  beforeEach(() => {
    mockSidebarService = {
      isBreakpointMobile$: of(false),
      isSidebarOpened$: of(true),
      isSidebarExpanded$: of(true),
      toggleSidebar: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [JhhClientDashboardUiSidebarComponent, NoopAnimationsModule],
      providers: [{ provide: SidebarService, useValue: mockSidebarService }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardUiSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleSidebar when handleClose is called', () => {
    component.handleClose();
    expect(mockSidebarService.toggleSidebar).toHaveBeenCalled();
  });

  it('should display sidebar items', () => {
    const sidebarItems: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.sidenav__item')
    );
    expect(sidebarItems.length).toBe(1);
  });
});
