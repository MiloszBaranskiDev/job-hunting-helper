import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { respondWithError } from '@jhh/jhh-server/shared/utils';

import {
  HttpStatusCode,
  OfferCompanyType,
  OfferFieldsLength,
  OfferLocation,
  OfferPriority,
  OfferSalaryCurrency,
  OfferStatus,
} from '@jhh/shared/domain';

import { JhhServerDb } from '@jhh/jhh-server/db';

import { regex } from '@jhh/shared/regex';

const addOffer = async (req: any, res: any): Promise<void> => {
  const prisma: PrismaClient = JhhServerDb();

  try {
    let { minSalary, maxSalary } = req.body;
    const {
      position,
      link,
      company,
      companyType,
      location,
      status,
      priority,
      salaryCurrency,
      email,
      description,
    } = req.body;
    const userId = req.user.id;

    if (
      !position ||
      !link ||
      !company ||
      !companyType ||
      !location ||
      !status ||
      !priority
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'These fields are required: position, link, company, companyType, location, status, priority'
      );
    }

    if (
      /[\s]{2,}/.test(position) ||
      /[\s]{2,}/.test(link) ||
      /[\s]{2,}/.test(company)
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Position, link and company cannot have consecutive spaces.'
      );
    }

    if (email && /[\s]{2,}/.test(email)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'E-mail cannot have consecutive spaces.'
      );
    }

    if (
      position !== position.trim() ||
      link !== link.trim() ||
      company !== company.trim()
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Position, link and company cannot have leading or trailing spaces.'
      );
    }

    if (email && email !== email.trim()) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'E-mail cannot have leading or trailing spaces.'
      );
    }

    if (
      position.length < OfferFieldsLength.MinPositionLength ||
      position.length > OfferFieldsLength.MaxPositionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Position must be between ${OfferFieldsLength.MinPositionLength} and ${OfferFieldsLength.MaxPositionLength} characters`
      );
    }

    if (
      company.length < OfferFieldsLength.MinCompanyLength ||
      company.length > OfferFieldsLength.MaxCompanyLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Company must be between ${OfferFieldsLength.MinCompanyLength} and ${OfferFieldsLength.MaxCompanyLength} characters`
      );
    }

    if (link.length > OfferFieldsLength.MaxLinkLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Link can have max ${OfferFieldsLength.MaxLinkLength} characters`
      );
    }

    if (email && email.length > OfferFieldsLength.MaxEmailLength) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `E-mail can have max ${OfferFieldsLength.MaxEmailLength} characters`
      );
    }

    if (
      description &&
      description.length > OfferFieldsLength.MaxDescriptionLength
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Description can have max ${OfferFieldsLength.MaxDescriptionLength} characters`
      );
    }

    if (minSalary && minSalary < OfferFieldsLength.MinSalaryValue) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Minimum value of salary is ${OfferFieldsLength.MinSalaryValue}`
      );
    }

    if (maxSalary && maxSalary < OfferFieldsLength.MinSalaryValue) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Minimum value of salary is ${OfferFieldsLength.MinSalaryValue}`
      );
    }

    if (minSalary && minSalary > OfferFieldsLength.MaxSalaryValue) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Maximum value of salary is ${OfferFieldsLength.MaxSalaryValue}`
      );
    }

    if (maxSalary && maxSalary > OfferFieldsLength.MaxSalaryValue) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        `Maximum value of salary is ${OfferFieldsLength.MaxSalaryValue}`
      );
    }

    if (!Object.values(OfferCompanyType).includes(companyType)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid company type.'
      );
    }

    if (!Object.values(OfferLocation).includes(location)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid location.'
      );
    }

    if (!Object.values(OfferStatus).includes(status)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid status.'
      );
    }

    if (!Object.values(OfferPriority).includes(priority)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid priority.'
      );
    }

    if (
      salaryCurrency &&
      !Object.values(OfferSalaryCurrency).includes(salaryCurrency)
    ) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid salary currency.'
      );
    }

    if (email && !regex.email.test(email)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid email format.'
      );
    }

    if (!regex.link.test(link)) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Invalid link format.'
      );
    }

    if ((minSalary || maxSalary) && !salaryCurrency) {
      return respondWithError(
        res,
        HttpStatusCode.BadRequest,
        'Salary currency is required when specifying a salary.'
      );
    }

    if (minSalary === maxSalary) {
      maxSalary = null;
    }

    const roundToTwoDecimals = (num: number): number =>
      Math.round((num + Number.EPSILON) * 100) / 100;

    if (minSalary) {
      minSalary = roundToTwoDecimals(minSalary);
    }

    if (maxSalary) {
      maxSalary = roundToTwoDecimals(maxSalary);
    }

    let slug: string = slugify(position, { lower: true, strict: true });
    let suffix: number = 2;
    const originalSlug: string = slug;

    while (await prisma.offer.findFirst({ where: { slug, userId } })) {
      slug = `${originalSlug}-${suffix}`;
      suffix++;
    }

    const addedOffer = await prisma.offer.create({
      data: {
        statusUpdates: [{ date: new Date(), status: status }],
        position: position,
        slug: slug,
        link: link,
        company: company,
        companyType: companyType,
        location: location,
        status: status,
        priority: priority,
        minSalary: minSalary,
        maxSalary: maxSalary,
        salaryCurrency: salaryCurrency,
        email: email,
        description: description,
        userId: userId,
      },
    });

    res.status(HttpStatusCode.OK).json({ data: { addedOffer } });
  } catch (error) {
    console.error(error);
    return respondWithError(
      res,
      HttpStatusCode.InternalServerError,
      'Internal Server Error'
    );
  }
};

export default addOffer;
