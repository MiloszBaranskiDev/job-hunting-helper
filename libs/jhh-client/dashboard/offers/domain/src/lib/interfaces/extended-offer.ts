import { Offer } from '@jhh/shared/domain';
import { ConvertedSalary } from './converted-salary';

export interface ExtendedOffer extends Offer {
  statusIcon?: string;
  convertedSalary?: ConvertedSalary;
}
