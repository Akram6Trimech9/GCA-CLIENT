import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateStatus',
  standalone: true
})
export class TranslateStatusPipe implements PipeTransform {

   private statusTranslations: { [key: string]: string } = {
    accepted: 'accepté',
    refused: 'refusé',
    pending: 'en attente'
  };

  transform(value: string): string {
     return this.statusTranslations[value as keyof typeof this.statusTranslations] || value;
  }
}
