import { Offer } from '@jhh/shared/interfaces';
import {
  OfferCompanyType,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/enums';

type DefaultOffer = Omit<Offer, 'userId' | 'createdAt' | 'updatedAt' | 'id'>;

function subtractDays(date: Date, days: number): Date {
  const result: Date = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

const today: Date = new Date();

const defaultOffers: DefaultOffer[] = [
  {
    statusUpdates: [{ date: new Date(), status: OfferStatus.Applied }],
    position: 'Frontend Developer',
    slug: 'frontend-developer',
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
    statusUpdates: [
      { date: subtractDays(today, 10), status: OfferStatus.Applied },
      { date: subtractDays(today, 3), status: OfferStatus.Interviewing },
    ],
    position: 'Backend Developer',
    slug: 'backend-developer',
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
    statusUpdates: [],
    position: 'Full Stack Developer',
    slug: 'full-stack-developer',
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
    statusUpdates: [
      { date: subtractDays(today, 30), status: OfferStatus.Applied },
      { date: subtractDays(today, 20), status: OfferStatus.Interviewing },
      { date: subtractDays(today, 10), status: OfferStatus.Rejected },
    ],
    position: 'DevOps Engineer',
    slug: 'devops-engineer',
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
    statusUpdates: [
      { date: subtractDays(today, 40), status: OfferStatus.Applied },
      { date: subtractDays(today, 25), status: OfferStatus.Interviewing },
      { date: subtractDays(today, 15), status: OfferStatus.OfferReceived },
    ],
    position: 'UI/UX Designer',
    slug: 'ui-ux-designer',
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
    statusUpdates: [
      { date: subtractDays(today, 50), status: OfferStatus.Applied },
      { date: subtractDays(today, 35), status: OfferStatus.Interviewing },
      { date: subtractDays(today, 20), status: OfferStatus.OfferReceived },
      { date: subtractDays(today, 5), status: OfferStatus.Accepted },
    ],
    position: 'Software Architect',
    slug: 'software-architect',
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
