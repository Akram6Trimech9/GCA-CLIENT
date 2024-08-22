import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { AvaiblityService } from '../../../services/avaiblity.service';
import { IEvent } from '../../../core/models/avaible';
import { ReservationService } from '../../../services/reservation.service';

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
	outsideDays = 'visible';
  // Sample consultant data
  consultants : any ; 

  selectedConsultant: any = null;
  availability: string[] = [];
  selectedTime!: any;
 constructor(private  _authService : AuthService , private _availabilityService : AvaiblityService , private _reservationService  : ReservationService){

 }
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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
      this._availabilityService.getAvailabilitiesByAdmin(this.selectedConsultant?.id).subscribe(
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
    this._authService.getAllAdmins().subscribe(
    {
      next : (value )=> {  
        this.admins = value 
       }, error :(err)  =>{
        
      } 
    }
    );
     this.currentUser = this._authService.getCurrentUser()
     if(this.currentUser && this.currentUser.id !== null) {
       this.clientId= this.currentUser.id
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

       const isExist = this.availabilities.findIndex(item => {
          const availabilityDate = new Date(item.date);
           return availabilityDate.getFullYear() === selectedDate.getFullYear() &&
                 availabilityDate.getMonth() === selectedDate.getMonth() &&
                 availabilityDate.getDate() === selectedDate.getDate();
      });
  
      if (isExist === -1) {
           alert("Date is available, please select a date.");
      } else {
           alert("Date is already taken.");
      }
  
      console.log(selectedDate);  
      
  }
   submit(){
    console.log("ko")
    console.log(this.selectedTime,this.selectedConsultant,"selectedConsultant",this.clientId)

    if ( this.selectedConsultant && this.selectedTime) {
       const formattedReservationTime = this.formatReservationTime(this.reservationTime);
       console.log(this.selectedConsultant)
      this._reservationService.createReservation(this.clientId, this.selectedTime, formattedReservationTime)
        .subscribe({
          next: (reservation: any) => {
            this.successMessage = 'Réservation créée avec succès!';
            this.errorMessage = '';
           },
          error: (error: any) => {
            console.error(error);
            this.successMessage = '';
            this.errorMessage = 'Erreur lors de la création de la réservation.';
          }
        });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
    }
  }
  private formatReservationTime(time: string): string {
    const currentDateTime = new Date();
    const [hours, minutes] = time.split(':');
    
    currentDateTime.setHours(parseInt(hours, 10));
    currentDateTime.setMinutes(parseInt(minutes, 10));
    
    const year = currentDateTime.getFullYear();
    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so we add 1
    const day = String(currentDateTime.getDate()).padStart(2, '0');
    const formattedHours = String(currentDateTime.getHours()).padStart(2, '0');
    const formattedMinutes = String(currentDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
  
     return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:${seconds}`;
  }
  
}
