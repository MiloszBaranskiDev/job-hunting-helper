import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/enums';

export interface Offer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  appliedAt?: Date;
  statusUpdatedAt?: Date;
  position: string;
  link: string;
  company: string;
  companyType: OfferCompanyType;
  location: OfferLocation;
  status: OfferStatus;
  priority: OfferPriority;
  salary?: number;
  salaryCurrency?: OfferSalaryCurrency;
  email?: string;
}
