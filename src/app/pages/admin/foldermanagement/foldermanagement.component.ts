import { Component, OnInit } from '@angular/core';
import { DossiersService } from '../../../services/dossiers.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AffaireService } from '../../../services/affaire.service';
import { RouterModule } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-foldermanagement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './foldermanagement.component.html',
  styleUrls: ['./foldermanagement.component.scss']
})
export class FoldermanagementComponent implements OnInit {
  dossiers!: any[];
  selectedFolder: any = null;
  affaires!: any[];
  selectedAffaire: any = null;
  modal: any;
  affaireForm!: FormGroup;
  affaireToEdit: any = null;

  constructor(
    private fb: FormBuilder,
    private _folderService: DossiersService,
    private affaireService: AffaireService
  ) {}

  ngOnInit(): void {
    this.getFolderByAdmin();
    this.initializeForm();
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addAffaireModal')
    );
  }

  initializeForm() {
    this.affaireForm = this.fb.group({
      numeroAffaire: ['', Validators.required],
      natureAffaire: ['', Validators.required],
      dateAudience: ['', Validators.required],
      aboutissement: [false]
    });
  }

  getFolderByAdmin() {
    this._folderService.getFolderByAdminId().subscribe({
      next: (folders) => {
        this.dossiers = folders;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openFolder(folder: any) {
    this.selectedFolder = folder;
    this.getAffairesByDossierId(folder.id);  
  }

  goBack() {
    this.selectedFolder = null;
    this.selectedAffaire = null;
  }

  getAffairesByDossierId(dossierId: number) {
    this.affaireService.fetchAffaires(dossierId).subscribe({
      next: (affaires) => {
        this.affaires = affaires;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

   openModal() {
    this.resetAffaireForm(); 
    this.modal.show();
  }

   addNewAffaire() {
    if (this.affaireForm.valid && this.selectedFolder) {
      const affaire = this.affaireForm.value;

      this.affaireService.addAffaire( affaire,this.selectedFolder.id,).subscribe({
        next: (newAffaire) => {
           this.affaires.push(newAffaire);
          this.modal.hide(); 
          this.resetAffaireForm(); 
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

   editAffaire(affaire: any) {
    this.affaireToEdit = affaire;
    this.affaireForm.patchValue(affaire);
    this.modal.show();
  }

   updateAffaire() {
    if (this.affaireForm.valid && this.affaireToEdit) {
      const updatedAffaire = { ...this.affaireToEdit, ...this.affaireForm.value };

      this.affaireService.updateAffaire(updatedAffaire.id, updatedAffaire).subscribe({
        next: () => {
           const index = this.affaires.findIndex((aff) => aff.id === updatedAffaire.id);
          if (index !== -1) this.affaires[index] = updatedAffaire;

          this.modal.hide(); 
          this.resetAffaireForm();  
          this.affaireToEdit = null;  
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

   resetAffaireForm() {
    this.affaireForm.reset({
      numeroAffaire: '',
      natureAffaire: '',
      dateAudience: '',
      aboutissement: false
    });
    this.affaireToEdit = null;
  }

  trackByFn(index: number, item: any) {
    return index;
  }
  cancelEdit() {
    this.affaireForm.reset();
    this.affaireToEdit = null;  
  }
  deleteAffaire(affaireId: number) {
    this.affaireService.deleteAffaire(affaireId).subscribe({
      next: () => {
        this.affaires = this.affaires.filter(aff => aff.id !== affaireId); 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
