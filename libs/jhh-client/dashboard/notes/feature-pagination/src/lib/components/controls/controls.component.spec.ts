import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ControlsComponent } from './controls.component';

describe('ControlsComponent', () => {
  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ControlsComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update inputPage on currentPage change', () => {
    component.currentPage = 5;
    component.ngOnChanges();
    expect(component.inputPage).toBe(5);
  });

  it('should emit correct page number on goToPreviousPage', () => {
    component.currentPage = 3;
    jest.spyOn(component.pageChange, 'emit');
    component.goToPreviousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should emit correct page number on goToNextPage', () => {
    component.currentPage = 3;
    component.totalPages = 5;
    jest.spyOn(component.pageChange, 'emit');
    component.goToNextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit page change if already on first or last page', () => {
    component.currentPage = 1;
    component.totalPages = 1;
    jest.spyOn(component.pageChange, 'emit');
    component.goToPreviousPage();
    component.goToNextPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit correct page number on setPage', () => {
    const mockEvent: Event = { target: { value: '2' } } as unknown as Event;
    jest.spyOn(component.pageChange, 'emit');
    component.setPage(mockEvent);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });
});
