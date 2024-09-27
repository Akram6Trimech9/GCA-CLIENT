import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepenseService } from '../../../services/depense.service';
import { intervenantService } from '../../../services/inventaire.service';
import { AudianceService } from '../../../services/audiance.service';
import { DossiersService } from '../../../services/dossiers.service';
import { AuthService } from '../../../core/service/auth.service';
import { CreditService } from '../../../services/credit.service';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { endOfDay, startOfDay } from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailsService } from '../../../services/emails.service';
import { FormsModule } from '@angular/forms';
 @Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule ,CalendarModule , FormsModule],  
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
     currentUser: any;
    folder: any; 
    depense: number = 0;
    locale: string = 'fr';
  emails !:any[]
    view: CalendarView = CalendarView.Month;
    viewDate: Date = new Date();
    audianceEvents: CalendarEvent[] = [];
    refresh: Subject<any> = new Subject();
    selectedEvent: any 
    constructor(
      private _authService: AuthService, 
      private depenseService: DepenseService, 
      private folderService: DossiersService, 
      private audianceService: AudianceService,
      private modalService: NgbModal,
      private _emailService :EmailsService
    ) {}
  
    ngOnInit(): void {
      this.currentUser = this._authService.getCurrentUser();  
      this.getFolder();
      this.getDepense();
      this.getAudiances();
      this.getEmails()
    }
    getEmails(){
      this._emailService.getEmailsByAvocat(this.currentUser._id).subscribe({
         next:(value)=>{
          this.emails= value
         },error:(err)=>{
            console.log(err)
         }
      })
    }
    getFolder() {
      this.folderService.getFolderByAdminId(this.currentUser._id).subscribe({
        next: (value) => {
          this.folder = value.length;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    onActionChange(event: any, item: any) {
      const action = event.target.value;
      if (action === 'delete') {
        this.deleteEmail(item);
      } else if (action === 'send') {
        this.openEmailModal(item.email);
      }
      event.target.value = ''; // Reset select
    }

    deleteEmail(item: any) {
      // Add logic to delete email
    }

      
    emailSubject: string = '';
    emailBody: string = '';
    openEmailModal(email: string) {
      this.emailSubject = '';
      this.emailBody = '';
      this.modalService.open(   { ariaLabelledBy: 'modal-basic-title' });
    }
  
    getDepense() {
      this.depenseService.getTotalByAdmin(this.currentUser._id).subscribe({ 
        next: (value) => { 
          if (value.total) { 
            this.depense = value.total;
          }
          console.log(value);
        },
        error: (err) => { 
          console.log(err);
        }
      });
    }
  
    getAudiances() {
      this.audianceService.getAllByAdmin(this.currentUser._id).subscribe({
        next: (audiances) => {
          this.audianceEvents = audiances.map((audiance:any) => ({
            start: startOfDay(new Date(audiance.dateAudiance)),
            end: endOfDay(new Date(audiance.dateAudiance)),
            title: audiance.description,
            color: { primary: '#1e90ff', secondary: '#D1E8FF' }, // Customize event color
            meta: audiance // To store extra data
          }));
          this.refresh.next(undefined); 
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    eventClicked({ event }: { event: CalendarEvent }, content: any): void {
      console.log(event.meta,"event")
      this.selectedEvent = event.meta;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
    submitEmail() {
      const emailData = {
        subject: this.emailSubject,
        body: this.emailBody
      };
      
      
    }  
}
