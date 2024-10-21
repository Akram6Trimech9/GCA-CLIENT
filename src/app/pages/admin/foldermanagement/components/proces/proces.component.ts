import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AffaireStatus } from '../../../../../utils/justification';
import { JustificationService } from '../../../../../services/justification.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AffaireService } from '../../../../../services/affaire.service';
import { HonorrairesComponent } from '../../modals/honorraires/honorraires.component';
import { environment } from '../../../../../../environments/environment';
import { ProcesService } from '../../../../../services/proces.service';
import { CerclesService } from '../../../../../services/cercles.service';
declare var window: any;

@Component({
  selector: 'app-proces',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PdfViewerModule
  ],
  templateUrl: './proces.component.html',
  styleUrl: './proces.component.css',
 })
export class ProcesComponent implements OnInit {
  @ViewChild('aboutissementDetailsModal') aboutissementDetailsModal!: TemplateRef<any>;
  @ViewChild('aboutissement') aboutissement!: TemplateRef<any>;
  @Input() selectedFolder: any = null;
  modal: any;
  procesForm!: FormGroup;
  procesToEdit: any = null;
  aboutissementDetails: any;
   openedFile: any;
  tribinaux !: any[]
  Proces !: any[]   ;

  years: number[] = [];
  constructor( 
    private toastr: ToastrService,

    private fb: FormBuilder, private cercleService : CerclesService, 
    private modalService: NgbModal, private _procesService: ProcesService) {

  }
  currentPage: number = 1;
  itemsPerPage: number = 1;
  totalItems: number = 0; 
  totalPages:any
  
  ngOnInit(): void {

    if(this.selectedFolder){
      this.getProcesByFolderId(this.selectedFolder._id, this.currentPage);
    }

    this.procesForm = this.fb.group({
      nbreTribunal: ['', Validators.required],
      tribunal: ['', Validators.required],
      year: ['', Validators.required],
     });
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addProcessModal')
    );

    this.cercleService.getTribinaux().subscribe({
       next:(value)=>{ 
          this.tribinaux = value
       }, error:(err)=>{
          console.log(err)
       }
    })
    const currentYear = new Date().getFullYear();
    for (let year = 1980; year <= currentYear; year++) {
      this.years.push(year);
    }

  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  getProcesByFolderId(folderId: any, page: number = 1) {
    this._procesService.getProcesByFolder(folderId, page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.Proces = response.data;  
        console.log(this.Proces,"okkk")
        this.totalItems = response.totalItems;  
        this.totalPages =response.totalPages 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  changePage(page: number) {
    this.currentPage = page;
    this.getProcesByFolderId(this.selectedFolder._id, this.currentPage);
  }
  openModal() {
    this.resetprocesForm();
    this.modal.show();
  }

  resetprocesForm() {
    this.procesForm.reset({
      numeroAffaire: '',
      natureAffaire: '',
      degre: ''
    });
    this.procesToEdit = null;
  }
  openDetailsJugement(aboutissement: any) {
    console.log(aboutissement, "aboutiss")
    this.modalService.open(this.aboutissementDetailsModal);
    this.aboutissementDetails = aboutissement

  }
 
 

  editProces(affaire: any) {
    this.procesToEdit = affaire;
    this.procesForm.patchValue(affaire);
    this.modal.show();
  }
  cancelEdit() {
    this.procesForm.reset();
    this.procesToEdit = null;
  }
  deleteProces(procesId: number) {
 
  }


 
 

  selectedFiles!: File
  onFileChange(event: any) {
    this.selectedFiles = event.target.files[0]
  }

  updateProces() {
    if (this.procesForm.valid && this.procesToEdit) {
      const updatedAffaire = { ...this.procesToEdit, ...this.procesForm.value };

      this._procesService.updateProces(updatedAffaire._id, updatedAffaire).subscribe({
        next: () => {
          const index = this.Proces.findIndex((aff: any) => aff.id === updatedAffaire.id);
          if (index !== -1) this.Proces[index] = updatedAffaire;

          this.modal.hide();
          this.resetprocesForm();
          this.procesToEdit = null;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  addNewProces() {
    console.log(this.procesForm.value); // Log the form values
  
    if (this.procesForm.valid && this.selectedFolder) {
      const formData = new FormData();
      formData.append('nbreTribunal', this.procesForm.value.nbreTribunal); // Fix this line
      formData.append('tribunal', this.procesForm.value.tribunal); // Fix this line
      formData.append('year', this.procesForm.value.year); // Fix this line
  
      if (this.selectedFiles) {
        formData.append('file', this.selectedFiles);
      }
  
      this._procesService.createProces(this.selectedFolder._id, formData).subscribe({
        next: (value) => {
          this.Proces.push(value.data);
          this.modal.hide();
          this.resetprocesForm();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }
  
}