import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { AvaiblityService } from '../../../services/avaiblity.service';
import { IEvent } from '../../../core/models/avaible';
import { ReservationService } from '../../../services/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { EmailsService } from '../../../services/emails.service';

@Component({
  selector: 'top-header',
  standalone: true,
  imports: [NgbDatepickerModule,NgbModule,FormsModule,ReactiveFormsModule,CommonModule,NgbDatepickerModule],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss'
})
export class TopHeaderComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = '';
  displayMonths = 2;
	navigation = 'select';
	showWeekNumbers = false;
  admins: IUser[] = [];
  availabilities: any[] = [];
  selectedAdminId!: number;
  selectedAvailabilityId!: number;
  clientId!: Number | undefined; 
  reservationTime!: string;
  successMessage!: string;
  currentUser!:IUser | null
  errorMessage!: string;
  emailForm!: FormGroup;
	outsideDays = 'visible';
  // Sample consultant data
  consultants : any ; 

  selectedConsultant: any = null;
  availability: string[] = [];
  selectedTime!: any;
 
 constructor(private  _authService : AuthService ,
  private toastr: ToastrService ,
  private fb: FormBuilder,
   private _availabilityService : AvaiblityService ,private _emailService :EmailsService,  private _reservationService  : ReservationService){

 }
 open(content: TemplateRef<any>) {
  this.modalService.open(content);
}



  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  onConsultantChange() {
    if (this.selectedConsultant) {
      console.log("Selected Consultant:", this.selectedConsultant);
      this._availabilityService.getAvailabilitiesByAdmin(this.selectedConsultant?._id).subscribe(
        (data: any[]) => { 
          this.availabilities = data;
          console.log("Availabilities:", this.availabilities);
        },
        (error: any) => console.error(error)
      );
      this.availability = this.selectedConsultant.availability || [];
    } else {
      this.availability = [];
    }
  }
  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  
      message: ['', [Validators.required]],
      avocat: ['', [Validators.required]],  


    });
    this._authService.getAllAdmins().subscribe(
    {
      next : (value :any )=> {  
        this.admins = value.data
       }, error :(err)  =>{
        
      } 
    }
    );
     this.currentUser = this._authService.getCurrentUser()
     if(this.currentUser && this.currentUser._id !== null) {
       this.clientId= this.currentUser._id
     }
  }
  isAvailable(date: any): boolean {
    return this.availabilities.some(availability => {
      const availableDate = new Date(availability.date);
      return availableDate.getFullYear() === date.year &&
             availableDate.getMonth() + 1 === date.month &&
             availableDate.getDate() === date.day;
    });
  }
  getTooltip(date: any): string {
    const availability = this.availabilities.find(availability => {
      const availableDate = new Date(availability.date);
      return availableDate.getFullYear() === date.year &&
             availableDate.getMonth() + 1 === date.month &&
             availableDate.getDate() === date.day;
    });
    return availability ? `From: ${availability.startTime} To: ${availability.endTime}` : '';
  }

  onDateClick(date: any): void {
     const jsDate = new Date(date.year, date.month - 1, date.day);
       const selectedDate = new Date(date.year, date.month - 1, date.day);
       this.selectedTime=new Date(date.year, date.month - 1, date.day);
       const isExist = this.availabilities.findIndex(item => {
          const availabilityDate = new Date(item.date);
           return availabilityDate.getFullYear() === selectedDate.getFullYear() &&
                 availabilityDate.getMonth() === selectedDate.getMonth() &&
                 availabilityDate.getDate() === selectedDate.getDate();
      });
  
      // if (isExist === -1) {
      //      alert("Date is available, please select a date.");
      // } else {
      //      alert("Date is already taken.");
      // }
  
      console.log(selectedDate);  
      
  }
  submit(modal: any) {
    if (this.selectedConsultant && this.selectedTime) {
      const formattedReservationTime = this.formatReservationTime(this.reservationTime);
      this._reservationService.createReservation(this.clientId, this.selectedTime, formattedReservationTime, this.selectedConsultant._id)
        .subscribe({
          next: (reservation: any) => {
            this.successMessage = 'Réservation créée avec succès!';
            this.toastr.success(this.successMessage, 'Success'); // Show success toastr
            this.errorMessage = '';
            modal.close(); // Close modal on success
          },
          error: (error: any) => {
            console.error(error);
            this.successMessage = '';
            this.errorMessage = 'Erreur lors de la création de la réservation.';
            this.toastr.error(this.errorMessage, 'Error'); // Show error toastr
          }
        });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      this.toastr.warning(this.errorMessage, 'Warning'); // Show warning toastr
    }
  }

  private formatReservationTime(time: string): string {
    const currentDateTime = new Date();
    const [hours, minutes] = time.split(':');
    
    currentDateTime.setHours(parseInt(hours, 10));
    currentDateTime.setMinutes(parseInt(minutes, 10));
    
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0');  
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const formattedHours = String(currentDateTime.getHours()).padStart(2, '0');
    const formattedMinutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
  
     return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:${seconds}`;
  }
  
  submitEmail(modal: any) {
     modal.close();
  }

  submitPhone(modal: any) {
     modal.close();
  }

  submitContact(modal: any) {
     modal.close();
  }

  onSubmitEmailForm( modal: any ) {
    if (this.emailForm.valid) {
      const emailData = this.emailForm.value; 
      console.log('Form submitted successfully', emailData);
  
       this._emailService.createEmail(emailData).subscribe({
        next: (response) => {
          this.toastr.success('Email envoyé avec succès!', 'Success');
          modal.close()
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'envoi de l\'email.', 'Error');
          console.error(error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
 }
