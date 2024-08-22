import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent, CalendarModule, DateAdapter } from 'angular-calendar';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { AvaiblityService } from '../../../services/avaiblity.service';
import { IEvent } from '../../../core/models/avaible';

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

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CalendarModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent  implements OnInit {
  selectedEvent!: IEvent    ;
  view: string = 'month';
  snapDraggedEvents = true;
  dayStartHour = 6;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  availabilityForm: FormGroup;
  currentUser !: IUser  | null ; 
  constructor(private fb: FormBuilder ,private modalService: NgbModal , private _authService : AuthService , private _avaiblityService : AvaiblityService) {
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
    if(this.currentUser?.id){ 
      this.adminId = this.currentUser?.id
    }
    this._avaiblityService.getAvailabilitiesByAdmin(this.adminId).subscribe({
      next: (value) => {
        console.log('Received events:', value);
        this.events = value.map(event => {
          const start = new Date(event.date);
          const end = new Date(event.date);
          console.log(`Start: ${start}, End: ${end}`); 
          return {
            ...event,
            start,
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

    const newEvent: CalendarEvent = {
      title: `Disponibilité`,
      start: new Date(`${availabilityDate}T${startTime}`),
      end: new Date(`${availabilityDate}T${endTime}`),
      color: colors.red,
      meta: {
        details: availabilityDetails,
      },
    };

    this.events = [...this.events, newEvent];
    if (this.currentUser?.id ) {
      const availability :IEvent = {
        date: availabilityDate,
        startTime:startTime ,
        endTime: endTime
      };
      this._avaiblityService.createAvailability(this.currentUser.id, availability)
        .subscribe({
          next:(value)=> {
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
  handleEvent(event: any, content: any): void {
     this.selectedEvent = event.event;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
}