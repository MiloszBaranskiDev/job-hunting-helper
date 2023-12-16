import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
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
  CdkDropListGroup,
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

import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';
import { BoardColumnFieldsLength, LocalStorageKeys } from '@jhh/shared/enums';

import { ColumnMenuComponent } from '../column-menu/column-menu.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { ClickOutsideDirective } from '@jhh/jhh-client/shared/util-click-outside';

@Component({
  selector: 'jhh-board-columns',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropListGroup,
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
export class ColumnsComponent implements OnInit, OnChanges, OnDestroy {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @ViewChild('horizontalScrollContainer') horizontalScrollContainer: ElementRef;

  @Input() isSaving$: BehaviorSubject<boolean>;

  @Input() set columns(value: BoardColumn[]) {
    this.originalColumns = value;
    this.mergeWithWorkingData(value);
  }

  updateBoardColumnsInProgress$: Observable<boolean>;
  updateBoardColumnsError$: Observable<string | null>;
  updateBoardColumnsSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  readonly boardColumnFieldsLength: typeof BoardColumnFieldsLength =
    BoardColumnFieldsLength;
  private updateSubject: Subject<void> = new Subject<void>();
  private _columns: BoardColumn[] = [];
  private originalColumns: BoardColumn[];
  private removedItemIds: string[] = [];
  private isItemBeingDragged: boolean = false;
  editingItem: { [key: string]: boolean } = {};
  editableContent: { [key: string]: string } = {};

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
        debounceTime(3500),
        filter(() => !this.isAnyItemInEditMode() && !this.isItemBeingDragged),
        tap(() => {
          this.saveChanges();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    window.addEventListener('beforeunload', this.handleAppClose);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && !changes['columns'].isFirstChange()) {
      this.mergeWithWorkingData(changes['columns'].currentValue);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleAppClose);
  }

  get columns(): BoardColumn[] {
    return this._columns;
  }

  get connectedDropLists(): string[] {
    return this.columns.map((column) => 'drop-list-' + column.id);
  }

  trackByFn(index: number, item: BoardColumn | BoardColumnItem): string {
    return item.id + '_' + item.order;
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
      const columnsClone: BoardColumn[] = [...this.columns];

      moveItemInArray(columnsClone, event.previousIndex, event.currentIndex);

      this._columns = columnsClone.map((column, index) => ({
        ...column,
        order: index,
      }));

      this.updateSubject.next();
    }
  }

  dropItem(event: CdkDragDrop<BoardColumnItem[]>): void {
    const previousColumnIndex: number = this.columns.findIndex(
      (c) => c.items === event.previousContainer.data
    );
    const currentColumnIndex: number = this.columns.findIndex(
      (c) => c.items === event.container.data
    );
    const columnsClone: BoardColumn[] = this.columns.map((col) => ({
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

  private saveChanges(): void {
    const updatedColumns: Partial<BoardColumn | null>[] =
      this.getOnlyUpdatedColumns();

    if (updatedColumns.length > 0 || this.removedItemIds.length > 0) {
      this.isSaving$.next(true);

      const savingSnackBar: MatSnackBarRef<TextOnlySnackBar> =
        this.snackBar.open('Saving data...', 'Close');

      this.boardFacade.updateBoardColumns(updatedColumns, this.removedItemIds);

      this.updateBoardColumnsSuccess$
        .pipe(
          tap((val) => {
            if (val) {
              this.removedItemIds = [];
              this.isSaving$.next(false);
              savingSnackBar.dismiss();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();

      this.updateBoardColumnsError$
        .pipe(
          tap((val) => {
            if (val) {
              this.isSaving$.next(false);
              savingSnackBar.dismiss();
              this.snackBar.open(
                'Something went wrong with saving data.',
                'Close',
                {
                  duration: 7000,
                }
              );
              this._columns = JSON.parse(JSON.stringify(this.originalColumns));
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  private handleAppClose = (event: BeforeUnloadEvent): string | void => {
    const updatedColumns: Partial<BoardColumn | null>[] =
      this.getOnlyUpdatedColumns();

    if (updatedColumns.length > 0 || this.removedItemIds.length > 0) {
      const unsavedBoardRequestId: string = String(Date.now());
      localStorage.setItem(
        LocalStorageKeys.UnsavedBoardRequestId,
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

  private getOnlyUpdatedColumns(): Partial<BoardColumn | null>[] {
    const isItemsEqual = (
      items1: BoardColumnItem[],
      items2: BoardColumnItem[]
    ): boolean => {
      if (items1.length !== items2.length) {
        return false;
      }
      for (let i = 0; i < items1.length; i++) {
        if (items1[i].id !== items2[i].id) {
          return false;
        }
      }
      return true;
    };

    return this._columns
      .map((column, index): Partial<BoardColumn> | null => {
        const originalColumn: BoardColumn | undefined =
          this.originalColumns.find((oc) => oc.id === column.id);
        if (!originalColumn) return null;

        const hasOrderChanged: boolean = column.order !== originalColumn.order;
        const areItemsEqual: boolean = isItemsEqual(
          column.items,
          originalColumn.items
        );

        if (hasOrderChanged && areItemsEqual) {
          return { id: column.id, order: column.order, items: [] };
        } else if (!areItemsEqual || (hasOrderChanged && !areItemsEqual)) {
          return { ...column };
        }

        return null;
      })
      .filter((column) => column !== null);
  }

  private mergeWithWorkingData(newData: BoardColumn[]): void {
    this._columns = newData.map((newColumn) => {
      const existingColumn: BoardColumn | undefined = this._columns.find(
        (c) => c.id === newColumn.id
      );

      if (existingColumn) {
        return {
          ...existingColumn,
          ...newColumn,
          items: newColumn.items.map((newItem) => {
            const existingItem: BoardColumnItem | undefined =
              existingColumn.items.find(
                (i) =>
                  (i.id.startsWith('temp-') &&
                    i.content === newItem.content &&
                    i.order === newItem.order) ||
                  i.id === newItem.id
              );
            return existingItem ? { ...existingItem, ...newItem } : newItem;
          }),
        };
      } else {
        return newColumn;
      }
    });
  }

  private scrollHorizontal(event: CdkDragMove): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds =
      this.horizontalScrollContainer.nativeElement.getBoundingClientRect();
    const leftDistance: number = point.x - bounds.left;
    const rightDistance: number = bounds.right - point.x;
    const edgeThreshold: number = 50;
    let scrollSpeed: number = 0;

    if (leftDistance < edgeThreshold) {
      scrollSpeed = Math.max(1, (leftDistance / edgeThreshold) * 20);
      this.horizontalScrollContainer.nativeElement.scrollLeft -= scrollSpeed;
    } else if (rightDistance < edgeThreshold) {
      scrollSpeed = Math.max(1, (rightDistance / edgeThreshold) * 20);
      this.horizontalScrollContainer.nativeElement.scrollLeft += scrollSpeed;
    }
  }

  private scrollVertical(event: CdkDragMove, columnEl: HTMLDivElement): void {
    const point: { x: number; y: number } = event.pointerPosition;
    const bounds = columnEl.getBoundingClientRect();
    const topDistance: number = point.y - bounds.top;
    const bottomDistance: number = bounds.bottom - point.y;
    const edgeThreshold: number = 50;
    let scrollSpeed: number = 0;

    if (topDistance < edgeThreshold) {
      scrollSpeed = Math.max(1, (topDistance / edgeThreshold) * 20);
      columnEl.scrollTop -= scrollSpeed;
    } else if (bottomDistance < edgeThreshold) {
      scrollSpeed = Math.max(1, (bottomDistance / edgeThreshold) * 20);
      columnEl.scrollTop += scrollSpeed;
    }
  }
}
