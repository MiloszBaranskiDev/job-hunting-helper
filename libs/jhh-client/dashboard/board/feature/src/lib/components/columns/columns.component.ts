import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

import { BoardColumn, BoardColumnItem } from '@jhh/shared/interfaces';

import { ColumnMenuComponent } from '../column-menu/column-menu.component';

import { BoardFacade } from '@jhh/jhh-client/dashboard/board/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';

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
  ],
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss'],
})
export class ColumnsComponent implements OnInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly boardFacade: BoardFacade = inject(BoardFacade);

  @Input() isSaving$: BehaviorSubject<boolean>;

  @Input() set columns(value: BoardColumn[]) {
    this.originalColumns = value;
    this.mergeWithWorkingData(value);
  }

  updateBoardColumnsInProgress$: Observable<boolean>;
  updateBoardColumnsError$: Observable<string | null>;
  updateBoardColumnsSuccess$: Observable<boolean>;
  breakpoint$: Observable<string>;

  private _columns: BoardColumn[] = [];
  private originalColumns: BoardColumn[];
  private updateSubject: Subject<void> = new Subject<void>();
  editingItemId: string | null = null;

  get columns(): BoardColumn[] {
    return this._columns;
  }

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
          if (this.areColumnsChanged()) {
            this.saveChanges();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.updateSubject
      .pipe(
        debounceTime(3500),
        tap(() => {
          const areColumnsChanged: boolean = this.areColumnsChanged();
          if (areColumnsChanged) {
            this.saveChanges();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && !changes['columns'].isFirstChange()) {
      this.mergeWithWorkingData(changes['columns'].currentValue);
    }
  }

  trackByFn(index: number, item: BoardColumn | BoardColumnItem): string {
    return item.id;
  }

  drop(event: CdkDragDrop<BoardColumnItem[]>): void {
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
      columnId: null as any,
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

    this.updateSubject.next();
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

  private areColumnsChanged(): boolean {
    return (
      JSON.stringify(this._columns) !== JSON.stringify(this.originalColumns)
    );
  }

  private getOnlyUpdatedColumns(): Partial<BoardColumn>[] {
    return this._columns
      .filter(
        (column, index) =>
          JSON.stringify(column) !== JSON.stringify(this.originalColumns[index])
      )
      .map((column) => {
        const originalColumn: BoardColumn | undefined =
          this.originalColumns.find((c) => c.id === column.id);
        return this.getUpdatedColumnData(column, originalColumn);
      });
  }

  private getUpdatedColumnData(
    newColumn: BoardColumn,
    originalColumn?: BoardColumn
  ): Partial<BoardColumn> {
    if (!originalColumn) {
      return newColumn;
    }

    const updatedColumn: Partial<BoardColumn> = { id: newColumn.id };
    Object.keys(newColumn).forEach((key) => {
      // @ts-ignore
      if (newColumn[key] !== originalColumn[key]) {
        // @ts-ignore
        updatedColumn[key] = newColumn[key];
      }
    });

    return updatedColumn;
  }

  private mergeWithWorkingData(newData: BoardColumn[]): void {
    let updatedColumns = JSON.parse(JSON.stringify(this._columns));

    updatedColumns = newData.map((newColumn) => {
      const existingColumn: BoardColumn = updatedColumns.find(
        (c: BoardColumn) => c.id === newColumn.id
      );

      if (existingColumn) {
        return { ...existingColumn, ...newColumn, items: existingColumn.items };
      } else {
        return newColumn;
      }
    });

    updatedColumns = updatedColumns.filter((column: BoardColumn) =>
      newData.some((newColumn) => newColumn.id === column.id)
    );

    this._columns = updatedColumns;
  }
}
