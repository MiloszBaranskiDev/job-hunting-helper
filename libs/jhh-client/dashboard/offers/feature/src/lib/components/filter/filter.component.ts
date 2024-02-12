import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhh-offers-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnChanges {
  @Input({ required: true }) filterValue: string = '';
  @Output() filterChanged: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterValue'] && !changes['filterValue'].firstChange) {
      this.applyFilter(this.filterValue);
    }
  }

  applyFilter(value: string): void {
    this.filterChanged.emit(value);
  }
}
