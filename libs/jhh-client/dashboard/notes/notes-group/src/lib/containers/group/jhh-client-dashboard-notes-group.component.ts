import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  pluck,
  switchMap,
  tap,
} from 'rxjs';

import {
  NotesFacade,
  QueryParamsService,
} from '@jhh/jhh-client/dashboard/notes/data-access';
import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';
import { TitleService } from '@jhh/jhh-client/dashboard/feature-title';

import { Note, NotesGroup } from '@jhh/shared/interfaces';
import { NotesListSort } from '../../enums/notes-list-sort';

import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { JhhClientDashboardRemoveNoteComponent } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { JhhClientDashboardEditNoteComponent } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { JhhClientDashboardChangeNoteGroupComponent } from '@jhh/jhh-client/dashboard/notes/change-note-group';
import { JhhClientDashboardRemoveNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/remove-group';
import { JhhClientDashboardEditNotesGroupComponent } from '@jhh/jhh-client/dashboard/notes/edit-group';
import { JhhClientDashboardSearchbarComponent } from '@jhh/jhh-client/dashboard/feature-searchbar';
import { JhhClientDashboardNotesSortingComponent } from '@jhh/jhh-client/dashboard/notes/feature-sorting';
import { JhhClientDashboardNotesPaginationComponent } from '@jhh/jhh-client/dashboard/notes/feature-pagination';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    NotesListComponent,
    AddNoteComponent,
    MenuComponent,
    JhhClientDashboardRemoveNoteComponent,
    JhhClientDashboardEditNoteComponent,
    JhhClientDashboardChangeNoteGroupComponent,
    JhhClientDashboardRemoveNotesGroupComponent,
    JhhClientDashboardEditNotesGroupComponent,
    JhhClientDashboardSearchbarComponent,
    JhhClientDashboardNotesSortingComponent,
    JhhClientDashboardNotesPaginationComponent,
  ],
  templateUrl: './jhh-client-dashboard-notes-group.component.html',
  styleUrls: ['./jhh-client-dashboard-notes-group.component.scss'],
})
export class JhhClientDashboardNotesGroupComponent
  implements OnInit, OnDestroy
{
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly queryParamsService: QueryParamsService =
    inject(QueryParamsService);
  private readonly breadcrumbsService: BreadcrumbsService =
    inject(BreadcrumbsService);
  private readonly titleService: TitleService = inject(TitleService);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  groupSlug$: Observable<string>;
  group$: Observable<NotesGroup>;
  sortedNotes$: Observable<Note[]>;

  readonly sortOptionsValues: string[] = Object.values(NotesListSort);
  readonly notesPerPage: number = 16;
  totalPages: number;

  ngOnInit(): void {
    this.queryParamsService.setFromCurrentRoute();

    this.groupSlug$ = this.route.params.pipe(
      pluck('groupSlug')
    ) as Observable<string>;

    this.group$ = this.groupSlug$.pipe(
      switchMap((slug: string) => this.notesFacade.getNotesGroup$BySlug(slug)),
      filter((group): group is NotesGroup => !!group),
      tap((group) => {
        this.breadcrumbsService.updateBreadcrumbLabelByUrl(
          this.router.url.split('?')[0],
          group.name
        );
        this.titleService.setTitle(`Notes - ${group.name}`);
      })
    ) as Observable<NotesGroup>;

    this.queryParamsService.updateQueryParams();

    this.getSortedNotes();
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
  }

  searchNotes = (query: string): Observable<Note[] | null> => {
    return this.group$.pipe(
      first(),
      filter((group) => !!group),
      switchMap((group) =>
        this.notesFacade.searchNotes$ByNameAndGroupId(query, group.id)
      )
    );
  };

  private getSortedNotes(): void {
    this.sortedNotes$ = combineLatest([
      this.group$.pipe(pluck('notes')),
      this.queryParamsService.getCurrentSort$(),
      this.queryParamsService.getCurrentPage$(),
    ]).pipe(
      tap(([notes]) => {
        this.totalPages = Math.ceil(notes.length / this.notesPerPage);

        const currentPage: number = this.queryParamsService
          .getCurrentPage$()
          .getValue();
        const start: number = (currentPage - 1) * this.notesPerPage;
        if (notes.length <= start && currentPage > 1) {
          this.queryParamsService.updateCurrentPage(currentPage - 1);
        }

        this.cdr.detectChanges();
      }),
      map(([notes]) => {
        const currentPage: number = this.queryParamsService
          .getCurrentPage$()
          .getValue();
        const currentSort: string = this.queryParamsService
          .getCurrentSort$()
          .getValue();
        const sortedNotes: Note[] = this.sortNotes(
          notes,
          currentSort as NotesListSort
        );
        const start: number = (currentPage - 1) * this.notesPerPage;
        const end: number = start + this.notesPerPage;
        return sortedNotes.slice(start, end);
      })
    );
  }

  private sortNotes(notes: Note[], sort: NotesListSort): Note[] {
    switch (sort) {
      case NotesListSort.Latest:
        return notes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      case NotesListSort.LastEdited:
        return notes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      case NotesListSort.AlphabeticalAsc:
        return notes.slice().sort((a, b) => a.name.localeCompare(b.name));
      case NotesListSort.AlphabeticalDesc:
        return notes
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse();
      default:
        return notes;
    }
  }
}
