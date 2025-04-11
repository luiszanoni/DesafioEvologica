import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
    name: 'customDateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | Date | null, format: string = 'dd-MM-yyyy', locale: string = 'pt-BR'): string {
        if (!value) {
            return '';
        }

        let date: Date;

        if (typeof value === 'string') {

            const [ano, mes, dia] = value.split('-').map(Number);
            date = new Date(ano, mes - 1, dia);
        } else {
            date = value;
        }

        return formatDate(date, format, locale);
    }
}