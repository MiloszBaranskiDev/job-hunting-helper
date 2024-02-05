import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ThemeService } from '@jhh/jhh-client/shared/util-theme';

import { ThemeMode } from '@jhh/jhh-client/shared/domain';

interface Icon {
  svgSrc: string;
  name: string;
  tooltip: string;
  link: string;
}

@Component({
  selector: 'jhh-auth-ui-template',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './jhh-client-auth-ui-template.component.html',
  styleUrls: ['./jhh-client-auth-ui-template.component.scss'],
})
export class JhhClientAuthUiTemplateComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly matIconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);
  private readonly themeService: ThemeService = inject(ThemeService);

  @Input() heading: string;

  currentThemeMode$: BehaviorSubject<ThemeMode>;

  isDarkMode: boolean;
  icons: Icon[] = [
    {
      svgSrc: 'assets/icons/github.svg',
      name: 'github',
      tooltip: 'GitHub',
      link: 'https://github.com/MiloszBaranskiDev/job-hunting-helper',
    },
    {
      svgSrc: 'assets/icons/linkedin.svg',
      name: 'linkedin',
      tooltip: 'Linkedin',
      link: 'https://www.linkedin.com/in/mi%C5%82osz-bara%C5%84ski-8617721b1/',
    },
    {
      svgSrc: 'assets/icons/email.svg',
      name: 'email',
      tooltip: 'Contact',
      link: 'https://miloszbaranskidev.github.io/my-website/',
    },
  ];

  ngOnInit(): void {
    this.registerIcons();
    this.currentThemeMode$ = this.themeService.currentThemeMode$;
    this.currentThemeMode$
      .pipe(
        tap((val) => {
          this.isDarkMode = val === ThemeMode.Dark;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  private registerIcons(): void {
    this.icons.forEach((icon: Icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.svgSrc)
      );
    });
  }
}
