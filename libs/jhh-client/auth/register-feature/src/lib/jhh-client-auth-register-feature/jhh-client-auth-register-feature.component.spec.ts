import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientAuthRegisterFeatureComponent } from './jhh-client-auth-register-feature.component';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { FormFields } from './enums/form-fields';

describe('JhhClientAuthRegisterFeatureComponent', () => {
  let component: JhhClientAuthRegisterFeatureComponent;
  let fixture: ComponentFixture<JhhClientAuthRegisterFeatureComponent>;
  let authFacade: AuthFacade;
  let registerInProgressSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    registerInProgressSubject = new BehaviorSubject(false);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        JhhClientAuthRegisterFeatureComponent,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: AuthFacade,
          useValue: {
            register: jest.fn(),
            registerInProgress$: of(false),
            registerError$: of(null),
          },
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhhClientAuthRegisterFeatureComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade);
    authFacade.register = jest.fn().mockReturnValue(of('some_value'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update password strength when the password changes', () => {
    component.formGroup.get(FormFields.Password)?.setValue('simple');
    component.validatePasswords();

    expect(component.passwordStrengthSubject.value).not.toBe(0);
  });

  it('should toggle password visibility when the toggle button is clicked', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('#password-input')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('#password-type-toggle-first')
    ).nativeElement;
    expect(passwordInput.type).toBe('password');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call onSubmit and register when the form is valid', () => {
    const authFacade = TestBed.inject(AuthFacade);
    component.formGroup.get(FormFields.Username)?.setValue('username');
    component.formGroup.get(FormFields.Password)?.setValue('password');
    component.formGroup.get(FormFields.ConfirmPassword)?.setValue('password');

    component.onSubmit();

    expect(authFacade.register).toHaveBeenCalledWith(
      'username',
      'password',
      'password'
    );
  });

  it('should disable submit button when register is in progress', () => {
    registerInProgressSubject.next(true);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should show spinner when register is in progress', async () => {
    component.registerInProgress$ = of(true);
    component.registerError$ = of(null);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});
