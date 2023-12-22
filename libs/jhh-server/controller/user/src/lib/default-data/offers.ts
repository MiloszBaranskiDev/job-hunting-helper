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
    | 'salary'
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
    salary: 3400,
    salaryCurrency: OfferSalaryCurrency.USD,
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
    salary: 4900,
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
    salary: 5750,
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
    salary: 6000,
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
    salary: null,
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
    salary: 6800,
    salaryCurrency: OfferSalaryCurrency.USD,
    email: 'careers@example.com',
  },
];

export default defaultOffers;
