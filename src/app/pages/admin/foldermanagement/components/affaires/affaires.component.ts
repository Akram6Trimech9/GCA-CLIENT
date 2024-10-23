import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HonorrairesComponent } from '../../modals/honorraires/honorraires.component';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AffaireService } from '../../../../../services/affaire.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { JustificationService } from '../../../../../services/justification.service';
import { ToastrService } from 'ngx-toastr';
import { AffaireStatus } from '../../../../../utils/justification';
declare var window: any;
@Component({
  selector: 'app-affaires',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PdfViewerModule
  ],
  templateUrl: './affaire.component.html',
  styleUrl: './affaires.component.scss',
})
export class AffairesComponent implements OnInit {
  @ViewChild('aboutissementDetailsModal') aboutissementDetailsModal!: TemplateRef<any>;
  @ViewChild('aboutissement') aboutissement!: TemplateRef<any>;
  @Input() affaires: any[] = [];
  @Input() selectedFolder: any = null;
  modal: any;
  affaireForm!: FormGroup;
  affaireToEdit: any = null;
  aboutissementDetails: any;
   openedFile: any;
  justificationTypes = Object.values(AffaireStatus);
  situationClientOptions = [
    'Actif',
    'Inactif',
    'En Procédure',
    'En Rétablissement'
  ];

  degreOptions = [
    { value: 'première_instance', label: 'Première Instance' },
    { value: 'appel', label: 'Appel' },
    { value: 'cassation', label: 'Cassastion' },
    { value: 'demande de réexamen', label: 'Demande de réexamen' },
    { value: 'oppositionPremier', label: 'opposition ( sur premiére instance )' },
    { value: 'oppositionAppel', label: 'opposition ( sur appel )' }

  ];

  statusClients =[
     {value :'Plaignant' , label :'plaignant'},
     {value :'Accusé' , label :'accuse'},
  ]

  categoryOption = [
    { value: 'civil', label: 'Civil' },
    { value: 'pénale', label: 'Pénal' },
    { value: 'commercial', label: 'Commercial' },
     { value: 'immobilère', label: 'Immobilère' },
    { value: 'militaire', label: 'Militaire' },
    { value: 'administrative', label: 'Administrative' }

  ];

  natureAffaireOption = [
    { value: 'mise à jour', label: 'Mise à jour' },
    { value: 'enregistrement facultatif', label: 'Enregistrement facultatif' },
    { value: 'incartade', label: 'Incartade' },
    { value: 'criminelle', label: 'Criminelle' },
    { value: 'enfants délinquants', label: 'Enfants délinquants' },
    { value: 'enfants-incartade', label: 'Enfants incartade' }

  ];
 
  natureJugement = [
    { value: 'presence', label: 'Présence' },
    { value: 'absence', label: 'Absence' },
   ]
  constructor(private _justificationService: JustificationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal, private affaireService: AffaireService) {

  }

