import { OfferSalaryCurrency } from '@jhh/shared/domain';
import {
  ConvertedSalary,
  ExchangeRate,
} from '@jhh/jhh-client/dashboard/offers/domain';

export function GetOfferSalaryConversion(
  currency?: OfferSalaryCurrency,
  min?: number,
  max?: number,
  convertTo?: OfferSalaryCurrency,
  exchangeRates?: ExchangeRate[]
): ConvertedSalary | undefined {
  if (!currency || !convertTo || !exchangeRates) return;
  if (!min && !max) return;
  if (currency === convertTo) return;

  function convertSalary(value: number): number {
    const convertFromRate: number | undefined = exchangeRates!.find(
      (rate) => rate.code === currency
    )?.rates[0].mid;
    const convertToRate: number | undefined = exchangeRates!.find(
      (rate) => rate.code === convertTo
    )?.rates[0].mid;

    if (currency === OfferSalaryCurrency.PLN) {
      return value * (1 / convertToRate!);
    } else if (convertTo === OfferSalaryCurrency.PLN) {
      return value * convertFromRate!;
    } else {
      return value * (convertFromRate! / convertToRate!);
    }
  }

  return {
    currency: convertTo,
    min: min ? convertSalary(min) : undefined,
    max: max ? convertSalary(max) : undefined,
  };
}
