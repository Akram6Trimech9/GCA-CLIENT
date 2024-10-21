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
 import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { intervenantService } from '../../../services/inventaire.service';
import { AffaireStatus } from '../../../utils/justification';
import { ToastrService } from 'ngx-toastr';
import { CreditService } from '../../../services/credit.service';
  import { ProcesService } from '../../../services/proces.service';
import { AffairesComponent } from '../../admin/foldermanagement/components/affaires/affaires.component';
import { CategoryComponent } from '../../admin/foldermanagement/components/category/category.component';
declare var window: any;

@Component({
  selector: 'app-folder-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent, AffairesComponent,
    CategoryComponent,
    NgSelectModule],
  templateUrl:'./folder-management.component.html',
  styleUrl: './folder-management.component.scss',
 })
export class FolderManagementComponent { 
  dossiers!: any[];
  selectedFolder: any = null;
  affaires: any[] = [];
  selectedAffaire: any = null;
  modal: any;
  intervenants!: any[]
  folderForm!: FormGroup;
  clients: any[] = []
  currentUser !: IUser | null;
  selectedClient : any ;
  adminId: any;
  users: any[] = [];


  selectedFolderName: any

  onFolderSelected(folder: string) {
    this.selectedFolderName = folder;
  }






  selectedFolderId: any;
  @ViewChild('userSelectionModal') userSelectionModal!: TemplateRef<any>;


  constructor(
    private fb: FormBuilder,
    private _folderService: DossiersService,
    private _userService: AuthService,
    private affaireService: AffaireService,
    private _creditService: CreditService,
    private _authService: AuthService,
    private _intervenantService: intervenantService,
    private modalService: NgbModal,
    private _procesService : ProcesService
   ) { }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()
    if (this.currentUser?._id) {
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

  getInterventaire() {
    this._intervenantService.getAllintervenant().subscribe({
      next: (value: any) => {
        this.intervenants = value.data
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  getClients(id: any) {
    this._userService.getAllClients(id).subscribe({
      next: (value: any) => {
        this.clients = value.data
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  initializeForms() {

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
    this.selectedClient = this.selectedFolder.client
    this.getAffairesByDossierId(folder._id);
 
  }



  executeAction(id: any, isExecuted: boolean) {
    const params = !isExecuted;

    this._folderService.updateExecuted(id, params).subscribe({
      next: (value) => {
        console.log(value);
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = params; // Update the isExecuted property
        }
      },
      error: (err) => {
        console.log(err);
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = isExecuted; // Revert if the API call fails
        }
      }
    });
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
      next: (affaires: any) => {
        this.affaires = affaires.data;
      },
      error: (err) => {
        this.affaires = []
        console.error(err);
      }
    });
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
      console.log(this.folderForm.value, this.adminId, "adminId")
      this._folderService.createDossier({ ...newFolder, avocat: this.adminId }).subscribe({
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


}
