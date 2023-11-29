import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Note } from '@jhh/shared/interfaces';

import { JhhClientDashboardNoteCardComponent } from '@jhh/jhh-client/dashboard/notes/ui-note-card';

@Component({
  selector: 'jhh-related-notes',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    JhhClientDashboardNoteCardComponent,
  ],
  templateUrl: './related-notes.component.html',
  styleUrls: ['./related-notes.component.scss'],
})
export class RelatedNotesComponent implements OnChanges {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  @Input() relatedNotes: Note[] | null;

  private swiper: Swiper;

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      840: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
    navigation: {
      nextEl: '.relatedNotes__arrow--right',
      prevEl: '.relatedNotes__arrow--left',
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['relatedNotes'] &&
      this.relatedNotes &&
      this.relatedNotes.length > 0
    ) {
      if (this.swiper) {
        this.swiper.destroy(true, true);
      }
      setTimeout(() => {
        this.initializeSwiper();
      });
    }
  }

  trackByFn(index: number, item: Note): string {
    return item.id;
  }

  navigateToRelatedNote(note: Note): void {
    this.router.navigate([''], { skipLocationChange: true }).then(() => {
      this.router.navigate(['../', note.slug], { relativeTo: this.route });
    });
  }

  private initializeSwiper() {
    Swiper.use([Navigation]);
    this.swiper = new Swiper('.relatedNotes__swiper', this.config);
  }
}