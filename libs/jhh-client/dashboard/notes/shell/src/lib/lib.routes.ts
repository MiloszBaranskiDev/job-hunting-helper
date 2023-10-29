import { Route } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { ClientRoute } from '@jhh/jhh-client/shared/enums';

import { JhhClientDashboardNotesShellComponent } from './containers/shell/jhh-client-dashboard-notes-shell.component';

import {
  NOTES_STATE_KEY,
  NotesEffects,
  notesReducer,
} from '@jhh/jhh-client/dashboard/notes/data-access';

export const JhhClientDashboardNotesShellRoutes: Route = {
  path: '',
  component: JhhClientDashboardNotesShellComponent,
  providers: [
    provideState(NOTES_STATE_KEY, notesReducer),
    provideEffects(NotesEffects),
  ],
  children: [
    {
      path: ClientRoute.Notes,
      title: 'Notes',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/notes/notes-groups').then(
              (c) => c.JhhClientDashboardNotesGroupsComponent
            ),
        },
        {
          path: ':groupSlug',
          title: 'Group',
          loadComponent: () =>
            import('@jhh/jhh-client/dashboard/notes/notes-group').then(
              (c) => c.JhhClientDashboardNotesGroupOutletComponent
            ),
          children: [
            {
              path: '',
              loadComponent: () =>
                import('@jhh/jhh-client/dashboard/notes/notes-group').then(
                  (c) => c.JhhClientDashboardNotesGroupComponent
                ),
            },
            {
              path: ':noteSlug',
              title: 'Note details',
              loadComponent: () =>
                import('@jhh/jhh-client/dashboard/notes/single-note').then(
                  (c) => c.JhhClientDashboardNotesSingleNoteComponent
                ),
            },
          ],
        },
      ],
    },
  ],
};
