import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { first, Observable } from 'rxjs';
import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';
import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

enum FormFields {
  Username = 'username',
  Password = 'password',
}

@Component({
  selector: 'jhh-login-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    JhhClientAuthUiTemplateComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './jhh-client-auth-login-feature.component.html',
  styleUrls: ['./jhh-client-auth-login-feature.component.scss'],
})
export class JhhClientAuthLoginFeatureComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly authFacade: AuthFacade = inject(AuthFacade);

  readonly clientRoutes: typeof ClientRoutes = ClientRoutes;
  readonly formFields: typeof FormFields = FormFields;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  loginInProgress$: Observable<boolean> = this.authFacade.loginInProgress$;
  loginError$: Observable<string | null> = this.authFacade.loginError$;

  ngOnInit(): void {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      showPassword: [false],
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const username = this.formGroup.get(FormFields.Username)?.value;
      const password = this.formGroup.get(FormFields.Password)?.value;

      this.authFacade.login(username, password).pipe(first());
    }
  }
}
