import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';

@Component({
  selector: 'jhh-board-columns',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
})
export class ColumnsComponent {
  columns: BoardColumn[] = [
    {
      id: '1',
      name: 'Todo',
      color: '#e55039',
      items: [
        { id: '1', content: 'Get to work' },
        {
          id: '2',
          content: 'Pick up groceries',
        },
        {
          id: '3',
          content: 'Go home',
        },
        {
          id: '4',
          content: 'Fall asleep',
        },
      ],
    },
    {
      id: '2',
      name: 'Done',
      color: '#6ab04c',
      items: [
        { id: '1', content: 'Get up' },
        {
          id: '2',
          content: 'Brush teeth',
        },
        {
          id: '3',
          content: 'Take a shower',
        },
        {
          id: '4',
          content: 'Check e-mail',
        },
        {
          id: '5',
          content: 'Walk dog',
        },
      ],
    },
  ];

  drop(event: CdkDragDrop<BoardColumnItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  trackByFn(index: number, item: BoardColumn | BoardColumnItem): string {
    return item.id;
  }
}
