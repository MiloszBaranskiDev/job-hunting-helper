import { OfferSalaryCurrency } from '@jhh/shared/domain';

export interface ConvertedSalary {
  currency: OfferSalaryCurrency;
  min?: number;
  max?: number;
}
