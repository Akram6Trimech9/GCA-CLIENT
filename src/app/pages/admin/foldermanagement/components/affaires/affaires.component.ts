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
      dateInformation:[''],
      dateConvocation:[''],
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
  
    console.log(affaire,"okkk")
    // Convert date fields to 'yyyy-MM-dd' format for date inputs
    const patchedAffaire = {
      ...affaire,
      dateDemande: affaire.dateDemande ? this.formatDate(affaire.dateDemande) : '',
      dateInformation: affaire.dateInformation ? this.formatDate(affaire.dateInformation) : '',
      dateConvocation: affaire.dateConvocation ? this.formatDate(affaire.dateConvocation) : ''
    };
      this.affaireForm.patchValue(patchedAffaire);
    this.modal.show();
  }
  
  formatDate(date: string): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
  
    return [year, (month.length < 2 ? '0' : '') + month, (day.length < 2 ? '0' : '') + day].join('-');
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
  openAboutissement(aboutissement: any) {
    this.aboutissementId = aboutissement._id
    console.log(aboutissement,"aboutiissement")
    this.justification.avocatAssocie = aboutissement.avocatAssocie
    this.justification.type = aboutissement.type

    this.justification.dateInformation = aboutissement.dateInformation ? this.formatDate(aboutissement.dateInformation) : ''
     this.justification.natureJugement = aboutissement?.natureJugement
    this.justification.situationClient = aboutissement?.situationClient
    this.justification.date = aboutissement.date ? this.formatDate(aboutissement.date) : ''

 
     this.modalService.open(this.aboutissement);
  }
  pdfJugement: any
  openPdf(url: string) {
    this.pdfJugement = `${environment.picUrl}${url}`;
    console.log(this.pdfJugement, "pdf")
  }
  justification = {
    type: '',
    date: '',
    dateInformation: '',
     natureJugement: '',
    situationClient: '',
    avocatAssocie: '',
  };
  
  selectedDateType: string = '';

  onTypeChange() {
    this.selectedDateType = '';  
  }
  onDateTypeChange() {
    // You can add any additional logic if needed
  }
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

          this.affaires.forEach(item => { 
            if(item.aboutissement._id === this.aboutissementId) {
                item.aboutissement = value;  
            }
        });
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
 
      if (this.justification.natureJugement) {
        formData.append('natureJugement', this.justification.natureJugement);
      }

      if (this.justification.dateInformation) {
        formData.append('dateInformation', this.justification.dateInformation);
      }
      if (this.justification.avocatAssocie) {
        formData.append('avocatAssocie', this.justification.avocatAssocie);
      }

      this._justificationService.updateJustification(this.aboutissementId, formData).subscribe({
        next: (value) => {

          this.toastr.success('Modification réussie');
          this.modalService.dismissAll();
           this.affaires.forEach(item => { 
            this.affaires.forEach(item => { 
              if(item.aboutissement._id === this.aboutissementId) {
                  item.aboutissement = value;  
              }
          });
         })
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
      // Extract form values
      const { numeroAffaire, natureAffaire, degre, statusClient, dateDemande, dateInformation, dateConvocation } = this.affaireForm.value;
    
      // Check if another affaire with the same properties exists
      const duplicateAffaire = this.affaires.some(
        (aff) =>
          aff._id !== this.affaireToEdit._id && // Make sure it's not the current affair being edited
          aff.numeroAffaire === numeroAffaire &&
          aff.natureAffaire === natureAffaire &&
          aff.degre === degre
      );
    
      if (duplicateAffaire) {
        // Show a warning message if a duplicate is found
        this.toastr.error('Affaire with the same details already exists.');
        return; // Prevent the update
      }
    
      // Create the updated affaire object
      const updatedAffaire = {
        ...this.affaireToEdit, // Start with the existing affaire
        numeroAffaire: numeroAffaire || this.affaireToEdit.numeroAffaire,
        natureAffaire: natureAffaire || this.affaireToEdit.natureAffaire,
        degre: degre || this.affaireToEdit.degre,
        statusClient: statusClient || this.affaireToEdit.statusClient,
      };
  
      // Prepare FormData to send individual updates
      const formData = new FormData();
      formData.append('numeroAffaire', updatedAffaire.numeroAffaire);
      formData.append('natureAffaire', updatedAffaire.natureAffaire);
      formData.append('degre', updatedAffaire.degre);
      formData.append('statusClient', updatedAffaire.statusClient);
  
      // Handle date fields with validation
      if (dateDemande) {
        formData.append('dateDemande', new Date(dateDemande).toISOString());
      } else {
        formData.append('dateDemande', this.affaireToEdit.dateDemande ? new Date(this.affaireToEdit.dateDemande).toISOString() : '');
      }
  
      if (dateInformation) {
        formData.append('dateInformation', new Date(dateInformation).toISOString());
      } else {
        formData.append('dateInformation', this.affaireToEdit.dateInformation ? new Date(this.affaireToEdit.dateInformation).toISOString() : '');
      }
  
      if (dateConvocation) {
        formData.append('dateConvocation', new Date(dateConvocation).toISOString());
      } else {
        formData.append('dateConvocation', this.affaireToEdit.dateConvocation ? new Date(this.affaireToEdit.dateConvocation).toISOString() : '');
      }
  
      // Append the file if selected
      if (this.selectedFiles) {
        formData.append('file', this.selectedFiles);
      }
  
      // Log the updated form data
      console.log('FormData:', formData);
  
      // Call the service to update the affaire
      this.affaireService.updateAffaire(this.affaireToEdit._id, formData).subscribe({
        next: () => {
          // Update the local affaires array with the updated affaire
          const index = this.affaires.findIndex((aff) => aff._id === updatedAffaire._id);
          if (index !== -1) {
            this.affaires[index] = { ...this.affaires[index], ...updatedAffaire }; // Merge updated affaire data
          }
  
          // Close the modal and show success message
          this.modal.hide();
          this.toastr.success('Affaire updated successfully');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Failed to update affaire');
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields.');
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
      if (this.affaireForm.value.dateConvocation) {
        formData.append('dateConvocation', this.affaireForm.value.dateConvocation);
      }
      if (this.affaireForm.value.dateInformation) {
        formData.append('dateInformation', this.affaireForm.value.dateInformation);
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
