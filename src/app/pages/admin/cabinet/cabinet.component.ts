import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CabinetService } from '../../../services/cabinet.service';
import { AuthService } from '../../../core/service/auth.service';
import { SousAdminsComponent } from './components/sous_admins/sous_admins.component';

@Component({
  selector: 'app-cabinet',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule ,SousAdminsComponent],
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'] // Fixed styleUrl to styleUrls
})
export class CabinetComponent implements OnInit {
  cabinetForm: FormGroup;
  userForm: FormGroup;
  users: Array<{ username: string }> = [];
  cabinet: any = {};  
  editIndex: number | null = null;
  currentUser: any;

  constructor(
    private _cabinetService: CabinetService,
    private _authService: AuthService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    
  ) {
    this.cabinetForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
      localisation: ['', Validators.required],
    });

    this.userForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  sousAdmins !:any[]

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();

     this._cabinetService.getCabinet(this.currentUser._id).subscribe({
      next: (value) => {
        if (value) {
          this.cabinet = value;  
          this.sousAdmins=value.sousAdmins
         }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openCabinetModal(content: TemplateRef<any>) {
    if (this.cabinet && this.cabinet.name) {
      this.toastr.warning('Vous avez déjà défini les informations de votre cabinet.', 'Attention');
    } else {
      this.cabinetForm.reset();  
      this.editIndex = null;  
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  editCabinet(content: TemplateRef<any>) {
    if (this.cabinet) {
      this.cabinetForm.setValue({
        name: this.cabinet.name || '',
        address: this.cabinet.address || '',
        description: this.cabinet.description || '',
        localisation: this.cabinet.localisation || ''
      });
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }
  }

  saveCabinet(modal: any) {
    const record = {
      name: this.cabinetForm.value.name,
      address: this.cabinetForm.value.address,
      description: this.cabinetForm.value.description,
      localisation: this.cabinetForm.value.localisation
    };

    if (!this.cabinet || !this.cabinet._id) {
       this._cabinetService.postCabinet(this.currentUser._id, record).subscribe({
        next: (value) => {
          this.toastr.success('Cabinet enregistré avec succès!', 'Succès');
          this.cabinet = value.cabinet;  
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
       this._cabinetService.updateCabinet(this.currentUser._id, record).subscribe({
        next: (value :any) => {
          this.toastr.success('Cabinet mis à jour avec succès!', 'Succès');
          this.cabinet = value.cabinet; 
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

    modal.close();
  }

  deleteCabinet( cabinet : any) {
    if (this.cabinet && this.cabinet._id) {
      this._cabinetService.deleteCabinet(this.cabinet._id).subscribe({
        next: () => {
          this.toastr.success('Cabinet supprimé avec succès!', 'Succès');
          this.cabinet = {};  
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  addUser() {
    const newUser = this.userForm.value.username;
    this.users.push({ username: newUser });
    this.userForm.reset();
  }

  deleteUser(user: any) {
    this.users = this.users.filter(u => u !== user); 
  }
}
