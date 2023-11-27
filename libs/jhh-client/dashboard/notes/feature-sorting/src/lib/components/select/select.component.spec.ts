import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelectComponent,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sort options', () => {
    component.sortOptionsValues = ['name', 'date', 'priority'];
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('mat-select'));
    expect(selectElement).toBeTruthy();
  });

  it('should emit selectionChange event on sort change', () => {
    jest.spyOn(component.selectionChange, 'emit');

    component.handleSortChange('date');
    expect(component.selectionChange.emit).toHaveBeenCalledWith('date');
  });
});
