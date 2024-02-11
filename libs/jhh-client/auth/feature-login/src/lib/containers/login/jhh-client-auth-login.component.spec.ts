import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JhhClientAuthLoginComponent } from './jhh-client-auth-login.component';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { AuthFormFields } from '@jhh/jhh-client/auth/domain';

describe('JhhClientAuthLoginComponent', () => {
  let component: JhhClientAuthLoginComponent;
  let fixture: ComponentFixture<JhhClientAuthLoginComponent>;
  let authFacade: AuthFacade;
  let loginInProgressSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loginInProgressSubject = new BehaviorSubject(false);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        JhhClientAuthLoginComponent,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: AuthFacade,
          useValue: {
            login: jest.fn(),
            loginInProgress$: of(false),
            loginError$: of(null),
          },
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JhhClientAuthLoginComponent);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade);
    authFacade.login = jest.fn().mockReturnValue(of('some_value'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility when the toggle button is clicked', () => {
    const passwordInput = fixture.debugElement.query(
      By.css('#password-input')
    ).nativeElement;
    const toggleButton = fixture.debugElement.query(
      By.css('#password-type-toggle')
    ).nativeElement;
    expect(passwordInput.type).toBe('password');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('text');

    toggleButton.click();
    fixture.detectChanges();
    expect(passwordInput.type).toBe('password');
  });

  it('should call onSubmit and login when the form is valid', () => {
    const authFacade = TestBed.inject(AuthFacade);
    component.formGroup.get(AuthFormFields.Username)?.setValue('username');
    component.formGroup.get(AuthFormFields.Password)?.setValue('password');

    component.onSubmit();

    expect(authFacade.login).toHaveBeenCalledWith('username', 'password');
  });

  it('should disable submit button when login is in progress', () => {
    loginInProgressSubject.next(true);
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should show spinner when login is in progress', async () => {
    component.loginInProgress$ = of(true);
    component.loginError$ = of(null);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });
});