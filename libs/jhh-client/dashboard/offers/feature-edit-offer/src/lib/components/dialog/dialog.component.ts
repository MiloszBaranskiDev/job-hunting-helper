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
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, tap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

import { OffersFacade } from '@jhh/jhh-client/dashboard/offers/data-access';
import { BreakpointService } from '@jhh/jhh-client/shared/util-breakpoint';
import { EditOfferDialogService } from '../../service/edit-offer-dialog.service';

import { regex } from '@jhh/shared/regex';

import { WhitespaceSanitizerDirective } from '@jhh/jhh-client/shared/util-whitespace-sanitizer';
import { EnumValidator } from '@jhh/jhh-client/shared/util-enum-validator';

import { Offer } from '@jhh/shared/interfaces';
import {
  OfferField,
  OfferFormErrorKey,
} from '@jhh/jhh-client/dashboard/offers/domain';
import {
  OfferCompanyType,
  OfferFieldsLength,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/enums';
import { ClientRoute } from '@jhh/jhh-client/shared/enums';

@Component({
  selector: 'jhh-edit-offer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    WhitespaceSanitizerDirective,
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly offersFacade: OffersFacade = inject(OffersFacade);
  private readonly breakpointService: BreakpointService =
    inject(BreakpointService);
  private readonly editOfferDialogService: EditOfferDialogService = inject(
    EditOfferDialogService
  );

  @Input({ required: true }) offer: Offer;
  @ViewChild('dialogContent') private readonly dialogContent: TemplateRef<any>;

  editOfferInProgress$: Observable<boolean>;
  editOfferError$: Observable<string | null>;
  breakpoint$: Observable<string>;

  readonly formField: typeof OfferField = OfferField;
  readonly fieldsLength: typeof OfferFieldsLength = OfferFieldsLength;
  readonly formErrorKey: typeof OfferFormErrorKey = OfferFormErrorKey;
  readonly offerLocation: OfferLocation[] = Object.values(OfferLocation);
  readonly offerCompanyType: OfferCompanyType[] =
    Object.values(OfferCompanyType);
  readonly offerSalaryCurrency: OfferSalaryCurrency[] =
    Object.values(OfferSalaryCurrency);
  readonly offerStatus: OfferStatus[] = Object.values(OfferStatus);
  readonly offerPriority: OfferPriority[] = Object.values(OfferPriority);
  formGroup: FormGroup;
  dialogRef: MatDialogRef<TemplateRef<any>>;
  slugPrefix: string;

  ngOnInit(): void {
    this.editOfferInProgress$ = this.offersFacade.editOfferInProgress$;
    this.editOfferError$ = this.offersFacade.editOfferError$;
    this.breakpoint$ = this.breakpointService.breakpoint$;

    this.slugPrefix =
      window.location.href.split(ClientRoute.HomeLink)[0] +
      `${ClientRoute.OffersLink}` +
      '/';

    this.initFormGroup();

    this.formGroup.valueChanges
      .pipe(
        tap((val) => {
          if (
            val.minSalary >= this.fieldsLength.MinSalaryValue ||
            val.maxSalary >= this.fieldsLength.MinSalaryValue
          ) {
            this.formGroup.get(this.formField.SalaryCurrency)!.enable();
          } else {
            this.formGroup.get(this.formField.SalaryCurrency)!.disable();
          }
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.openDialog();
  }

  ngOnDestroy(): void {
    this.clearForm();
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      type FormData = Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>;
      const formData: FormData = { ...this.formGroup.value };
      const {
        slug,
        position,
        link,
        company,
        companyType,
        location,
        status,
        priority,
        minSalary,
        maxSalary,
        email,
        salaryCurrency,
        description,
      } = formData;
      const salaryCurrencyValue: OfferSalaryCurrency | undefined =
        salaryCurrency !== undefined ? salaryCurrency : undefined;

      if (this.hasFormChanges()) {
        this.offersFacade.editOffer(
          this.offer.id,
          slug,
          position,
          link,
          company,
          companyType,
          location,
          status,
          priority,
          minSalary,
          maxSalary,
          salaryCurrencyValue,
          email,
          description
        );
      } else {
        this.clearForm();
        this.dialogRef?.close();
      }
    }
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogContent);
    this.dialogRef.afterClosed().subscribe(() => {
      this.editOfferDialogService.clearOfferToEdit();
    });
  }

  private hasFormChanges(): boolean {
    const formValues = this.formGroup.value;
    for (const key of Object.keys(formValues)) {
      if (formValues[key] !== this.offer[key as keyof Offer]) {
        return true;
      }
    }
    return false;
  }

  private clearForm(): void {
    this.formGroup?.reset({
      [this.formField.CompanyType]: this.offer.companyType,
      [this.formField.Location]: this.offer.location,
      [this.formField.Status]: this.offer.location,
      [this.formField.Priority]: this.offer.priority,
      [this.formField.SalaryCurrency]: this.offer.salaryCurrency,
    });
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group({
      [this.formField.Slug]: [
        this.offer.slug,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinPositionLength),
          Validators.maxLength(
            this.fieldsLength.MaxPositionLength +
              this.fieldsLength.MaxPositionAndSlugLengthDiff
          ),
        ],
      ],
      [this.formField.Position]: [
        this.offer.position,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinPositionLength),
          Validators.maxLength(this.fieldsLength.MaxPositionLength),
        ],
      ],
      [this.formField.Link]: [
        this.offer.link,
        [
          Validators.required,
          Validators.pattern(regex.link),
          Validators.maxLength(this.fieldsLength.MaxLinkLength),
        ],
      ],
      [this.formField.Company]: [
        this.offer.company,
        [
          Validators.required,
          Validators.minLength(this.fieldsLength.MinCompanyLength),
          Validators.maxLength(this.fieldsLength.MaxCompanyLength),
        ],
      ],
      [this.formField.CompanyType]: [
        this.offer.companyType,
        [Validators.required, EnumValidator(OfferCompanyType)],
      ],
      [this.formField.Location]: [
        this.offer.location,
        [Validators.required, EnumValidator(OfferLocation)],
      ],
      [this.formField.Status]: [
        this.offer.status,
        [Validators.required, EnumValidator(OfferStatus)],
      ],
      [this.formField.Priority]: [
        this.offer.priority,
        [Validators.required, EnumValidator(OfferPriority)],
      ],
      [this.formField.MinSalary]: [
        this.offer.minSalary,
        [
          Validators.min(this.fieldsLength.MinSalaryValue),
          Validators.max(this.fieldsLength.MaxSalaryValue),
        ],
      ],
      [this.formField.MaxSalary]: [
        this.offer.maxSalary,
        [
          Validators.min(this.fieldsLength.MinSalaryValue),
          Validators.max(this.fieldsLength.MaxSalaryValue),
        ],
      ],
      [this.formField.SalaryCurrency]: [
        {
          value: this.offer.salaryCurrency ?? OfferSalaryCurrency.PLN,
          disabled: !(this.offer.minSalary || this.offer.maxSalary),
        },
        [Validators.required, EnumValidator(OfferSalaryCurrency)],
      ],
      [this.formField.Email]: [
        this.offer.email,
        [
          Validators.maxLength(this.fieldsLength.MaxEmailLength),
          (control: any) => {
            if (control.value) {
              return Validators.compose([Validators.pattern(regex.email)])!(
                control
              );
            }
            return null;
          },
        ],
      ],
      [this.formField.Description]: [
        this.offer.description,
        [Validators.maxLength(this.fieldsLength.MaxDescriptionLength)],
      ],
    });
  }
}
