import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

interface Icon {
  svgSrc: string;
  name: string;
  link: string;
}

@Component({
  selector: 'jhh-auth-ui-template',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './jhh-client-auth-ui-template.component.html',
  styleUrls: ['./jhh-client-auth-ui-template.component.scss'],
})
export class JhhClientAuthUiTemplateComponent implements OnInit {
  private readonly matIconRegistry: MatIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer: DomSanitizer = inject(DomSanitizer);

  @Input() heading!: string;

  icons: Icon[] = [
    {
      svgSrc: 'assets/icons/github.svg',
      name: 'github',
      link: 'https://github.com/MiloszBaranskiDev/job-hunting-helper',
    },
    {
      svgSrc: 'assets/icons/linkedin.svg',
      name: 'linkedin',
      link: 'https://www.linkedin.com/in/mi%C5%82osz-bara%C5%84ski-8617721b1/',
    },
    {
      svgSrc: 'assets/icons/email.svg',
      name: 'email',
      link: 'https://miloszbaranskidev.github.io/my-website/',
    },
  ];

  private registerIcons(): void {
    this.icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.svgSrc)
      );
    });
  }

  ngOnInit() {
    this.registerIcons();
  }
}
