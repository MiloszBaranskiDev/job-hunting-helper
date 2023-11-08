import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhh-searchbar-results',
  standalone: true,
  imports: [CommonModule, MatListModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  @Input() results: any[];
  @Input() loading: boolean;
  @Input() searchStarted: boolean;
}
