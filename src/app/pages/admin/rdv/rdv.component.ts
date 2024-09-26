import { Component } from '@angular/core';
import { ReservationService } from '../../../services/reservation.service';
import { RdvService } from '../../../services/rdv.service';
import { CommonModule } from '@angular/common';
import { TranslateStatusPipe } from '../../../utils/translateStatus.pipe';
import { IUser } from '../../../core/models/user';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rdv.component.html',
  styleUrl: './rdv.component.scss'
})
export class RdvComponent {
  pendingRdvs: any[] = [];
  errorMessage: string ='';
  successMessage: string ='';
  currentUser !: IUser  | null ; 

  constructor(private rdvService: RdvService, private _authService : AuthService) { }
  adminId !:any

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()  
    if(this.currentUser?._id){ 
       this.adminId = this.currentUser?._id
      this.loadPendingRdvs(this.currentUser._id);

    }

  }

  loadPendingRdvs(id:any): void {
    this.rdvService.getPendingRdvs(id).subscribe(
      (data: any[]) => {this.pendingRdvs = data;
          
      },
      (error: any) => {
        console.error(error);
        if (error.status === 403) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à accéder à ces données.';
        } else {
          this.errorMessage = 'Erreur lors de la récupération des rendez-vous en attente.';
        }
      }
    );
  }

  getClientIdFromLocalStorage(): number | null {
    const userString = localStorage.getItem('userconnected');
    if (userString) {
      const user = JSON.parse(userString);
      return user?.id;
    }
    return null;
  }

  confirmReservation(availabilityId: number): void {
    const clientId = this.getClientIdFromLocalStorage();
    if (clientId) {
      this.rdvService.confirmReservation(clientId, availabilityId).subscribe({
        next: (data: any) => {
          this.successMessage = 'Réservation confirmée avec succès!';
          this.errorMessage = '';
          this.loadPendingRdvs(this.adminId); 
        },
        error: (error: any) => {
          console.error(error);
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de la confirmation de la réservation.';
        }
      });
    } else {
      this.errorMessage = 'Erreur: Utilisateur non connecté.';
    }
  }

  acceptRdv(id: String): void {
    this.rdvService.acceptRdv(id).subscribe({
      next: () => {
        this.successMessage = 'Rendez-vous accepté avec succès!';
        this.errorMessage = '';
        this.loadPendingRdvs(this.adminId); 
      },
      error: (error: any) => {
        console.error(error);
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de l\'acceptation du rendez-vous.';
      }
    });
  }

  rejectRdv(id: String): void {
    this.rdvService.rejectRdv(id).subscribe({
      next: () => {
        this.successMessage = 'Rendez-vous rejeté avec succès!';
        this.errorMessage = '';
        this.loadPendingRdvs(this.adminId); 
      },
      error: (error: any) => {
        console.error(error);
        this.successMessage = '';
        this.errorMessage = 'Erreur lors du rejet du rendez-vous.';
      }
    });
  }
  delete(id:String){

  }
}
