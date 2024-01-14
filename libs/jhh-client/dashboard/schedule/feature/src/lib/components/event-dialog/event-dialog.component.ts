import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { distinctUntilChanged, merge, Observable, Subject, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';

import { ColorValidator } from '@jhh/jhh-client/shared/util-color-validator';
import { DateRangeValidator } from '@jhh/jhh-client/dashboard/schedule/util-date-range-validator';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';

import { ScheduleEvent } from '@jhh/shared/interfaces';
import {
  EventDefaultColor,
  EventField,
  EventFormErrorKey,
} from '@jhh/jhh-client/dashboard/schedule/domain';
import { EventFieldsLength } from '@jhh/shared/enums';

@Component({
  selector: 'jhh-schedule-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDividerModule,
    FlatpickrModule,
    WhitespaceSanitizerDirective,
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  @Input({ required: true }) clickedEventId$: Subject<string | null>;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  editEventInProgress$: Observable<boolean>;
  editEventError$: Observable<string | null>;
  editEventSuccess$: Observable<boolean>;
  removeEventInProgress$: Observable<boolean>;
  removeEventError$: Observable<string | null>;
  removeEventSuccess$: Observable<boolean>;

  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  event: ScheduleEvent;
  removeConfirmationText: string = '';
  readonly formField: typeof EventField = EventField;
  readonly fieldsLength: typeof EventFieldsLength = EventFieldsLength;
  readonly formErrorKey: typeof EventFormErrorKey = EventFormErrorKey;
  readonly defaultColor: typeof EventDefaultColor = EventDefaultColor;
  readonly defaultColorsValue: string[] = Object.values(this.defaultColor);
  readonly expectedRemoveConfirmationTexts: string[] = [
    'remove',
    '"remove"',
    `'remove'`,
  ];

  ngOnInit(): void {
    this.editEventInProgress$ = this.scheduleFacade.editEventInProgress$;
    this.editEventError$ = this.scheduleFacade.editEventError$;
    this.editEventSuccess$ = this.scheduleFacade.editEventSuccess$;
    this.removeEventInProgress$ = this.scheduleFacade.removeEventInProgress$;
    this.removeEventError$ = this.scheduleFacade.removeEventError$;
    this.removeEventSuccess$ = this.scheduleFacade.removeEventSuccess$;

    this.clickedEventId$
      .pipe(
        tap((val) => {
          if (val) {
            this.openDialog(val);
          } else {
            this.closeDialog();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.handleReset();
  }

  handleRemove(): void {
    this.scheduleFacade.removeEvent(this.event.id);
  }

  isRemoveConfirmationValid(): boolean {
    return this.expectedRemoveConfirmationTexts.includes(
      this.removeConfirmationText.toLowerCase()
    );
  }

  selectDefaultColor(color: EventDefaultColor): void {
    if (this.defaultColorsValue.includes(color)) {
      this.formGroup.get(this.formField.Color)?.setValue(color);
    } else {
      this.formGroup
        .get(this.formField.Color)
        ?.setValue(this.defaultColor.SkyBlue);
    }
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      const { Start, End, Title, Color, Description } = this.formField;
      const [start, end, title, color, description] = [
        Start,
        End,
        Title,
        Color,
        Description,
      ].map((field) => this.formGroup.get(field)?.value);

      if (start && end && title && color) {
        if (this.hasFormChanges()) {
          this.scheduleFacade.editEvent(
            this.event.id,
            start,
            end,
            title,
            color,
            description
          );
        } else {
          this.clearData();
        }
      }
    }
  }

  private openDialog(id: string): void {
    this.dialogRef = this.dialog.open(this.dialogContent);

    this.scheduleFacade
      .getEvent$ById(id)
      .pipe(
        tap((val) => {
          if (val) {
            this.event = val;
            this.initFormGroup();
          }
        }),
        distinctUntilChanged()
      )
      .subscribe();

    this.dialogRef?.afterClosed().subscribe(() => {
      this.clearData();
    });
  }

  private hasFormChanges(): boolean {
    const formValues = this.formGroup.value;
    for (const key of Object.keys(formValues)) {
      if (formValues[key] !== this.event[key as keyof ScheduleEvent]) {
        return true;
      }
    }
    return false;
  }

  private closeDialog(): void {
    this.dialogRef?.close();
  }

  private handleReset(): void {
    merge(this.removeEventSuccess$, this.editEventSuccess$)
      .pipe(
        tap((val) => {
          if (val) {
            this.clearData();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private clearData(): void {
    this.clickedEventId$.next(null);
    this.removeConfirmationText = '';
    this.clearForm();
  }

  private clearForm(): void {
    this.formGroup.reset({
      [this.formField.Start]: this.event.start,
      [this.formField.End]: this.event.end,
      [this.formField.Title]: this.event.title,
      [this.formField.Color]: this.event.color,
      [this.formField.Description]: this.event.description,
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        [this.formField.Start]: [this.event.start, [Validators.required]],
        [this.formField.End]: [this.event.end, [Validators.required]],
        [this.formField.Title]: [
          this.event.title,
          [
            Validators.required,
            Validators.minLength(this.fieldsLength.MinTitleLength),
            Validators.maxLength(this.fieldsLength.MaxTitleLength),
          ],
        ],
        [this.formField.Color]: [
          this.event.color,
          [Validators.required, ColorValidator],
        ],
        [this.formField.Description]: [
          this.event.description,
          [Validators.maxLength(this.fieldsLength.MaxDescriptionLength)],
        ],
      },
      {
        validators: DateRangeValidator(
          this.formField.Start,
          this.formField.End
        ),
      }
    );
  }
}