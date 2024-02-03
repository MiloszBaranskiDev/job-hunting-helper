import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '@jhh/jhh-client/shared/util-theme';

import { ThemeMode } from '@jhh/jhh-client/shared/domain';

@Component({
  selector: 'jhh-theme-switcher',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatTooltipModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent implements OnInit {
  private readonly themeService: ThemeService = inject(ThemeService);

  currentThemeMode$: BehaviorSubject<ThemeMode>;

  isDarkMode: boolean;

  ngOnInit(): void {
    this.currentThemeMode$ = this.themeService.currentThemeMode$;
    this.currentThemeMode$.subscribe(
      (val): boolean => (this.isDarkMode = val === ThemeMode.Dark)
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
