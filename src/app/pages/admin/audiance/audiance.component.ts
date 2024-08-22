import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AudianceService } from '../../../services/audiance.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IAudiance } from '../../../core/models/audiance';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../core/models/user';
import { AuthService } from '../../../core/service/auth.service';
@Component({
  selector: 'app-audiance',
  standalone: true,
  imports: [CommonModule ,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './audiance.component.html',
  styleUrl: './audiance.component.scss'
})
export class AudianceComponent  implements OnInit{
  affaireId!: Number;
  audiances!: IAudiance[];
  audianceForm!: FormGroup;  

  constructor(
    private modalService: NgbModal,
    private _audianceService: AudianceService,
    private route: ActivatedRoute,
    private fb: FormBuilder, 
    private toastr: ToastrService ,
    private _authService : AuthService
  ) {}
  currentUser!:IUser | null ;
  ngOnInit(): void {
     this.audianceForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.currentUser = this._authService.getCurrentUser()  
  
    this.route.params.subscribe(params => {
      this.affaireId = +params['id'];
      if (this.affaireId) {
        this.loadAudiences(this.affaireId);
      } else {
        console.error('L\'identifiant de l\'affaire est indéfini ou nul.');
      }
    });
  }

  loadAudiences(affaireId: Number) {
    this._audianceService.getAudiencesByAffaireId(affaireId).subscribe({
      next: (data: IAudiance[]) => {
        this.audiances = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des audiences:', err);
      },
    });
  }

  openModal(content: any, audiance?: any) {
    const modalRef = this.modalService.open(content);
    
    if (audiance) {
      this.audianceForm.patchValue(audiance); // Set values for editing
    } else {
      this.audianceForm.reset(); // Reset the form for a new audiance
    }

    modalRef.result.then(
      (result) => {
        if (this.audianceForm.valid) {
          if (audiance) {
            this.editAudiance(this.audianceForm.value);
          } else {
            this.addAudiance(this.audianceForm.value);
          }
        }
      },
      (reason) => {
        console.log(`Dismissed: ${reason}`);
      }
    );
  }

  addAudiance(audiance: any) {
    this._audianceService.addAudience({ dateAudience: this.audianceForm.value.date, description:  this.audianceForm.value.description},this.currentUser?.id , this.affaireId).subscribe({
      next: (value: IAudiance) => {
        this.audiances.push(value);
        this.toastr.success('Audiance added successfully');
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'audiance:', err);
        this.toastr.error('Error adding audiance');
      },
    });
  }

  editAudiance(audiance: any) {
    const index = this.audiances.findIndex((a) => a.id === audiance.id);
    if (index > -1) {
      this.audiances[index] = audiance;
      this.toastr.success('Audiance updated successfully');
    }
  }

  deleteAudiance(id: Number) {
    this.audiances = this.audiances.filter((audiance) => audiance.id !== id);
    this.toastr.info('Audiance deleted successfully');
  }
}
