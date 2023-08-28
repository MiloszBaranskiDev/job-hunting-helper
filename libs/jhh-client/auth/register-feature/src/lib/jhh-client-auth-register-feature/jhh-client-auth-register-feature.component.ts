import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { JhhClientAuthUiTemplateComponent } from '@jhh/jhh-client/auth/ui-template';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  ],
  templateUrl: './jhh-client-auth-register-feature.component.html',
  styleUrls: ['./jhh-client-auth-register-feature.component.scss'],
})
export class JhhClientAuthRegisterFeatureComponent implements OnInit {
  formBuilder: FormBuilder = inject(FormBuilder);

  formGroup: FormGroup;
  hidePassword: boolean = true;

  // toggle register/login route
  // TODO: password strength
  // TODO: trim, required, min/max length before sending request (DISABLE BUTTON)
  // TODO: loader
  // TODO: handle server error

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: [''],
      password: [''],
      confirmPassword: [''],
      showPassword: [false],
    });
  }
}
