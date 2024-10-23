import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbCarouselModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AudianceService } from '../../../services/audiance.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IAudiance } from '../../../core/models/audiance';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../core/models/user';
import { AuthService } from '../../../core/service/auth.service';
import { CerclesService } from '../../../services/cercles.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { AffaireService } from '../../../services/affaire.service';

@Component({
  selector: 'app-audiance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PdfViewerModule, NgbCarouselModule],
  templateUrl: './audiance.component.html',
  styleUrl: './audiance.component.scss'
})
export class AudianceComponent implements OnInit {
  affaireId!: any;
  folderId : any
  audiances!: IAudiance[];
  audianceForm!: FormGroup;
  tribunals !: any[];
  cities !: any[];
  typeAudiance = [{
    label: 'Première audience'
  },
  { label: 'Audience préparatoire' },
  { label: 'Plaidoirie' }]
  @ViewChild('fileModal') fileModal!: TemplateRef<any>;

  delegations !: any[]
  constructor(
    private modalService: NgbModal,
    private _audianceService: AudianceService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _authService: AuthService,
    private affaireService :AffaireService ,
    private addressService: CerclesService, 
    private router : Router
  ) { }


  currentUser!: IUser | null;
  ngOnInit(): void {
    this.audianceForm = this.fb.group({
      date: ['', Validators.required],
      numero: ['', Validators.required],
      description: ['', Validators.required],
      tribunal: ['', Validators.required],
      type: ['', Validators.required],
 
    });
    this.currentUser = this._authService.getCurrentUser()

    this.route.params.subscribe((params: any) => {
      this.affaireId = params?.id
      if (this.affaireId) {
        console.log('Affaire ID:', this.affaireId);
        this.loadAudiences(this.affaireId);
      } else {
        console.error('L\'identifiant de l\'affaire est indéfini ou nul.');
      }

    });
  }
  getAddress() {
    this.addressService.getTribinaux().subscribe({
      next: (value) => {
        this.tribunals = value
      }, error: (err) => {
        console.log(err)
      }
    })


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
  editedAudience : any
  openModal(content: any, audiance?: any) {
    const modalRef = this.modalService.open(content);

    if (audiance) {
      this.editedAudience = audiance
      this.audianceForm.patchValue({
        date: this.formatDate(audiance.dateAudiance), 
        numero: audiance.numero,
        description: audiance.description,
        tribunal: audiance.tribunal._id,  
        type: audiance.type
      });
    } else {
      this.audianceForm.reset();  
    }
    this.getAddress()


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
  selectedFiles: File[] = [];
  onFilesSelected(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFiles = Array.from(files);
    }
  }
  formatDate(date: any): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);  
  }
  addAudiance(audiance: any) {
    console.log(this.affaireId, "ok")
    const formData = new FormData();
    formData.append('dateAudiance', this.audianceForm.value.date);
    formData.append('description', this.audianceForm.value.description);
    formData.append('tribunalId', this.audianceForm.value.tribunal);
    formData.append('numero', this.audianceForm.value.numero);
    formData.append('type', this.audianceForm.value.type);

    if (this.selectedFiles.length) {
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });
    }
 
 
    this._audianceService.addAudience(formData, this.currentUser?._id, this.affaireId).subscribe({
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
  editAudiance(modal: any) {
    if (!this.editedAudience || !this.audianceForm.valid) {
      this.toastr.error('Invalid audience details or form data');
      return;
    }
  
    const formData = new FormData();
    
    // Appending form fields
    formData.append('dateAudiance', this.audianceForm.get('date')?.value);
    formData.append('description', this.audianceForm.get('description')?.value);
    formData.append('tribunalId', this.audianceForm.get('tribunal')?.value);
    formData.append('numero', this.audianceForm.get('numero')?.value);
    formData.append('type', this.audianceForm.get('type')?.value);
  
    // Appending files if selected
    if (this.selectedFiles.length) {
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });
    }
  
    this._audianceService.updateAudience(this.editedAudience._id, formData).subscribe({
      next: (value: any) => {
        const index = this.audiances.findIndex((a) => a._id === this.editedAudience._id);
        if (index > -1) {
          this.audiances[index] = value;  
          this.toastr.success('Audience updated successfully');
          modal.close();
          this.selectedFiles = [];  
        }
      },
      error: (err) => {
        console.error('Error updating audience:', err);
        this.toastr.error('Error updating audience');
      }
    });
  }
  
  
  
   deleteAudiance(id: String) {
    this._audianceService.deleteAudience(id).subscribe({
      next: (value) => {
        this.audiances = this.audiances.filter((audiance) => audiance._id !== id);
      }, error: (err) => {
        console.log(err)
      }, complete: () => {
        this.toastr.info('Audiance deleted successfully');

      }
    })
  }
  files: any[] = []
  openFiles(files: any) {
    files.forEach((file: any) => {
      this.files.push(`${environment.picUrl}${file}`)
    }); 
    const modalRef = this.modalService.open(this.fileModal);  
  }
   
  goBack() {
    this.affaireService.getAffaireById(this.affaireId).subscribe({ 
       next:(value:any)=>{
         if(value.data){ 
        this.router.navigate(['/administrator/folder'], { queryParams: { folderId: value.data?.folder?._id } });

        }

       },error:(err)=>{ 
  console.log(err)
       }
    })
  }
  

}
