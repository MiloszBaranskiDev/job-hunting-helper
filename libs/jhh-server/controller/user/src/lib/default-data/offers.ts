import { Offer } from '@jhh/shared/interfaces';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/enums';

interface DefaultOffer
  extends Pick<
    Offer,
    | 'appliedAt'
    | 'statusUpdatedAt'
    | 'position'
    | 'link'
    | 'company'
    | 'companyType'
    | 'location'
    | 'status'
    | 'priority'
    | 'minSalary'
    | 'maxSalary'
    | 'salaryCurrency'
    | 'email'
  > {}

const defaultOffers: DefaultOffer[] = [
  {
    appliedAt: null,
    statusUpdatedAt: null,
    position: 'Frontend Developer',
    link: 'http://example.com/frontend',
    company: 'Tech Solutions',
    companyType: OfferCompanyType.SoftwareHouse,
    location: OfferLocation.Remote,
    status: OfferStatus.Applied,
    priority: OfferPriority.High,
    minSalary: 11500,
    maxSalary: 16000,
    salaryCurrency: OfferSalaryCurrency.PLN,
    email: 'hr@example.com',
  },
  {
    appliedAt: new Date('2023-10-01'),
    statusUpdatedAt: new Date('2023-10-15'),
    position: 'Backend Developer',
    link: 'http://example.com/backend',
    company: 'Innovatech',
    companyType: OfferCompanyType.SoftwareHouse,
    location: OfferLocation.OnSite,
    status: OfferStatus.Interviewing,
    priority: OfferPriority.Medium,
    minSalary: 4900,
    maxSalary: null,
    salaryCurrency: OfferSalaryCurrency.EUR,
    email: 'careers@example.com',
  },
  {
    appliedAt: null,
    statusUpdatedAt: null,
    position: 'Full Stack Developer',
    link: 'http://example.com/fullstack',
    company: 'CodeCraft',
    companyType: OfferCompanyType.Other,
    location: OfferLocation.Hybrid,
    status: OfferStatus.NotApplied,
    priority: OfferPriority.Low,
    minSalary: 5750,
    maxSalary: 6500,
    salaryCurrency: OfferSalaryCurrency.GBP,
    email: null,
  },
  {
    appliedAt: new Date('2023-09-20'),
    statusUpdatedAt: new Date('2023-10-05'),
    position: 'DevOps Engineer',
    link: 'http://example.com/devops',
    company: 'CloudNet',
    companyType: OfferCompanyType.Product,
    location: OfferLocation.Hybrid,
    status: OfferStatus.Rejected,
    priority: OfferPriority.Medium,
    minSalary: null,
    maxSalary: 6000,
    salaryCurrency: OfferSalaryCurrency.EUR,
    email: 'recruit@example.com',
  },
  {
    appliedAt: null,
    statusUpdatedAt: null,
    position: 'UI/UX Designer',
    link: 'http://example.com/uiux',
    company: 'DesignHub',
    companyType: OfferCompanyType.Outsourcing,
    location: OfferLocation.OnSite,
    status: OfferStatus.OfferReceived,
    priority: OfferPriority.Low,
    minSalary: null,
    maxSalary: null,
    salaryCurrency: null,
    email: 'talent@example.com',
  },
  {
    appliedAt: null,
    statusUpdatedAt: null,
    position: 'Software Architect',
    link: 'http://example.com/architect',
    company: 'BuildTech',
    companyType: OfferCompanyType.Enterprise,
    location: OfferLocation.Remote,
    status: OfferStatus.Accepted,
    priority: OfferPriority.High,
    minSalary: 5800,
    maxSalary: 7000,
    salaryCurrency: OfferSalaryCurrency.USD,
    email: 'careers@example.com',
  },
];

export default defaultOffers;
