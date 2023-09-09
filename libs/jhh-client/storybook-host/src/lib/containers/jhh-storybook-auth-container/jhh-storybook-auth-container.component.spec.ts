import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JhhStorybookAuthContainerComponent } from './jhh-storybook-auth-container.component';

describe('JhhStorybookAuthContainerComponent', () => {
  let component: JhhStorybookAuthContainerComponent;
  let fixture: ComponentFixture<JhhStorybookAuthContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JhhStorybookAuthContainerComponent]
    });
    fixture = TestBed.createComponent(JhhStorybookAuthContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
