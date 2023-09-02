import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { first, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { WhitespaceValidator } from '@jhh/jhh-client/shared/util';
import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';
import { RegisterFieldsLength } from '@jhh/shared/enums';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export function passwordsMatch(group: FormGroup): ValidationErrors | null {
  const passwordControl = group.get('password');
  const confirmPasswordControl = group.get('confirmPassword');

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
  ],
  providers: [AuthFacade],
  templateUrl: './jhh-client-auth-register-feature.component.html',
  styleUrls: ['./jhh-client-auth-register-feature.component.scss'],
})
export class JhhClientAuthRegisterFeatureComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoutes: typeof ClientRoutes = ClientRoutes;
  readonly registerFieldsLength: typeof RegisterFieldsLength =
    RegisterFieldsLength;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  registerInProgress$: Observable<boolean> =
    this.authFacade.registerInProgress$;
  registerError$: Observable<string | null> = this.authFacade.registerError$;

  ngOnInit() {
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
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get('username')?.value;
      const password = this.formGroup.get('password')?.value;
      const confirmPassword = this.formGroup.get('confirmPassword')?.value;
      this.authFacade
        .register(username, password, confirmPassword)
        .pipe(first());
    }
  }
}
