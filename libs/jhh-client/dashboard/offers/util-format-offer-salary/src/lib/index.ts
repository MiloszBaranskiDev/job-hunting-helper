import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'formatOfferSalary',
  standalone: true,
})
export class FormatOfferSalaryPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(element: any): string {
    const formatSalary = (salary: number): string =>
      this.currencyPipe.transform(
        salary,
        element.salaryCurrency,
        'symbol',
        '1.0-0'
      )!;

    if (element.minSalary && element.maxSalary) {
      return `${formatSalary(element.minSalary)} - ${formatSalary(
        element.maxSalary
      )}`;
    } else if (element.minSalary) {
      return formatSalary(element.minSalary);
    } else if (element.maxSalary) {
      return formatSalary(element.maxSalary);
    }
    return '-';
  }
}
