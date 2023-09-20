import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SidebarBurgerComponent } from './sidebar-burger.component';

import { SidebarService } from '@jhh/jhh-client/dashboard/feature-sidebar';

describe('SidebarBurgerComponent', () => {
  let component: SidebarBurgerComponent;
  let fixture: ComponentFixture<SidebarBurgerComponent>;
  let mockSidebarService: any;

  beforeEach(() => {
    mockSidebarService = {
      toggleSidebar: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [SidebarBurgerComponent],
      providers: [{ provide: SidebarService, useValue: mockSidebarService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleSidebar when button is clicked', () => {
    const button: DebugElement = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(mockSidebarService.toggleSidebar).toHaveBeenCalled();
  });
});
