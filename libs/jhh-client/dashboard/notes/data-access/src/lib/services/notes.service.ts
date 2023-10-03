import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
  AddNotesGroupSuccessResponse,
  RemoveNotePayload,
  RemoveNoteSuccessPayload,
  RemoveNoteSuccessResponse,
} from '@jhh/jhh-client/dashboard/notes/interfaces';
import { ApiRoutes } from '@jhh/shared/enums';

import { environment } from '@jhh/jhh-client/shared/config';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoutes.BaseProtected;

  addNotesGroup(
    payload: AddNotesGroupPayload
  ): Observable<AddNotesGroupSuccessPayload> {
    return this.http
      .post<AddNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoutes.NotesGroups,
        {
          name: payload.name,
        }
      )
      .pipe(map((res: AddNotesGroupSuccessResponse) => res.data));
  }

  removeNote(payload: RemoveNotePayload): Observable<RemoveNoteSuccessPayload> {
    return this.http
      .delete<RemoveNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoutes.Notes,
        {
          params: { noteId: payload.noteId },
        }
      )
      .pipe(map((res: RemoveNoteSuccessResponse) => res.data));
  }
}