  selectedCategory: any;
  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    
     if (this.selectedCategory === 'immobilère') {
      this.natureAffaireOption = [ 
        { value: 'mise à jour', label: 'Mise à jour' },
        { value: 'enregistrement facultatif', label: 'Enregistrement facultatif' },
        ]
    } else {
      this.natureAffaireOption =  [ 
         { value: 'incartade', label: 'Incartade' },
        { value: 'criminelle', label: 'Criminelle' },
        { value: 'enfants délinquants', label: 'Enfants délinquants' },
        { value: 'enfants-incartade', label: 'Enfants incartade' }
        ]
    } 
  }
  ngOnInit(): void {
    this.affaireForm = this.fb.group({
      numeroAffaire: ['', Validators.required],
      natureAffaire: ['', Validators.required],
      category: ['', Validators.required],
      degre: ['', Validators.required],
      opposite: ['', Validators.required],
      statusClient: [''] , 
      dateDemande: [''],
 
    });
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addAffaireModal')
    );
  }


  openModal() {
    this.resetAffaireForm();
    this.modal.show();
  }

  resetAffaireForm() {
    this.affaireForm.reset({
      numeroAffaire: '',
      natureAffaire: '',
      degre: ''
    });
    this.affaireToEdit = null;
  }
  openDetailsJugement(aboutissement: any) {
    console.log(aboutissement, "aboutiss")
    this.modalService.open(this.aboutissementDetailsModal);
    this.aboutissementDetails = aboutissement

  }
  openHonorairesModal(client: any, affaire: any) {
    console.log(affaire, "affaire")
    const modalRef = this.modalService.open(HonorrairesComponent, {

      backdrop: 'static',
      size: 'xl'
    });

    modalRef.componentInstance.credit = affaire.credit;

    modalRef.componentInstance.client = client;
    modalRef.componentInstance.affaire = affaire;

    modalRef.result.then(
      result => {
        console.log('Modal closed with:', result);
      },
      reason => {
        console.log('Modal dismissed');
      }
    );
  }

  openPdfModal(url: any, content: TemplateRef<any>) {
    this.openedFile = `${environment.picUrl}${url}`
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
      }
    );
  }

  editAffaire(affaire: any) {
    this.affaireToEdit = affaire;
    this.affaireForm.patchValue(affaire);
    this.modal.show();
  }
  cancelEdit() {
    this.affaireForm.reset();
    this.affaireToEdit = null;
  }
  deleteAffaire(affaireId: number) {
    this.affaireService.deleteAffaire(affaireId).subscribe({
      next: () => {
        this.affaires = this.affaires.filter(aff => aff._id !== affaireId);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  aboutissementId: any;
  openAboutissement(id: any) {
    this.aboutissementId = id
    this.modalService.open(this.aboutissement);
  }
  pdfJugement: any
  openPdf(url: string) {
    this.pdfJugement = `${environment.picUrl}${url}`;
    console.log(this.pdfJugement, "pdf")
  }
  justification = {
    date: null,
    type: '',
    copieJugement: '',
    situationClient: '',
    avocatAssocie: '',
    natureJugement:''
  };
  selectedJugement: any
  onFileChangeJugement(event: any) {
    const file = event.target.files[0];


    if (file) {
      this.selectedJugement = file;
    }
  }
  confirmAboutissement(modal: any) {

    if (this.justification.type !== 'Jugee') {
      const record = {
        type: this.justification.type
      };

      this._justificationService.updateJustification(this.aboutissementId, record).subscribe({
        next: (value) => {
          this.toastr.success('Modification réussie');
          this.modalService.dismissAll();
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la modification');
        }
      });
    } else {
      const formData = new FormData();

      if (this.justification.date) {
        formData.append('date', this.justification.date);
      }
      if (this.justification.type) {
        formData.append('type', this.justification.type);
      }
      if (this.selectedJugement) {
        formData.append('file', this.selectedJugement);
      }
      if (this.justification.situationClient) {
        formData.append('situationClient', this.justification.situationClient);
      }
      if (this.justification.avocatAssocie) {
        formData.append('avocatAssocie', this.justification.avocatAssocie);
      }

      this._justificationService.updateJustification(this.aboutissementId, formData).subscribe({
        next: (value) => {
          this.toastr.success('Modification réussie');
          this.modalService.dismissAll();
          console.log(value);
        },
        error: (err) => {
          this.toastr.error('Erreur lors de la modification');
        }
      });
    }
  }
  selectedFiles!: File
  onFileChange(event: any) {
    this.selectedFiles = event.target.files[0]
  }

  updateAffaire() {
    if (this.affaireForm.valid && this.affaireToEdit) {
      const updatedAffaire = { ...this.affaireToEdit, ...this.affaireForm.value };

      this.affaireService.updateAffaire(updatedAffaire._id, updatedAffaire).subscribe({
        next: () => {
          const index = this.affaires.findIndex((aff) => aff.id === updatedAffaire.id);
          if (index !== -1) this.affaires[index] = updatedAffaire;

          this.modal.hide();
          this.resetAffaireForm();
          this.affaireToEdit = null;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  addNewAffaire() {
    if (this.affaireForm.valid && this.selectedFolder) {
      const formData = new FormData();
      formData.append('numeroAffaire', this.affaireForm.value.numeroAffaire);
      formData.append('natureAffaire', this.affaireForm.value.natureAffaire);
      formData.append('degre', this.affaireForm.value.degre);
      formData.append('opposite', this.affaireForm.value.opposite);
       formData.append('category', this.affaireForm.value.category);
      if (this.affaireForm.value.statusClient) {
        formData.append('statusClient', this.affaireForm.value.statusClient);
      }
      
      if (this.affaireForm.value.dateDemande) {
        formData.append('dateDemande', this.affaireForm.value.dateDemande);
      }
      
      if (this.selectedFiles) {
        formData.append('file', this.selectedFiles);
      }
  
      this.affaireService.addAffaire(formData, this.selectedFolder._id).subscribe({
        next: (newAffaire) => {
          this.affaires.push(newAffaire.data);
          this.modal.hide();
          this.resetAffaireForm();
          this.toastr.success('Affaire ajoutée avec succès'); // Success message
        },
        error: (err) => {
          this.toastr.error('Erreur lors de l\'ajout de l\'affaire'); // Error message
          console.error(err);
        }
      });
    } else {
         Object.keys(this.affaireForm.controls).forEach(key => {
          const control = this.affaireForm.get(key);
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(subKey => {
              const subControl = control.get(subKey);
              if (subControl?.invalid) {
                this.toastr.warning(`Le champ ${subKey} est requis.`); // Custom message for each field
              }
            });
          } else if (control?.invalid) {
            this.toastr.warning(`Le champ ${key} est requis.`);
          }
        });
     }
  }
  getAffairesByDossierId(dossierId: number) {
    this.affaireService.fetchAffaires(dossierId).subscribe({
      next: (affaires: any) => {
        this.affaires = affaires.data;
      },
      error: (err) => {
        this.affaires = []
        console.error(err);
      }
    });
  }
  generateFacture(affaireId: any) {
    this.affaireService.generateFacture(affaireId).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${affaireId}.pdf`;
        a.click();

        window.open(url);

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
      }
    });
  }
}
