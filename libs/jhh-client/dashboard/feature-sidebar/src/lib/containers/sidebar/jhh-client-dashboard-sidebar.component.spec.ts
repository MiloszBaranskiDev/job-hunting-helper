import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardSidebarComponent } from './jhh-client-dashboard-sidebar.component';

import { SidebarService } from '../../services/sidebar.service';
import { ActivatedRoute } from '@angular/router';

describe('JhhClientDashboardSidebarComponent', () => {
  let component: JhhClientDashboardSidebarComponent;
  let fixture: ComponentFixture<JhhClientDashboardSidebarComponent>;
  let mockSidebarService: any;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockSidebarService = {
      isBreakpointMobile$: of(false),
      isSidebarOpened$: of(true),
      isSidebarExpanded$: of(true),
      toggleSidebar: jest.fn(),
    };

    mockActivatedRoute = { queryParams: of({}) };

    TestBed.configureTestingModule({
      imports: [JhhClientDashboardSidebarComponent, NoopAnimationsModule],
      providers: [
        { provide: SidebarService, useValue: mockSidebarService },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
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
