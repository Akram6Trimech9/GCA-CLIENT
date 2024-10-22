import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { IUser } from '../../../../../core/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from '../../../../../core/constant/role';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../core/service/auth.service';

@Component({
  selector: 'app-sous-admins',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: `./sous_admins.component.html`,
  styleUrl: './sous_admins.component.scss',
 })
export class SousAdminsComponent implements OnInit ,OnChanges  { 
   @Input() users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchQuery: string = '';
  userForm: FormGroup;
  @ViewChild('userModal') userModal: any; 
  constructor(private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService , private _authService :AuthService) {
    
 

    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]], 
      telephone2: [''],
       dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],  
    });
  }
  ngOnChanges() {
    if (this.users) {
      this.filteredUsers = [...this.users];  // or apply any logic you need when users changes
    }
  }
  
  closeModal() {
    this.modalService.dismissAll();
  }

   filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

   openUserModal(user?: IUser) {
    if (user) {
      this.userForm.patchValue(user); 
    } else {
      this.userForm.reset();  
    }

    this.modalService.open(this.userModal);   
  }
  currentUser : any
  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();

  }

   deleteUser(user: IUser) {
    this.users = this.users.filter(u => u._id !== user._id);
    this.filterUsers();
    this.toastr.error('Utilisateur supprimé', 'Supprimé');
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
  
    const user = {...this.userForm.value , role:Role.SOUSADMIN};
     this._authService.registerSousAdmin(user, this.currentUser._id).subscribe({
      next: (value) => {
        console.log(value, "value");
  
        if (user._id) {
          const index = this.users.findIndex(u => u._id === user._id);
          this.users[index] = { ...user };
          this.toastr.success('Utilisateur modifié avec succès', 'Succès');
        } else {
          this.users.push({ ...user, _id: Date.now() });
          this.toastr.success('Nouvel utilisateur ajouté avec succès', 'Succès');
        }
  
        // Close the modal
        this.modalService.dismissAll();
  
         this.toastr.info('Les identifiants ont déjà été envoyés à l\'administrateur.', 'Informations envoyées');
        
        // Filter users after the operation
        this.filterUsers();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur', 'Erreur');
      }
    });
  }
  
}
