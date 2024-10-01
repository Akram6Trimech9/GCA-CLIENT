import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DossiersService } from '../../../services/dossiers.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AffaireService } from '../../../services/affaire.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
 import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HonorrairesComponent } from './modals/honorraires/honorraires.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { intervenantService } from '../../../services/inventaire.service';
import { AffaireStatus } from '../../../utils/justification';
import { JustificationService } from '../../../services/justification.service';
import { ToastrService } from 'ngx-toastr';
declare var window: any;

@Component({
  selector: 'app-foldermanagement',
  standalone: true,
  imports: [CommonModule, FormsModule, PdfViewerModule,ReactiveFormsModule, RouterModule ,NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
  NgSelectModule],
  templateUrl: './foldermanagement.component.html',
  styleUrls: ['./foldermanagement.component.scss']
})
export class FoldermanagementComponent implements OnInit {
  dossiers!: any[];
  selectedFolder: any = null;
  affaires: any[]=[];
  selectedAffaire: any = null;
  modal: any;
  affaireForm!: FormGroup;
  affaireToEdit: any = null;
  intervenants!:any[]
  folderForm!: FormGroup;
  clients:any[]=[]
  currentUser !: IUser  | null ; 
  adminId:any;
  users: any[] = [];
  justification = {
    date: null,
    type: '',
    copieJugement: '',
    situationClient: '',
    avocatAssocie: ''
  };
  selectedJugement: any
  onFileChangeJugement(event: any) {
    const file = event.target.files[0];

    
    if (file) {
      this.selectedJugement = file;
     }
  }
  situationClientOptions = [
    'Actif',
    'Inactif',
    'En Procédure',
    'En Rétablissement'
  ];

  degreOptions = [
    { value: 'première_instance', label: 'Première Instance' },
    { value: 'appel', label: 'Appel' },
    { value: 'cour_suprême', label: 'Cour Suprême' }
  ];
  
  natureAffaireOptions = [
    { value: 'civil', label: 'Civil' },
    { value: 'penal', label: 'Pénal' },
    { value: 'commercial', label: 'Commercial' }
  ];
  
  justificationTypes = Object.values(AffaireStatus);


  selectedFolderId: any;
  @ViewChild('userSelectionModal') userSelectionModal!: TemplateRef<any>;
  @ViewChild('aboutissementDetailsModal') aboutissementDetailsModal!: TemplateRef<any>;

