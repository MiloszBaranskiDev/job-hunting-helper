import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  of,
  startWith,
  tap,
} from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { Note, NotesGroup } from '@jhh/shared/domain';
import { NoteFormField } from '@jhh/jhh-client/dashboard/notes/domain';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';
import { ChangeNoteGroupDialogService } from '../../services/change-note-group-dialog.service';

@Component({
  selector: 'jhh-change-note-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly notesFacade: NotesFacade = inject(NotesFacade);
  private readonly changeNoteGroupDialogService: ChangeNoteGroupDialogService =
    inject(ChangeNoteGroupDialogService);

  @Input() noteToMove: Note;
  @ViewChild('dialogContent') readonly dialogContent: TemplateRef<any>;

  changeNoteGroupInProgress$: Observable<boolean>;
  changeNoteGroupError$: Observable<string | null>;
  filteredGroups$: Observable<any[]> | undefined;
  groups$: Observable<NotesGroup[] | null>;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  formGroup: FormGroup;
  readonly formField: typeof NoteFormField = NoteFormField;

  ngOnInit(): void {
    this.changeNoteGroupInProgress$ =
      this.notesFacade.changeNoteGroupInProgress$;
    this.changeNoteGroupError$ = this.notesFacade.changeNoteGroupError$;
    this.groups$ = this.notesFacade.getGroups$(this.noteToMove.groupId);

    this.initFormGroup();

    const control = this.formGroup.get(this.formField.NewGroupName);
    const valueChanges$ = control ? control.valueChanges : of('');

    this.filteredGroups$ = combineLatest([
      valueChanges$.pipe(startWith('')),
      this.groups$,
    ]).pipe(map(([value, groups]) => this._filter(value, groups!)));
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.formGroup?.reset();
    this.dialogRef?.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const newGroupName = this.formGroup.get(
        this.formField.NewGroupName
      )?.value;

      this.groups$
        .pipe(
          first(),
          filter((groups) => !!groups),
          tap((groups) => {
            const matchedGroup = groups!.find(
              (group) => group.name === newGroupName
            );

            if (matchedGroup && matchedGroup.id !== this.noteToMove.id) {
              this.notesFacade.changeNoteGroup(
                this.noteToMove.id,
                matchedGroup.id
              );
            }
          })
        )
        .subscribe();
    }
  }

  trackByFn(index: number, item: NotesGroup): string {
    return item.id;
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.formGroup?.reset();
      this.changeNoteGroupDialogService.clearNoteToMove();
    });
  }

  private _filter(value: any, groups: NotesGroup[]): NotesGroup[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return groups.filter((group) =>
        group.name.toLowerCase().includes(filterValue)
      );
    }

    return groups;
  }

  private groupValidator(groups: Observable<NotesGroup[] | null>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!groups) {
        return null;
      }
      let exists: boolean = false;
      let groupArray: any[] = [];

      groups.subscribe((gs) => {
        groupArray = gs!.map((g) => g.name);
      });

      if (groupArray.includes(control.value)) {
        exists = true;
      }

      return exists ? null : { invalidGroup: true };
    };
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.NewGroupName]: [
        '',
        [Validators.required, this.groupValidator(this.groups$)],
      ],
    });
  }
}
