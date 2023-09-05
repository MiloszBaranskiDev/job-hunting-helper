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
import { WhitespaceValidator } from '@jhh/jhh-client/shared/util';
import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';
import { RegisterFieldsLength } from '@jhh/shared/enums';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum FormFields {
  Username = 'username',
  Password = 'password',
  ConfirmPassword = 'confirmPassword',
}

enum StrengthClass {
  Strong = 'strength-100',
  Good = 'strength-75',
  Medium = 'strength-50',
  Weak = 'strength-25',
  None = '',
}

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
  templateUrl: './jhh-client-auth-register-feature.component.html',
  styleUrls: ['./jhh-client-auth-register-feature.component.scss'],
})
export class JhhClientAuthRegisterFeatureComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoutes: typeof ClientRoutes = ClientRoutes;
  readonly formFields: typeof FormFields = FormFields;
  readonly registerFieldsLength: typeof RegisterFieldsLength =
    RegisterFieldsLength;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  registerInProgress$: Observable<boolean> =
    this.authFacade.registerInProgress$;

  registerError$: Observable<string | null> = this.authFacade.registerError$;

  private passwordStrengthSubject: BehaviorSubject<number> =
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

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
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

  validatePasswords() {
    this.formGroup.updateValueAndValidity();

    const password = this.formGroup.get(FormFields.Password)?.value;
    const passwordStrength = zxcvbn(password);
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