  @ViewChild('aboutissement') aboutissement!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private _folderService: DossiersService,
    private _userService : AuthService,
    private affaireService: AffaireService,
    private _authService : AuthService,
    private  _intervenantService :   intervenantService,
    private modalService: NgbModal , 
    private _justificationService : JustificationService , 
    private toastr : ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()  
    if(this.currentUser?._id){ 
       this.adminId = this.currentUser?._id
       this.getClients(this.adminId)

    }
    this.getFolderByAdmin();
    this.initializeForms();
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addAffaireModal')
    );
    this.getInterventaire()
  }

  getInterventaire(){
    this._intervenantService.getAllintervenant().subscribe({
       next:(value :any)=>{
          this.intervenants = value.data
       },error:(err)=>{
        console.log(err)
       }
    })
  }
  selectedFiles!:File
  onFileChange(event : any){
   this.selectedFiles = event.target.files[0]
    console.log(this.selectedFiles,"selected")
  }

  getClients(id:any){
    this._userService.getAllClients(id).subscribe({
       next:(value:any)=> {
           this.clients = value.data
       },error:(err)=>{
    console.log(err)
       }
    })
  }

  initializeForms() {
    this.affaireForm = this.fb.group({
      numeroAffaire: ['', Validators.required],
      natureAffaire: ['', Validators.required],
      dateAudience: ['', Validators.required],
      degre: ['', Validators.required],
      opposite: ['', Validators.required]
    });

    this.folderForm = this.fb.group({
      titleFolder: ['', Validators.required],
      numberFolder: ['', Validators.required],
      client: ['', Validators.required],

    });
  }
  sendAction(id: any) {
    this.selectedFolderId = id;
    this.modalService.open(this.userSelectionModal);
  }

  confirmSendAction(modal: any) {
    const selectedUsers = this.users.filter(user => user.selected).map(user => user._id);
  }
  confirmAboutissement(modal: any) {
    console.log(this.justification, "justification");
  
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
  
      console.log(this.selectedJugement,"ook")
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
  
  
  getFolderByAdmin() {
    this._folderService.getFolderByAdminId(this.adminId).subscribe({
      next: (folders) => {
        this.dossiers = folders;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  openFolder(folder: any) {
    this.selectedFolder = folder;
     this.getAffairesByDossierId(folder._id);
  }
  executeAction(id: any, isExecuted: boolean) {
    const params = !isExecuted;
    
    this._folderService.updateExecuted(id, params).subscribe({
      next: (value) => {
        console.log(value);
  
        // Find the dossier by ID and update its isExecuted status
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = params; // Update the isExecuted property
        }
      },
      error: (err) => {
        console.log(err);
        // Optionally handle the error case
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = isExecuted; // Revert if the API call fails
        }
      }
    });
  } 
  openedFile: any; 
  openPdfModal(url: any,content: TemplateRef<any>){
     this.openedFile = `${environment.picUrl}${url}`
     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
       }
    );
  }
  rectifyAction(id: any, isRectified: boolean) {
    const params = !isRectified;
    this._folderService.updateReactified(id, params).subscribe({
      next: (value) => {
        console.log(value);
        
         const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isRectified = params;  
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  goBack() {
    this.selectedFolder = null;
    this.selectedAffaire = null;
  }

  getAffairesByDossierId(dossierId: number) {
    this.affaireService.fetchAffaires(dossierId).subscribe({
      next: (affaires:any) => {
        this.affaires = affaires.data;
      },
      error: (err) => {
        this.affaires =[]
        console.error(err);
      }
    });
  }

  openModal() {
    this.resetAffaireForm();
    this.modal.show();
  }

  addNewAffaire() {
    console.log(this.affaireForm.value,"sdff",this.selectedFolder)
    if (this.affaireForm.valid && this.selectedFolder) {
       const formData = new FormData()
       formData.append('numeroAffaire',this.affaireForm.value.numeroAffaire)
       formData.append('natureAffaire',this.affaireForm.value.natureAffaire)
       formData.append('degre',this.affaireForm.value.degre)
       formData.append('opposite',this.affaireForm.value.opposite)
       if(this.selectedFiles){ 
 
           formData.append('file',this.selectedFiles)
      } 

      this.affaireService.addAffaire(formData, this.selectedFolder._id).subscribe({
        next: (newAffaire) => {
          this.affaires.push(newAffaire.data);
          this.modal.hide();
          this.resetAffaireForm();
        },
        error: (err) => {
          console.error(err);
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

  resetAffaireForm() {
    this.affaireForm.reset({
      numeroAffaire: '',
      natureAffaire: '',
      dateAudience: '',
      degre:''
     });
    this.affaireToEdit = null;
  }

  openFolderModal() {
    this.folderForm.reset();
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addFolderModal')
    );
    this.modal.show();
  }

  addNewFolderAction() {
    if (this.folderForm.valid) {
      const newFolder = this.folderForm.value;
     console.log(this.folderForm.value,this.adminId,"adminId")
       this._folderService.createDossier({...newFolder,avocat:this.adminId}).subscribe({
         next: (folder) => {
            this.dossiers.push(folder);  
         this.modal.hide();
    },
          error: (err) => {
            console.error(err);
          }
        });
    }
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
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
  openHonorairesModal(client: any , affaire:any) {
    const modalRef = this.modalService.open(HonorrairesComponent, {
      size: 'lg',  
      backdrop: 'static',  
    });
  
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

  aboutissementId : any ; 
  openAboutissement(id : any){ 
    this.aboutissementId = id
    this.modalService.open(this.aboutissement);
  }
  aboutissementDetails: any
  pdfJugement: any
  openPdf(url: string) {
    this.pdfJugement = `${environment.picUrl}${url}`;  
    console.log(this.pdfJugement,"pdf")
  }

  openDetailsJugement(aboutissement : any){ 
    console.log(aboutissement,"aboutiss")
    this.modalService.open(this.aboutissementDetailsModal);
    this.aboutissementDetails  = aboutissement
     
  }
}
