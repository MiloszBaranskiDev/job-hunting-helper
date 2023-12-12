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
import { BoardColumnFieldsLength } from '@jhh/shared/enums';

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
  private _columns: BoardColumn[] = [];
  private originalColumns: BoardColumn[];
  private updateSubject: Subject<void> = new Subject<void>();
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
          const areColumnsChanged: boolean = this.areColumnsChanged();
          if (areColumnsChanged) {
            this.saveChanges();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.updateSubject
      .pipe(
        debounceTime(3500),
        filter(() => !this.isAnyItemInEditMode() && !this.isItemBeingDragged),
        tap(() => {
          const areColumnsChanged: boolean = this.areColumnsChanged();
          if (areColumnsChanged) {
            this.saveChanges();
          }
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
    this.isSaving$.next(true);

    const savingSnackBar: MatSnackBarRef<TextOnlySnackBar> = this.snackBar.open(
      'Saving data...',
      'Close'
    );
    const updatedColumns: Partial<BoardColumn>[] = this.getOnlyUpdatedColumns();

    if (updatedColumns && updatedColumns.length > 0) {
      this.boardFacade.updateBoardColumns(updatedColumns);
    }

    this.updateBoardColumnsSuccess$
      .pipe(
        tap((val) => {
          if (val) {
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

  private handleAppClose = (): void => {
    const areColumnsChanged: boolean = this.areColumnsChanged();
    const updatedColumns: Partial<BoardColumn>[] = this.getOnlyUpdatedColumns();

    if (areColumnsChanged) {
      if (updatedColumns && updatedColumns.length > 0) {
        this.boardFacade.updateBoardColumns(updatedColumns);
      }
    }
  };

  private isAnyItemInEditMode(): boolean {
    return Object.values(this.editingItem).some((value) => value);
  }

  private areColumnsChanged(): boolean {
    const ignoreNotNeededFields = (obj: any) => {
      const excludedKeys: string[] = [
        'updatedAt',
        'createdAt',
        'columnId',
        'isTemporary',
      ];

      return JSON.stringify(obj, (key, value) =>
        excludedKeys.includes(key) ? undefined : value
      );
    };

    return (
      ignoreNotNeededFields(this._columns) !==
      ignoreNotNeededFields(this.originalColumns)
    );
  }

  private getOnlyUpdatedColumns(): Partial<BoardColumn>[] {
    return this._columns
      .map((column, index) => {
        const originalColumn: BoardColumn = this.originalColumns[index];
        const updatedColumn: Partial<BoardColumn> = {
          id: column.id,
          order: column.order,
          items: column.items,
        };

        if (column.order !== originalColumn.order) {
          return column;
        }

        Object.keys(column).forEach((key) => {
          // @ts-ignore
          if (column[key] !== originalColumn[key]) {
            // @ts-ignore
            updatedColumn[key] = column[key];
          }
        });

        return updatedColumn;
      })
      .filter((column) => Object.keys(column).length > 1);
  }

  private mergeWithWorkingData(newData: BoardColumn[]): void {
    let updatedColumns = JSON.parse(JSON.stringify(this._columns));

    updatedColumns = newData.map((newColumn) => {
      const existingColumn: BoardColumn = updatedColumns.find(
        (c: BoardColumn) => c.id === newColumn.id
      );

      if (existingColumn) {
        return {
          ...existingColumn,
          ...newColumn,
          items: existingColumn.items,
        };
      } else {
        return newColumn;
      }
    });

    updatedColumns = updatedColumns.filter((column: BoardColumn) =>
      newData.some((newColumn) => newColumn.id === column.id)
    );

    this._columns = updatedColumns;
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
