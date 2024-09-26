import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent, CalendarModule, DateAdapter, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { AvaiblityService } from '../../../services/avaiblity.service';
import { IEvent } from '../../../core/models/avaible';
import { ToastrService } from 'ngx-toastr';
import localeFr from '@angular/common/locales/fr';  
export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
registerLocaleData(localeFr);
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {
  selectedEvent!: IEvent    ;
  view: CalendarView = CalendarView.Month;
    snapDraggedEvents = true;
    locale: string = 'fr';
  dayStartHour = 6;
  viewDate: Date = new Date();
  events: any[] = [];
  refresh: Subject<any> = new Subject();
  availabilityForm: FormGroup;
  currentUser !: IUser  | null ; 
  constructor(private fb: FormBuilder ,private modalService: NgbModal , private _authService : AuthService , private _avaiblityService : AvaiblityService , private toastr: ToastrService ) {
    this.availabilityForm = this.fb.group({
      availabilityDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      availabilityDetails: ['', Validators.required],
    });
  }
  adminId !:Number
  ngOnInit(): void {
  
    this.currentUser = this._authService.getCurrentUser()  
    if(this.currentUser?._id){ 
      this.adminId = this.currentUser?._id
    }
    console.log(this.currentUser ,"ok")
    this._avaiblityService.getAvailabilitiesByAdmin(this.adminId).subscribe({
      next: (value) => {
        console.log('Received events:', value);
        this.events = value.map(event => {
          const start = new Date(event.date);
          const end = new Date(event.date);
          const details  = event.details
          console.log(`Start: ${start}, End: ${end}`); 
          return {
            ...event,
            start,
            details,
            end
          };
        });
        this.refresh.next(null);
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
    
 
  }
  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next(null);
  }

  public segmentIsValid(date: Date) {
    return date.getHours() >= 8 && date.getHours() <= 17;
  }

  beforeDayViewRender(day: CalendarDayViewBeforeRenderEvent): void {}

  beforeWeekViewRender(body: CalendarWeekViewBeforeRenderEvent): void {
    body.hourColumns.forEach((hourCol) => {
      hourCol.hours.forEach((hour) => {
        hour.segments.forEach((segment) => {
          if (!this.segmentIsValid(segment.date)) {
            delete segment.cssClass;
            segment.cssClass = 'cal-disabled';
          }
        });
      });
    });
  }

  addAvailability(): void {
    const { availabilityDate, startTime, endTime, availabilityDetails } = this.availabilityForm.value;


    if (this.currentUser?._id ) {
      const availability :IEvent = {
        date: availabilityDate,
        startTime:startTime ,
        endTime: endTime,
        details:availabilityDetails
      };
      this._avaiblityService.createAvailability(this.currentUser._id, availability)
        .subscribe({
          next:(value)=> {
            const newEvent: any = {
              title: `Disponibilité`,
              start: new Date(`${value.date} `),
              end: new Date(`${value.date}`),
              color: colors.red,
              meta: {
                details: availabilityDetails,
              },
              startTime:value.startTime ,
              endTime:value.endTime ,

            };
        
            this.events = [...this.events, newEvent];
            console.log(this.events,"events")
             console.log(value,"value")
            this.refresh.next(null);
            this.availabilityForm.reset();
          },error:(err)=> {
            
          },
    
      
        }
        );
    } else {
      console.error('Veuillez remplir tous les champs.');
    }
   
  }
  modalRef!: NgbModalRef;
  handleEvent(event: any, content: any): void {
    this.selectedEvent = event.event;
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  deleteEvent(eventId: any): void {
    this._avaiblityService.deleteAvaibility(eventId).subscribe({
      next: (response) => {
        this.events = this.events.filter(event => event._id !== eventId);
        this.toastr.success('Événement supprimé avec succès', 'Succès');
        this.refresh.next(null);
        if (this.modalRef) {
          this.modalRef.close('Event deleted');
        }
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la suppression de l\'événement', 'Erreur');
      }
    });
  }
  
  
}