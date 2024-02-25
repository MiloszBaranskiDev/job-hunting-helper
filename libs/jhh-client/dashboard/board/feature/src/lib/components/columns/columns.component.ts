import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragMove,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { animate, style, transition, trigger } from '@angular/animations';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

import { ClickOutsideDirective } from '@jhh/jhh-client/shared/util-click-outside';

import { ColumnMenuComponent } from '../column-menu/column-menu.component';

import {
  BoardColumn,
  BoardColumnFieldLength,
  BoardColumnItem,
  LocalStorageKey,
} from '@jhh/shared/domain';

@Component({
  selector: 'jhh-board-columns',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ColumnMenuComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ClickOutsideDirective,
    CdkDragHandle,
  ],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
})
export class ColumnsComponent implements OnInit, OnDestroy {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @ViewChild('horizontalScrollContainer')
  private readonly horizontalScrollContainer: ElementRef;
  @Input({ required: true }) isSaving$: BehaviorSubject<boolean>;
  @Input({ required: true })
  wasUpdateTriggeredByColumnsComponent$: BehaviorSubject<boolean>;

  @Input({ required: true }) set columns(value: BoardColumn[]) {
    this.originalColumns = value;
    this.mergeWithWorkingData(value);
  }

  private updateSubject: Subject<void> = new Subject<void>();
  private originalColumns: BoardColumn[];
  private removedItemIds: string[] = [];
  private isItemBeingDragged: boolean = false;
  readonly boardColumnFieldLength: typeof BoardColumnFieldLength =
    BoardColumnFieldLength;

  _columns: BoardColumn[] = [];
  editingItem: { [key: string]: boolean } = {};
  editableContent: { [key: string]: string } = {};

  updateBoardColumnsInProgress$: Observable<boolean>;
  updateBoardColumnsError$: Observable<string | null>;
  updateBoardColumnsSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  ngOnInit(): void {
    this.updateBoardColumnsInProgress$ =
      this.boardFacade.updateBoardColumnsInProgress$;
    this.updateBoardColumnsError$ = this.boardFacade.updateBoardColumnsError$;
    this.updateBoardColumnsSuccess$ =
      this.boardFacade.updateBoardColumnsSuccess$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        tap(() => {
          this.saveChanges();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.updateSubject
      .pipe(
        debounceTime(8000),
        filter(() => !this.isAnyItemInEditMode() && !this.isItemBeingDragged),
        tap(() => {
          this.saveChanges();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    window.addEventListener('beforeunload', this.handleAppClose);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleAppClose);
  }

  get connectedDropLists(): string[] {
    return this._columns.map((column) => 'drop-list-' + column.id);
  }

  trackByFn(index: number, item: BoardColumn | BoardColumnItem): string {
    return item.id;
  }

  dragStarted(): void {
    this.isItemBeingDragged = true;
  }

  dragEnded(): void {
    this.isItemBeingDragged = false;
  }

  dragMoved(event: CdkDragMove, columnEl?: HTMLDivElement): void {
    this.scrollHorizontal(event);
    if (columnEl) {
      this.scrollVertical(event, columnEl);
    }
  }

  dropColumn(event: CdkDragDrop<BoardColumn[]>): void {
    if (event.previousContainer === event.container) {
      const columnsClone: BoardColumn[] = [...this._columns];

      moveItemInArray(columnsClone, event.previousIndex, event.currentIndex);

      this._columns = columnsClone.map((column, index) => ({
        ...column,
        order: index,
      }));

      this.updateSubject.next();
    }
  }

  dropItem(event: CdkDragDrop<BoardColumnItem[]>): void {
    const previousColumnIndex: number = this._columns.findIndex(
      (c) => c.items === event.previousContainer.data
    );
    const currentColumnIndex: number = this._columns.findIndex(
      (c) => c.items === event.container.data
    );
    const columnsClone: BoardColumn[] = this._columns.map((col) => ({
      ...col,
      items: [...col.items],
    }));

    if (event.previousContainer === event.container) {
      moveItemInArray(
        columnsClone[currentColumnIndex].items,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        columnsClone[previousColumnIndex].items,
        columnsClone[currentColumnIndex].items,
        event.previousIndex,
        event.currentIndex
      );
    }

    this._columns = columnsClone.map((column) => ({
      ...column,
      items: column.items.map((item, index) => ({
        ...item,
        order: index,
      })),
    }));

    this.updateSubject.next();
  }

  addItem(columnId: string): void {
    const newItem: BoardColumnItem = {
      id: `temp-${Date.now()}`,
      createdAt: null as any,
      updatedAt: null as any,
      content: 'New item',
      order: this._columns!.find((c) => c.id === columnId)!.items.length,
      columnId: columnId,
    };

    this._columns = this._columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          items: [...column.items, newItem],
        };
      }
      return column;
    });

    this.editingItem[newItem.id] = true;
    this.editableContent[newItem.id] = newItem.content;

    this.updateSubject.next();
    setTimeout(() => this.scrollColumnToBottom(columnId), 0);
  }

