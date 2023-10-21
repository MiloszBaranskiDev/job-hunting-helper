import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AddNotePayload,
  AddNotesGroupPayload,
  AddNotesGroupSuccessPayload,
  AddNotesGroupSuccessResponse,
  AddNoteSuccessPayload,
  AddNoteSuccessResponse,
  EditNotePayload,
  EditNoteSuccessPayload,
  EditNoteSuccessResponse,
  RemoveNotePayload,
  RemoveNoteSuccessPayload,
  RemoveNoteSuccessResponse,
} from '@jhh/jhh-client/dashboard/notes/interfaces';
import { ApiRoute } from '@jhh/shared/enums';

import { environment } from '@jhh/jhh-client/shared/config';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly API_DASHBOARD_URL: string =
    environment.apiUrl + ApiRoute.BaseProtected;

  addNotesGroup(
    payload: AddNotesGroupPayload
  ): Observable<AddNotesGroupSuccessPayload> {
    return this.http
      .post<AddNotesGroupSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.AddNotesGroup,
        {
          name: payload.name,
        }
      )
      .pipe(map((res: AddNotesGroupSuccessResponse) => res.data));
  }

  addNote(payload: AddNotePayload): Observable<AddNoteSuccessPayload> {
    return this.http
      .post<AddNoteSuccessResponse>(this.API_DASHBOARD_URL + ApiRoute.AddNote, {
        name: payload.name,
        content: payload.content,
        groupId: payload.groupId,
      })
      .pipe(map((res: AddNoteSuccessResponse) => res.data));
  }

  editNote(payload: EditNotePayload): Observable<EditNoteSuccessPayload> {
    return this.http
      .put<EditNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.EditNote,
        {
          noteId: payload.noteId,
          name: payload.name,
          content: payload.content,
          groupId: payload.groupId,
        }
      )
      .pipe(map((res: EditNoteSuccessResponse) => res.data));
  }

  removeNote(payload: RemoveNotePayload): Observable<RemoveNoteSuccessPayload> {
    return this.http
      .delete<RemoveNoteSuccessResponse>(
        this.API_DASHBOARD_URL + ApiRoute.RemoveNote,
        {
          params: { noteId: payload.noteId },
        }
      )
      .pipe(map((res: RemoveNoteSuccessResponse) => res.data));
  }
}
