import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../core/models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth.service';
import { Role } from '../../../core/constant/role';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchQuery: string = '';
  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  @ViewChild('addUserModal') addUserModal: any;
  @ViewChild('updateUserModal') updateUserModal: any; 
  currentUser: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _authService: AuthService
  ) {
    // Initialize forms
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      telephone2: [''],
      dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.updateUserForm = this.fb.group({
      username: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      telephone2: [''],
      dateOfBirth: ['', [Validators.required]],
    });
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

  openAddUserModal() {
    this.addUserForm.reset(); // Reset form for adding
    this.modalService.open(this.addUserModal);
  }

  openUpdateUserModal(user: IUser) {
    this.updateUserForm.patchValue(user); // Patch values for updating
    this.modalService.open(this.updateUserModal);
  }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this._authService.getAllClients(this.currentUser._id).subscribe({
      next: (value: any) => {
        this.users = value.data;
        this.filteredUsers = this.users;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(user: IUser) {
    this.users = this.users.filter(u => u._id !== user._id);
    this.filterUsers();
    this.toastr.error('Utilisateur supprimé', 'Supprimé');
  }

  saveUser(): void {
    if (this.addUserForm.invalid) return;
    const user = { ...this.addUserForm.value, role: Role.CLIENT };
    this._authService.registerClient(user, this.currentUser._id).subscribe({
      next: (value) => {
        this.users.push({ ...user, _id: Date.now() });
        this.toastr.success('Nouvel utilisateur ajouté avec succès', 'Succès');
        this.modalService.dismissAll();
        this.filterUsers();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Une erreur s\'est produite lors de l\'enregistrement de l\'utilisateur', 'Erreur');
      }
    });
  }

  updateUser(): void {
    if (this.updateUserForm.invalid) return;
    const updatedUser = { ...this.updateUserForm.value };
    const index = this.users.findIndex(u => u._id === updatedUser._id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
      this.toastr.success('Utilisateur modifié avec succès', 'Succès');
      this.modalService.dismissAll();
      this.filterUsers();
    }
  }
}
