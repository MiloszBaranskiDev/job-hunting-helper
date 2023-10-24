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

import { Note, NotesGroup } from '@jhh/shared/interfaces';
import { FormField } from '../../enums/form-field';

import { NotesFacade } from '@jhh/jhh-client/dashboard/notes/data-access';

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

  @Input() noteToMove: Note;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  changeNoteGroupInProgress$: Observable<boolean>;
  changeNoteGroupError$: Observable<string | null>;
  filteredGroups$: Observable<any[]> | undefined;
  groups$: Observable<NotesGroup[]>;

  private dialogRef: MatDialogRef<TemplateRef<any>>;
  formGroup: FormGroup;
  formField: typeof FormField = FormField;

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
    ]).pipe(map(([value, groups]) => this._filter(value, groups)));
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy() {
    this.formGroup.reset();
    this.dialogRef.close();
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
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

  onSubmit(): void {
    if (this.formGroup.valid) {
      const newGroupName = this.formGroup.get(
        this.formField.NewGroupName
      )?.value;

      this.groups$
        .pipe(
          first(),
          tap((groups: NotesGroup[]) => {
            const matchedGroup = groups.find(
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

  groupValidator(groups: Observable<NotesGroup[]>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let exists = false;
      let groupArray: any[] = [];

      groups.subscribe((gs) => {
        groupArray = gs.map((g) => g.name);
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
