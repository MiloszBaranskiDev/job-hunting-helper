import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatOfferSalary',
  standalone: true,
})
export class FormatOfferSalaryPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    element: any,
    salaryType: 'original' | 'converted' = 'original'
  ): string {
    const formatSalary = (salary: number, currency: string): string => {
      const transformedSalary: string | null = this.currencyPipe.transform(
        salary,
        currency,
        'symbol',
        '1.0-0'
      );

      return transformedSalary !== null ? transformedSalary : '';
    };

    if (salaryType === 'original') {
      if (element.minSalary && element.maxSalary) {
        return `${formatSalary(
          element.minSalary,
          element.salaryCurrency
        )} - ${formatSalary(element.maxSalary, element.salaryCurrency)}`;
      } else if (element.minSalary || element.maxSalary) {
        return formatSalary(
          element.minSalary || element.maxSalary,
          element.salaryCurrency
        );
      } else {
        return '-';
      }
    }

    if (salaryType === 'converted' && element.convertedSalary) {
      const minConvertedSalary: string = formatSalary(
        element.convertedSalary.min,
        element.convertedSalary.currency
      );
      const maxConvertedSalary: string = formatSalary(
        element.convertedSalary.max,
        element.convertedSalary.currency
      );

      if (minConvertedSalary !== '' && maxConvertedSalary !== '') {
        return `${minConvertedSalary} - ${maxConvertedSalary}`;
      } else if (minConvertedSalary !== '' || maxConvertedSalary !== '') {
        return minConvertedSalary || maxConvertedSalary;
      }
    }

    if (salaryType === 'converted') {
      if (element.minSalary || element.maxSalary) {
        return formatSalary(
          element.minSalary || element.maxSalary,
          element.salaryCurrency
        );
      } else {
        return '-';
      }
    }

    return '';
  }
}
