import {
  AfterViewInit,
  Component,
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
import { RouterLink } from '@angular/router';

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
export class RelatedNotesComponent implements AfterViewInit, OnChanges {
  @Input() relatedNotes: Note[];

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

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['relatedNotes']) {
      if (this.swiper) {
        setTimeout(() => {
          this.swiper.update();
        });
      }
    }
  }

  private initializeSwiper() {
    Swiper.use([Navigation]);
    this.swiper = new Swiper('.relatedNotes__swiper', this.config);
  }
}
