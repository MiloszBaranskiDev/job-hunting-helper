import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

import { Note } from '@jhh/shared/interfaces';
import { Router, RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'jhh-related-notes',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    MatDividerModule,
  ],
  templateUrl: './related-notes.component.html',
  styleUrls: ['./related-notes.component.scss'],
})
export class RelatedNotesComponent implements OnInit, AfterViewInit {
  private readonly router: Router = inject(Router);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);

  @Input() note: Note;

  relatedNotes$: Observable<Note[]>;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      960: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    navigation: {
      nextEl: '.relatedNotes__arrow--right',
      prevEl: '.relatedNotes__arrow--left',
    },
  };

  ngOnInit(): void {
    this.relatedNotes$ = this.notesFacade.getRelatedNotes$(this.note);
  }

  ngAfterViewInit(): void {
    Swiper.use([Navigation]);
    new Swiper('.relatedNotes__swiper', this.config);
  }

  getLink(relatedNoteSlug: string): string {
    return this.router.url.replace(this.note.slug, relatedNoteSlug);
  }
}
