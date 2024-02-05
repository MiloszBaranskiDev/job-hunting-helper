import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import zxcvbn from 'zxcvbn';

import { ClientRoute } from '@jhh/jhh-client/shared/domain';
import { RegisterFieldsLength } from '@jhh/shared/domain';
import {
  AuthFormErrorKey,
  AuthFormFields,
  PasswordStrengthClass,
} from '@jhh/jhh-client/auth/domain';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { WhitespaceValidator } from '@jhh/jhh-client/shared/util-whitespace-validator';

function passwordsMatch(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get(AuthFormFields.Password);
  const confirmPasswordControl = group.get(AuthFormFields.ConfirmPassword);

  if (
    passwordControl &&
    confirmPasswordControl &&
    confirmPasswordControl.value !== passwordControl.value
  ) {
    return { confirmPasswordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'jhh-register-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoutes: typeof ClientRoute = ClientRoute;
  readonly registerFieldsLength: typeof RegisterFieldsLength =
    RegisterFieldsLength;
  readonly formFields: typeof AuthFormFields = AuthFormFields;
  readonly formErrorKey: typeof AuthFormErrorKey = AuthFormErrorKey;
  formGroup: FormGroup;
  hidePassword: boolean = true;

  registerInProgress$: Observable<boolean> =
    this.authFacade.registerInProgress$;
  registerError$: Observable<string | null> = this.authFacade.registerError$;

  private _passwordStrength$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  passwordStrength$: Observable<number> =
    this._passwordStrength$.asObservable();

  progressBarClass$: Observable<string> = this.passwordStrength$.pipe(
    map((strength: number) => {
      switch (true) {
        case strength >= 100:
          return PasswordStrengthClass.Strong;
        case strength >= 75:
          return PasswordStrengthClass.Good;
        case strength >= 50:
          return PasswordStrengthClass.Medium;
        case strength >= 25:
          return PasswordStrengthClass.Weak;
        default:
          return PasswordStrengthClass.None;
      }
    })
  );

  ngOnInit(): void {
    this.initFormGroup();
  }

  validatePasswords(): void {
    this.formGroup.updateValueAndValidity();

    const password = this.formGroup.get(this.formFields.Password)?.value;
    const passwordStrength: zxcvbn.ZXCVBNResult = zxcvbn(password);
    const newStrength: number = password
      ? Math.max(25, passwordStrength.score * 25)
      : 0;

    this._passwordStrength$.next(newStrength);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get(this.formFields.Username)?.value;
      const password = this.formGroup.get(this.formFields.Password)?.value;
      const confirmPassword = this.formGroup.get(
        this.formFields.ConfirmPassword
      )?.value;

      this.authFacade
        .register(username, password, confirmPassword)
        .pipe(first());
    }
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        [this.formFields.Username]: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldsLength.MinUsernameLength),
            Validators.maxLength(RegisterFieldsLength.MaxUsernameLength),
            WhitespaceValidator,
          ],
        ],
        [this.formFields.Password]: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldsLength.MinPasswordLength),
            Validators.maxLength(RegisterFieldsLength.MaxPasswordLength),
            WhitespaceValidator,
          ],
        ],
        [this.formFields.ConfirmPassword]: [''],
      },
      { validators: [passwordsMatch] }
    );
  }
}