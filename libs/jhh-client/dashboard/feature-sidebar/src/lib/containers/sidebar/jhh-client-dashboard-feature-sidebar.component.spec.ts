import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientDashboardFeatureSidebarComponent } from './jhh-client-dashboard-feature-sidebar.component';

import { SidebarService } from '../../service/sidebar.service';

describe('JhhClientDashboardFeatureSidebarComponent', () => {
  let component: JhhClientDashboardFeatureSidebarComponent;
  let fixture: ComponentFixture<JhhClientDashboardFeatureSidebarComponent>;
  let mockSidebarService: any;

  beforeEach(() => {
    mockSidebarService = {
      isBreakpointMobile$: of(false),
      isSidebarOpened$: of(true),
      isSidebarExpanded$: of(true),
      toggleSidebar: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        JhhClientDashboardFeatureSidebarComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: SidebarService, useValue: mockSidebarService }],
    }).compileComponents();

    fixture = TestBed.createComponent(
      JhhClientDashboardFeatureSidebarComponent
    );
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
