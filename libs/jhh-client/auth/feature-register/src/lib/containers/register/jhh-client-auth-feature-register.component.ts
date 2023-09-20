import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, first, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import zxcvbn from 'zxcvbn';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';

import { WhitespaceValidator } from '@jhh/jhh-client/shared/util-whitespace-validator';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';
import { RegisterFieldsLength } from '@jhh/shared/enums';
import { FormFields } from '../../enums/form-fields';
import { StrengthClass } from '../../enums/strength-class';
import { FormErrorKey } from '../../enums/form-error-key';

function passwordsMatch(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get(FormFields.Password);
  const confirmPasswordControl = group.get(FormFields.ConfirmPassword);

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
  selector: 'jhh-register-feature',
  standalone: true,
  imports: [
    CommonModule,
    JhhClientAuthUiTemplateComponent,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './jhh-client-auth-feature-register.component.html',
  styleUrls: ['./jhh-client-auth-feature-register.component.scss'],
})
export class JhhClientAuthFeatureRegisterComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoutes: typeof ClientRoute = ClientRoute;
  readonly registerFieldsLength: typeof RegisterFieldsLength =
    RegisterFieldsLength;
  readonly formFields: typeof FormFields = FormFields;
  readonly formErrorKey: typeof FormErrorKey = FormErrorKey;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  registerInProgress$: Observable<boolean> =
    this.authFacade.registerInProgress$;

  registerError$: Observable<string | null> = this.authFacade.registerError$;

  passwordStrengthSubject: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  passwordStrength$: Observable<number> =
    this.passwordStrengthSubject.asObservable();

  progressBarClass$: Observable<string> = this.passwordStrength$.pipe(
    map((strength: number) => {
      switch (true) {
        case strength >= 100:
          return StrengthClass.Strong;
        case strength >= 75:
          return StrengthClass.Good;
        case strength >= 50:
          return StrengthClass.Medium;
        case strength >= 25:
          return StrengthClass.Weak;
        default:
          return StrengthClass.None;
      }
    })
  );

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldsLength.MinUsernameLength),
            Validators.maxLength(RegisterFieldsLength.MaxUsernameLength),
            WhitespaceValidator,
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(RegisterFieldsLength.MinPasswordLength),
            Validators.maxLength(RegisterFieldsLength.MaxPasswordLength),
            WhitespaceValidator,
          ],
        ],
        confirmPassword: [''],
        showPassword: [false],
      },
      { validators: [passwordsMatch] }
    );
  }

  validatePasswords(): void {
    this.formGroup.updateValueAndValidity();

    const password = this.formGroup.get(FormFields.Password)?.value;
    const passwordStrength: zxcvbn.ZXCVBNResult = zxcvbn(password);
    const newStrength: number = password
      ? Math.max(25, passwordStrength.score * 25)
      : 0;

    this.passwordStrengthSubject.next(newStrength);
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get(FormFields.Username)?.value;
      const password = this.formGroup.get(FormFields.Password)?.value;
      const confirmPassword = this.formGroup.get(
        FormFields.ConfirmPassword
      )?.value;

      this.authFacade
        .register(username, password, confirmPassword)
        .pipe(first());
    }
  }
}
