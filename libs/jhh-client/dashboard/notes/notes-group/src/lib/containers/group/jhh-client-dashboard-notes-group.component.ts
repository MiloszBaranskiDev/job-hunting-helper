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
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  pluck,
  switchMap,
  tap,
} from 'rxjs';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { QueryParamsService } from '../../services/query-params/query-params.service';
import { BreadcrumbsService } from '@jhh/jhh-client/dashboard/feature-breadcrumbs';

import { Note, NotesGroup } from '@jhh/shared/interfaces';
import { NotesListSort } from '@jhh/jhh-client/dashboard/notes/enums';

import { AddNoteComponent } from '../../components/add-note/add-note.component';
import { NotesListComponent } from '../../components/notes-list/notes-list.component';
import { SortingComponent } from '../../components/sorting/sorting.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { JhhClientDashboardRemoveNoteComponent } from '@jhh/jhh-client/dashboard/notes/remove-note';
import { JhhClientDashboardEditNoteComponent } from '@jhh/jhh-client/dashboard/notes/edit-note';
import { JhhClientDashboardChangeNoteGroupComponent } from '@jhh/jhh-client/dashboard/notes/change-note-group';

@Component({
  selector: 'jhh-notes-group',
  standalone: true,
  imports: [
    CommonModule,
    NotesListComponent,
    AddNoteComponent,
    JhhClientDashboardRemoveNoteComponent,
    JhhClientDashboardEditNoteComponent,
    SortingComponent,
    PaginationComponent,
    JhhClientDashboardChangeNoteGroupComponent,
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
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  group$: Observable<NotesGroup>;
  groupId$: Observable<string>;
  groupSlug$: Observable<string>;
  sortedNotes$: Observable<Note[]>;
  notesListSort$: BehaviorSubject<NotesListSort>;

  totalPages: number;

  ngOnInit(): void {
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
      })
    ) as Observable<NotesGroup>;

    this.groupId$ = this.group$.pipe(pluck('id'));

    this.queryParamsService.updateQueryParams();

    this.notesListSort$ = this.queryParamsService.getCurrentSort$();

    this.sortedNotes$ = combineLatest([
      this.group$.pipe(pluck('notes')),
      this.queryParamsService.getCurrentSort$(),
      this.queryParamsService.getCurrentPage$(),
    ]).pipe(
      tap(([notes]) => {
        this.totalPages = Math.ceil(notes.length / 12);
        this.cdr.detectChanges();
      }),
      map(([notes, sort, currentPage]) => {
        const sortedNotes: Note[] = this.sortNotes(notes, sort);
        const start: number = (currentPage - 1) * 12;
        const end: number = start + 12;
        return sortedNotes.slice(start, end);
      })
    );
  }

  ngOnDestroy(): void {
    this.queryParamsService.clearQueryParams();
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
