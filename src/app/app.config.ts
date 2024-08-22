import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })),
      provideAnimations(), 
    provideToastr(),  
   provideRouter(routes) ,  importProvidersFrom(NgbModule),    provideHttpClient(withFetch())
    ,
    importProvidersFrom(CalendarModule),]
};