  startEdit(itemId: string, content: string): void {
    this.editingItem[itemId] = true;
    this.editableContent[itemId] = content;
  }

  handleBlur(item: BoardColumnItem): void {
    const updatedContent: string = this.editableContent[item.id];
    let contentChanged: boolean = false;

    if (item.content !== updatedContent) {
      this._columns = this._columns.map((column) => {
        if (column.id === item.columnId) {
          const updatedItems: BoardColumnItem[] = column.items.map((i) =>
            i.id === item.id ? { ...i, content: updatedContent } : i
          );
          return { ...column, items: updatedItems };
        }
        return column;
      });
      contentChanged = true;
    }

    this.editingItem[item.id] = false;

    if (contentChanged || !this.isAnyItemInEditMode()) {
      this.updateSubject.next();
    }
  }

  removeItem(columnId: string, itemId: string): void {
    this._columns = this._columns.map((column) => {
      if (column.id === columnId) {
        const itemToRemove: BoardColumnItem | undefined = column.items.find(
          (item) => item.id === itemId
        );
        if (itemToRemove && !itemToRemove.id.startsWith('temp-')) {
          this.removedItemIds.push(itemToRemove.id);
        }
        return {
          ...column,
          items: column.items.filter((item) => item.id !== itemId),
        };
      }
      return column;
    });

    this.updateSubject.next();
  }

  fetchItemsForColumn(columnId: string): BoardColumnItem[] {
    return this._columns.find((column) => column.id === columnId)?.items || [];
  }

