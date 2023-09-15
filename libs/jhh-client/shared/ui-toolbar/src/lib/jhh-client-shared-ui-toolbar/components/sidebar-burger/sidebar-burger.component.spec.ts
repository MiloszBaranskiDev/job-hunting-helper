import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarBurgerComponent } from './sidebar-burger.component';

describe('SidebarBurgerComponent', () => {
  let component: SidebarBurgerComponent;
  let fixture: ComponentFixture<SidebarBurgerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarBurgerComponent]
    });
    fixture = TestBed.createComponent(SidebarBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
