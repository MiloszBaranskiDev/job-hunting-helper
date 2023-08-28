import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ClientRoutes } from '@jhh/jhh-client/shared/enums';

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
  ],
  templateUrl: './jhh-client-auth-login-feature.component.html',
  styleUrls: ['./jhh-client-auth-login-feature.component.scss'],
})
export class JhhClientAuthLoginFeatureComponent implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  readonly clientRoutes: typeof ClientRoutes = ClientRoutes;

  formGroup: FormGroup;
  hidePassword: boolean = true;

  // TODO: trim, required, min/max length (from shared enum) before sending request (DISABLE BUTTON)
  // TODO: loader
  // TODO: handle server error

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: [''],
      password: [''],
      showPassword: [false],
    });
  }
}