  private saveChanges(): void {
    const updatedColumns: BoardColumn[] = this.getOnlyUpdatedColumns();

    if (updatedColumns.length || this.removedItemIds.length) {
      this.isSaving$.next(true);

      const savingSnackBar: MatSnackBarRef<TextOnlySnackBar> =
        this.snackBar.open('Saving data...', 'Close');

      this.boardFacade.updateBoardColumns(updatedColumns, this.removedItemIds);

      this.updateBoardColumnsSuccess$
        .pipe(
          filter((success) => success),
          tap(() => {
            this.removedItemIds = [];
            savingSnackBar.dismiss();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();

      this.updateBoardColumnsError$
        .pipe(
          filter((error) => error !== null),
          tap(() => {
            savingSnackBar.dismiss();
            this.snackBar.open(
              'Something went wrong with saving data.',
              'Close',
              {
                duration: 7000,
              }
            );
            this.removedItemIds = [];
            this._columns = JSON.parse(JSON.stringify(this.originalColumns));
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  private handleAppClose = (): string | void => {
    const updatedColumns: BoardColumn[] = this.getOnlyUpdatedColumns();

    if (updatedColumns.length || this.removedItemIds.length) {
      const unsavedBoardRequestId: string = String(Date.now());
      localStorage.setItem(
        LocalStorageKey.UnsavedBoardRequestId,
        unsavedBoardRequestId
      );
      this.boardFacade.updateBoardColumns(
        updatedColumns,
        this.removedItemIds,
        unsavedBoardRequestId
      );
    }
  };

  private isAnyItemInEditMode(): boolean {
    return Object.values(this.editingItem).some((value) => value);
  }

  private getOnlyUpdatedColumns(): BoardColumn[] {
    const updatedColumns: BoardColumn[] = [];

    const originalItemDetails: Map<
      string,
      { originalOrder: number; originalColumnId: string }
    > = new Map<string, { originalOrder: number; originalColumnId: string }>();

    this.originalColumns.forEach((column) => {
      column.items.forEach((item, index) => {
        originalItemDetails.set(item.id, {
          originalOrder: index,
          originalColumnId: column.id,
        });
      });
    });

    this._columns.forEach((column) => {
      const originalColumn: BoardColumn | undefined = this.originalColumns.find(
        (oc) => oc.id === column.id
      );
      let columnUpdated: boolean = false;

      const updatedColumn: Partial<BoardColumn> = {
        id: column.id,
        items: [],
      };

      if (originalColumn) {
        if (column.name !== originalColumn.name) {
          updatedColumn.name = column.name;
          columnUpdated = true;
        }

        if (column.color !== originalColumn.color) {
          updatedColumn.color = column.color;
          columnUpdated = true;
        }

        if (column.order !== originalColumn.order) {
          updatedColumn.order = column.order;
          columnUpdated = true;
        }
      }

      column.items.forEach((item, index) => {
        const originalItem: BoardColumnItem | undefined =
          originalColumn?.items.find((oi) => oi.id === item.id);
        const originalDetails:
          | {
              originalOrder: number;
              originalColumnId: string;
            }
          | undefined = originalItemDetails.get(item.id);

        if (
          !originalItem ||
          (originalItem && item.content !== originalItem.content) ||
          (originalDetails &&
            (originalDetails.originalOrder !== index ||
              originalDetails.originalColumnId !== column.id))
        ) {
          updatedColumn.items!.push(item);
          columnUpdated = true;
        }
      });

      if (
        originalColumn &&
        originalColumn.items.length !== column.items.length
      ) {
        columnUpdated = true;
      }

      if (columnUpdated) {
        updatedColumns.push(updatedColumn as BoardColumn);
      }
    });

    return updatedColumns;
  }

  private mergeWithWorkingData(newData: BoardColumn[]): void {
    if (this.wasUpdateTriggeredByColumnsComponent$.getValue()) {
      this._columns = newData;
    } else {
      const newDataIds: Set<string> = new Set(
        newData.map((column) => column.id)
      );
      const existingColumnsMap: Map<string, BoardColumn> = new Map(
        this._columns.map((column) => [column.id, column])
      );

      const mergedColumns: BoardColumn[] = [];

      newData.forEach((newColumn) => {
        const existingColumn: BoardColumn | undefined = existingColumnsMap.get(
          newColumn.id
        );
        if (existingColumn) {
          mergedColumns.push({
            ...existingColumn,
            name: newColumn.name,
            color: newColumn.color,
          });
          existingColumnsMap.delete(newColumn.id);
        } else {
          mergedColumns.push(newColumn);
        }
      });

      this._columns.forEach((column) => {
        if (existingColumnsMap.has(column.id)) {
          mergedColumns.push(column);
        }
      });

      this._columns = mergedColumns.filter((column) =>
        newDataIds.has(column.id)
      );
    }

    this.wasUpdateTriggeredByColumnsComponent$.next(false);
  }

  private scrollColumnToBottom(columnId: string): void {
    const columnElement =
      this.horizontalScrollContainer.nativeElement.querySelector(
        `#drop-list-${columnId}`
      );
    if (columnElement) {
      columnElement.scrollTop = columnElement.scrollHeight;
    }
  }

  private scrollHorizontal(event: CdkDragMove): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds =
      this.horizontalScrollContainer.nativeElement.getBoundingClientRect();
    const edgeThreshold: number = 50;
    const leftDistance: number = point.x - bounds.left;
    const rightDistance: number = bounds.right - point.x;

    if (leftDistance < edgeThreshold) {
      this.horizontalScrollContainer.nativeElement.scrollLeft -= Math.max(
        1,
        (leftDistance / edgeThreshold) * 20
      );
    } else if (rightDistance < edgeThreshold) {
      this.horizontalScrollContainer.nativeElement.scrollLeft += Math.max(
        1,
        (rightDistance / edgeThreshold) * 20
      );
    }
  }

  private scrollVertical(event: CdkDragMove, columnEl: HTMLDivElement): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds: DOMRect = columnEl.getBoundingClientRect();
    const edgeThreshold: number = 50;
    const topDistance: number = point.y - bounds.top;
    const bottomDistance: number = bounds.bottom - point.y;

    if (topDistance < edgeThreshold) {
      columnEl.scrollTop -= Math.max(1, (topDistance / edgeThreshold) * 20);
    } else if (bottomDistance < edgeThreshold) {
      columnEl.scrollTop += Math.max(1, (bottomDistance / edgeThreshold) * 20);
    }
  }
}
