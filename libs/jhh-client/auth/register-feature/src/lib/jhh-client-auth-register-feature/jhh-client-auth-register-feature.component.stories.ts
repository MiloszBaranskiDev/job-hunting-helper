import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, of, take, tap, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';

import { JhhStorybookAuthContainerComponent } from '@jhh/jhh-client/storybook-host';
import { JhhClientAuthRegisterFeatureComponent } from './jhh-client-auth-register-feature.component';

const mockActivatedRoute = {
  params: new BehaviorSubject<any>({}),
  snapshot: {
    params: {},
  },
};

class MockAuthFacade {
  private registerInProgressSubject = new BehaviorSubject<boolean>(false);
  registerInProgress$ = this.registerInProgressSubject.asObservable();
  registerError$ = of(null);

  register() {
    this.registerInProgressSubject.next(true);

    timer(1500)
      .pipe(
        take(1),
        tap(() => this.registerInProgressSubject.next(false))
      )
      .subscribe();
  }
}

export default {
  title: '/Views/Auth/Register',
  component: JhhClientAuthRegisterFeatureComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        HttpClientModule,
        BrowserAnimationsModule,
        JhhClientAuthRegisterFeatureComponent,
        JhhStorybookAuthContainerComponent,
      ],
      providers: [
        { provide: AuthFacade, useClass: MockAuthFacade },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        MatIconRegistry,
        FormBuilder,
      ],
    }),
  ],
} as Meta;

const Template: Story<JhhClientAuthRegisterFeatureComponent> = (
  args: JhhClientAuthRegisterFeatureComponent
) => ({
  component: JhhClientAuthRegisterFeatureComponent,
  props: args,
  template: `
    <jhh-storybook-auth-container>
       <jhh-register-feature></jhh-register-feature>
    </jhh-storybook-auth-container>
  `,
});

export const Default = Template.bind({});
Default.args = {};
