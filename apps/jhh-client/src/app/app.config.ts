import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AuthInterceptor } from '@jhh/jhh-client/auth/shell';

import { AuthFacade } from '@jhh/jhh-client/auth/data-access';
import { DashboardFacade } from '@jhh/jhh-client/dashboard/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthFacade,
    DashboardFacade,
    provideEffects(),
    provideStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    MatSnackBar,
  ],
};
