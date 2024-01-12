import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { endOfDay, startOfDay } from 'date-fns';
import { MatInputModule } from '@angular/material/input';
import { FlatpickrModule } from 'angularx-flatpickr';

import { ScheduleFacade } from '@jhh/jhh-client/dashboard/schedule/data-access';
import { ColorValidator } from '@jhh/jhh-client/shared/util-color-validator';
import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { DateRangeValidator } from '@jhh/jhh-client/dashboard/schedule/util-date-range-validator';

import {
  EventDefaultColor,
  EventField,
  EventFormErrorKey,
} from '@jhh/jhh-client/dashboard/schedule/domain';
import { EventFieldsLength } from '@jhh/shared/enums';

@Component({
  selector: 'jhh-schedule-add',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    WhitespaceSanitizerDirective,
    MatInputModule,
    FlatpickrModule,
  ],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly scheduleFacade: ScheduleFacade = inject(ScheduleFacade);

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  addEventInProgress$: Observable<boolean>;
  addEventError$: Observable<string | null>;
  addEventSuccess$: Observable<boolean>;

  readonly formField: typeof EventField = EventField;
  readonly fieldsLength: typeof EventFieldsLength = EventFieldsLength;
  readonly formErrorKey: typeof EventFormErrorKey = EventFormErrorKey;
  readonly defaultColor: typeof EventDefaultColor = EventDefaultColor;
  readonly defaultColorsValue: string[] = Object.values(this.defaultColor);
  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;

  ngOnInit(): void {
    this.addEventInProgress$ = this.scheduleFacade.addEventInProgress$;
    this.addEventError$ = this.scheduleFacade.addEventError$;
    this.addEventSuccess$ = this.scheduleFacade.addEventSuccess$;

    this.initFormGroup();
    this.handleReset();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.clearForm();
    });
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
      const { StartDate, EndDate, Title, Color, Description } = this.formField;
      const [startDate, endDate, title, color, description] = [
        StartDate,
        EndDate,
        Title,
        Color,
        Description,
      ].map((field) => this.formGroup.get(field)?.value);

      if (startDate && endDate && title && color && description) {
        this.scheduleFacade.addEvent(
          startDate,
          endDate,
          title,
          color,
          description
        );
      }
    }
  }

  private handleReset(): void {
    this.addEventSuccess$
      .pipe(
        tap((val) => {
          if (val) {
            this.clearForm();
            this.dialogRef?.close();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private clearForm(): void {
    this.formGroup.reset({
      [this.formField.StartDate]: startOfDay(new Date()),
      [this.formField.EndDate]: endOfDay(new Date()),
      [this.formField.Color]: this.defaultColor.SkyBlue,
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group(
      {
        [this.formField.StartDate]: [
          startOfDay(new Date()),
          [Validators.required],
        ],
        [this.formField.EndDate]: [endOfDay(new Date()), [Validators.required]],
        [this.formField.Title]: [
          '',
          [
            Validators.required,
            Validators.minLength(this.fieldsLength.MinTitleLength),
            Validators.maxLength(this.fieldsLength.MaxTitleLength),
          ],
        ],
        [this.formField.Color]: [
          this.defaultColor.SkyBlue,
          [Validators.required, ColorValidator],
        ],
        [this.formField.Description]: [
          '',
          [Validators.maxLength(this.fieldsLength.MaxDescriptionLength)],
        ],
      },
      {
        validators: DateRangeValidator(
          this.formField.StartDate,
          this.formField.EndDate
        ),
      }
    );
  }
}
