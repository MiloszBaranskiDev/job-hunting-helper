import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavListComponent } from './nav-list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NavListComponent', () => {
  let component: NavListComponent;
  let fixture: ComponentFixture<NavListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sidebar items', () => {
    const sidebarItems: DebugElement[] = fixture.debugElement.queryAll(
      By.css('.sidenav__item')
    );
    expect(sidebarItems.length).toBe(1);
  });
});
