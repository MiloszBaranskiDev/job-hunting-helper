import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardSidebarComponent } from './jhh-client-dashboard-sidebar.component';

import { SidebarService } from '../../service/sidebar.service';

describe('JhhClientDashboardSidebarComponent', () => {
  let component: JhhClientDashboardSidebarComponent;
  let fixture: ComponentFixture<JhhClientDashboardSidebarComponent>;
  let mockSidebarService: any;

  beforeEach(() => {
    mockSidebarService = {
      isBreakpointMobile$: of(false),
      isSidebarOpened$: of(true),
      isSidebarExpanded$: of(true),
      toggleSidebar: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [JhhClientDashboardSidebarComponent, NoopAnimationsModule],
      providers: [{ provide: SidebarService, useValue: mockSidebarService }],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientDashboardSidebarComponent);
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
});
