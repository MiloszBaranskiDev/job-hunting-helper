import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

import { Note } from '@jhh/shared/interfaces';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';

import { HeaderComponent } from '../../components/header/header.component';
import { ContentComponent } from '../../components/content/content.component';
import { RelatedNotesComponent } from '../../components/related-notes/related-notes.component';
import { ControlsComponent } from '../../components/controls/controls.component';
import { JhhClientDashboardRemoveNoteComponent } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { JhhClientDashboardEditNoteComponent } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { JhhClientDashboardChangeNoteGroupComponent } from '@jhh/jhh-client/dashboard/notes/change-note-group';

@Component({
  selector: 'jhh-note',
  standalone: true,
  imports: [
    CommonModule,
    ContentComponent,
    HeaderComponent,
    RelatedNotesComponent,
    JhhClientDashboardRemoveNoteComponent,
    JhhClientDashboardEditNoteComponent,
    JhhClientDashboardChangeNoteGroupComponent,
    ControlsComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-single-note.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-single-note.component.scss'],
})
export class JhhClientDashboardNotesSingleNoteComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);

  note$: Observable<Note>;

  relatedNotes: Note[] | null;

  ngOnInit(): void {
    this.note$ = combineLatest([
      this.route.params,
      this.route.parent!.params,
    ]).pipe(
      map(([childParams, parentParams]) => ({
        groupSlug: parentParams['groupSlug'],
        noteSlug: childParams['noteSlug'],
      })),
      switchMap((slugs) =>
        this.notesFacade.getNote$BySlugs(slugs.groupSlug, slugs.noteSlug).pipe(
          switchMap((note) => {
            return this.notesFacade
              .getRelatedNotes$(note!)
              .pipe(map((relatedNotes) => ({ ...slugs, note, relatedNotes })));
          })
        )
      ),
      filter((data) => !!data.note),
      tap((data) => {
        const { groupSlug, note } = data;
        this.relatedNotes = data.relatedNotes;
        this.titleService.setTitle(`Note - ${note!.name}`);
        this.notesFacade
          .getNotesGroup$BySlug(groupSlug)
          .pipe(
            map((group) => group!.name),
            first(),
            tap((groupName) => {
              this.breadcrumbsService.updateBreadcrumbLabelByUrl(
                this.router.url.replace(`${'/' + note!.slug}`, ''),
                groupName
              );
              this.breadcrumbsService.updateBreadcrumbLabelByUrl(
                this.router.url,
                note!.name
              );
            })
          )
          .subscribe(() => {});
      }),
      map((data) => data.note)
    ) as Observable<Note>;
  }
}
