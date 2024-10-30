import { CommonModule } from '@angular/common';
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
 import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { AudianceService } from '../../../services/audiance.service';
import { AffaireService } from '../../../services/affaire.service';
import { intervenantService } from '../../../services/inventaire.service';
import { AuthService } from '../../../core/service/auth.service';
import { DossiersService } from '../../../services/dossiers.service';
@Component({
  selector: 'app-intervenants',
  standalone: true,
  imports: [FormsModule, CommonModule,NgSelectModule, ReactiveFormsModule,NgbDropdownModule,NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,],
  templateUrl: './inventaires.component.html',
  styleUrls: ['./inventaires.component.scss']
})
export class intervenantsComponent implements OnInit {
  intervenantForm: FormGroup;
  intervenants !: any[] 
  intervenantSelectionne: any;
  folders :any[] =[];
  affaireForm!: FormGroup;

  @ViewChild('contentAdd') contentAdd!: TemplateRef<any>;
  @ViewChild('contentEdit') contentEdit!: TemplateRef<any>;
  @ViewChild('contentDelete') contentDelete!: TemplateRef<any>;
  selectedFile: File | null = null;
  loading: boolean = false;
  totalRequests: number = 0;
  completedRequests: number = 0;
  filteredintervenants: any[] = [];
   searchName: string = '';
  searchType: string = '';
   page: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/xml') {
      this.selectedFile = file;
    } else {
      alert('Please select a valid XML file.');
    }
  }
  selectedintervenants: any[] = [];

  upload(): void {
    if (!this.selectedFile) {
      alert('No file selected.');
      return;
    }
  
    this.loading = true; // Show loader
  
    const reader = new FileReader();
  
    reader.onload = () => {
      const xmlString = reader.result as string;
  
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  
        const models = xmlDoc.getElementsByTagName('model');
        const dataToInsert = [];
  
        for (let i = 0; i < models.length; i++) {
          const model = models[i];
  
          const modelData = {
            id: model.getElementsByTagName('id')[0]?.textContent?.trim() || '',
            full_name: model.getElementsByTagName('full_name')[0]?.textContent?.trim() || '',
            adresse: model.getElementsByTagName('adresse')[0]?.textContent?.trim() || '',
            phone1: model.getElementsByTagName('phone1')[0]?.textContent?.trim() || '',
            phone2: model.getElementsByTagName('phone2')[0]?.textContent?.trim() || '',
            // Annuaire_Type_experts_id: model.getElementsByTagName('Annuaire_Type_experts_id')[0]?.textContent?.trim() || '',
            // annuaire__tribunas_id: model.getElementsByTagName('annuaire__tribunas_id')[0]?.textContent?.trim() || '',
            typeintervenant: 'interpreters'

          };
  
          if (modelData.full_name && modelData.adresse && modelData.phone1  ) {
            dataToInsert.push(modelData);
          } else {
            console.error('Missing required fields for model:', modelData);
          }
        }
  
        if (dataToInsert.length > 0) {
          this.saveDataToDatabase(dataToInsert);
        } else {
          this.loading = false; // Hide loader
          alert('No valid data found in the XML file.');
        }
  
      } catch (error) {
        this.loading = false; // Hide loader on error
        console.error('Error parsing XML:', error);
        alert('Error parsing XML file.');
      }
    };
  
    reader.readAsText(this.selectedFile);
  }
  selectEdAudiance !: number;
  selectedAffaire : any
 
  saveDataToDatabase(data: any[]): void {
    let totalRequests = data.length;
    let completedRequests = 0;
  
    if (totalRequests === 0) {
      this.loading = false; // Hide loader if no data
      return;
    }
  
    data.forEach(item => {
      this._intervenantService.addintervenant(item).subscribe({
        next: (response) => {
          completedRequests++;
          if (completedRequests === totalRequests) {
            this.loading = false; // Hide loader when all requests are completed
          }
          console.log('Item uploaded:', response);
        },
        error: (err) => {
          completedRequests++;
          if (completedRequests === totalRequests) {
            this.loading = false; // Hide loader when all requests are completed
          }
          console.error('Error uploading data:', err);
          alert('Failed to upload data.');
        }
      });
    });
  }
   constructor(private toastr: ToastrService ,
     private _userService : AuthService ,
     private _folderService: DossiersService,

     private fb: FormBuilder, private modalService: NgbModal,private _audianceService : AudianceService,private _affaireService : AffaireService, private toastService: ToastrService , private _intervenantService : intervenantService) {
    this.intervenantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
   currentUser : any; 
  adminId  : any ; 
  ngOnInit(): void {
    this.initializeForms();  
    this.currentUser = this._userService.getCurrentUser()  
    if(this.currentUser?._id){ 
       this.adminId = this.currentUser?._id
       this.loadAudiances(this.adminId);

     }
    this.loadintervenants(); 
    
   this.getFolderByAdmin();  
  } 


  getFolderByAdmin(){
     this._folderService.getFolderByAdminId(this.adminId).subscribe({ 
       next:(value)=>{
        this.folders= value
        console.log(this.folders,'folders')
       },error:(err)=>{ 
         console.log(err)
       }
     })
  }
  audiances !: any[]
  loadAudiances(adminId : any ){
     this._audianceService.getAllByAdmin(adminId).subscribe({ 
         next:(value)=>{
           this.audiances = value
         },error:(error)=>{ 
           console.log(error)
         }
     })
  }


  affaires !: any[]
  loadAffaires(adminId:any){
this._affaireService.getAllAffaireByAdmin(adminId).subscribe({
  next:(value)=>{
    this.affaires = value
  },error:(error)=>{ 
    console.log(error)
  }
})
  }

  selectedFolder : any 
  addedAffaire : any
  addNewAffaire() {
     const selectedFolder = this.affaireForm.value.selectedFolder;  

       const formData = new FormData();
      formData.append('numeroAffaire', this.affaireForm.value.numeroAffaire);
      formData.append('natureAffaire', this.affaireForm.value.natureAffaire);
      formData.append('opposite', this.affaireForm.value.opposite);
       
      if (this.selectedFiles) {
        formData.append('file', this.selectedFiles);
      }
       this._affaireService.addAffaire(formData, selectedFolder).subscribe({
        next: (newAffaire) => {
          this.addedAffaire = newAffaire.data
            this.selectedintervenants.forEach(item=>{
            console.log(this.addedAffaire._id,item._id)
            this._affaireService.addIntervToAffaire(this.addedAffaire._id,item._id).subscribe(res=>{ 
               if(res){
                
                this.toastr.success('Affaire ajoutée avec succès !'); // French success message
                this.resetAffaireForm();
                this.closeModal()
               }
            })

          })
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Erreur lors de l\'ajout de l\'affaire.'); // French error message
        }
      });
  
  }
  
  resetAffaireForm() {
    this.affaireForm.reset({
      numeroAffaire: '',
      natureAffaire: '',
      dateAudience: '',
     });
    this.affaireToEdit = null;
  }

  loadintervenants(): void {
    this._intervenantService.getAllintervenant(this.searchName, this.searchType, this.page, this.limit).subscribe(response => {
      this.intervenants = response.data.map((item:any) => ({ ...item, selected: false }));
      this.totalItems = response.total;
    });

  }
  affaireToEdit: any = null;
   folderForm!: FormGroup;
  clients:any[]=[]
   

  

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

 

  initializeForms() {
    this.affaireForm = this.fb.group({
      numeroAffaire: ['', Validators.required],
      natureAffaire: ['', Validators.required],
      dateAudience: ['', Validators.required],
       opposite: ['', Validators.required],
      selectedFolder: [null, Validators.required]   

    });
  }
   
  onSearch(): void {
    this.page = 1;  // Reset to page 1 on a new search
    this.loadintervenants();
  }

  // Pagination change handler
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadintervenants();
  }
  saveInAudiance(): void {
    console.log(this.selectEdAudiance, this.selectedintervenants, "selected");
    this.selectedintervenants.forEach(async (element) => {
      console.log(this.selectedintervenants);
      this._audianceService.addIntervToAudiance(this.selectEdAudiance, element._id).subscribe(res => {
        console.log(res, "response");
        this.toastr.success(`${element.full_name} a été ajoutée avec succès!`);
      });
    });
     this.modalService.dismissAll(); 
  }
  
  saveInAffaire(){
    this.selectedintervenants.forEach(async (element) => {
       this._affaireService.addIntervToAffaire(this.selectedAffaire, element._id).subscribe(res => {
         this.toastr.success(`${element.full_name} a été ajoutée avec succès!`);
      });
    });
     this.modalService.dismissAll(); 
  }
  ouvrirModalAjouter() {
    this.intervenantSelectionne = null;
    this.intervenantForm.reset();
    this.modalService.open(this.contentAdd, { ariaLabelledBy: 'modal-basic-title' });
  }

  ouvrirModalModifier(intervenant: any) {
    this.intervenantSelectionne = intervenant;
    this.intervenantForm.patchValue(intervenant);
    this.modalService.open(this.contentEdit, { ariaLabelledBy: 'modal-basic-title' });
  }

  enregistrerintervenant() {
    if (this.intervenantForm.valid) {
         const record = {
          intervenantName: this.intervenantForm.value.nom,
          intervenantLastName: this.intervenantForm.value.prenom,
          intervenantRole: this.intervenantForm.value.role
        }

        this._intervenantService.addintervenant(record).subscribe({
           next:(intervenant: any)=>{ 
            this.toastService.success('intervenant ajouté avec succès !');
           },
           error:(err)=>{ 
            console.error(err);
           }
        });
      }  
      this.modalService.dismissAll();  
      this.intervenantForm.reset();
   }
 
  supprimerintervenant(intervenant: any) {
    this.intervenantSelectionne = intervenant;
    this.modalService.open(this.contentDelete, { ariaLabelledBy: 'modal-basic-title' });
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.intervenants.forEach(intervenant => intervenant.selected = isChecked);
  }
  
  confirmerSuppression() {
     this.toastService.success('intervenant supprimé avec succès !');
    this.modalService.dismissAll();  
  }
  getSelectedintervenants(): any[] {
    return this.intervenants.filter(intervenant => intervenant.selected);
  }
  addToAddaitr(): void {
    console.log(this.selectedintervenants ,"selectedintervenants")
    const selectedintervenants = this.getSelectedintervenants();
    if (selectedintervenants.length === 0) {
      this.toastService.warning('No intervenants selected for Action 1.');
      return;
    }
    // Implement Action 1
    this.toastService.success('Action 1 performed successfully!');
  }

  addToAudiance(): void {
    const selectedintervenants = this.getSelectedintervenants();
    if (selectedintervenants.length === 0) {
      this.toastService.warning('No intervenants selected for Action 2.');
      return;
    }
     this.toastService.success('Action 2 performed successfully!');
  }
  onSelectionChange(intervenant: any, event: any): void {
    if (event.target.checked) {
      if (!this.selectedintervenants.includes(intervenant)) {
        this.selectedintervenants.push(intervenant);
      }
    } else {
      this.selectedintervenants = this.selectedintervenants.filter(item => item !== intervenant);
    }
  }
  closeModal() {
    this.modalService.dismissAll(); // Close all open modals
  }
     openModal(action: string, modalTemplate: TemplateRef<any>) {
      switch (action) {
        case 'action1':
          this.modalService.open(modalTemplate);
          this.loadAffaires(this.adminId);
          break;
        case 'action2':
          this.loadAudiances(this.adminId);
          this.modalService.open(modalTemplate);
          break;
        case 'action3':
          this.modalService.open(modalTemplate);
          break;
        case 'action4':
          this.modalService.open(modalTemplate);
          break;
        default:
          break;
      }
    }
    getPaginationNumbers(): number[] {
      const totalPages = Math.ceil(this.totalItems / this.limit);
      const pageNumbers: number[] = [];
      
      const maxVisiblePages = 5;
      const startPage = Math.max(1, this.page - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i <= totalPages) {
          pageNumbers.push(i);
        }
      }
      
      // Adjust if we start too low
      if (startPage > 1) {
        const diff = startPage - 1;
        for (let i = 1; i <= Math.min(diff, maxVisiblePages - (endPage - startPage + 1)); i++) {
          pageNumbers.unshift(i);
        }
      }
      
      // Ensure the last page is always included if not already
      if (!pageNumbers.includes(totalPages) && totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    
      return pageNumbers;
    }
    
}

