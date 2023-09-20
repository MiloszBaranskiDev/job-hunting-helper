import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { JhhClientAuthUiTemplateComponent } from './jhh-client-auth-ui-template.component';

describe('JhhClientAuthUiTemplateComponent', () => {
  let component: JhhClientAuthUiTemplateComponent;
  let fixture: ComponentFixture<JhhClientAuthUiTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatDividerModule,
        JhhClientAuthUiTemplateComponent,
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JhhClientAuthUiTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call registerIcons on ngOnInit', () => {
    const registerIconsSpy = jest.spyOn(component as any, 'registerIcons');
    component.ngOnInit();
    expect(registerIconsSpy).toHaveBeenCalled();
  });

  it('should render header', () => {
    const header = fixture.debugElement.query(By.css('.authTemplate__header'));
    expect(header).toBeTruthy();
  });

  it('should render icons if icons array is not empty', () => {
    fixture.detectChanges();

    const iconList = fixture.debugElement.queryAll(
      By.css('.authTemplate__icons mat-icon')
    );
    expect(iconList.length).toBe(component.icons.length);
  });

  it('should not render icons if icons array is empty', () => {
    component.icons = [];
    fixture.detectChanges();
    const iconList = fixture.debugElement.query(By.css('.authTemplate__icons'));
    expect(iconList).toBeNull();
  });

  it('should set heading correctly', () => {
    component.heading = 'Test Heading';
    fixture.detectChanges();
    const heading = fixture.debugElement.query(
      By.css('.authTemplate__content h2')
    ).nativeElement as HTMLElement;
    expect(heading.textContent).toBe('Test Heading');
  });
});
