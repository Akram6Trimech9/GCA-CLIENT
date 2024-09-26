import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffaireService } from '../../../services/affaire.service';
import { AuthService } from '../../../core/service/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mes-affaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mes-affaires.component.html',
  styleUrls: ['./mes-affaires.component.scss']
})
export class MesAffairesComponent implements OnInit {

  currentUser: any;
  affaires!: any;
  selectedAffaire: any;

  constructor(
    private _affaireService: AffaireService, 
    private _authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();  
    this.getAffaireByClient();
  }

  getAffaireByClient() {
    this._affaireService.getAllAffaireByClient(this.currentUser._id).subscribe({
      next: (value) => {
        this.affaires = value;
        console.log(value);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openModal(content: any, affaire: any) {
    this.selectedAffaire = affaire;
    this.modalService.open(content, { size: 'lg' });
  }

  openPDF(fileUrl: string) {
    const trueUrl = `${environment.picUrl}${fileUrl}`
    window.open(trueUrl, '_blank');
  }
}
