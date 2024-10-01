import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parametre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './parametre.component.html',
  styleUrl: './parametre.component.scss'
})
export class ParametreComponent implements OnInit {
  currentUser: any;
  current: any;
  isEmailEditable: boolean = true;
  constructor(private _authService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this._authService.getUserById(this.currentUser._id).subscribe({
      next: (value) => {
        this.current = value;
        // Ensure the date is in the correct format
        this.current.dateOfBirth = this.current.dateOfBirth ? new Date(this.current.dateOfBirth).toISOString().split('T')[0] : null;
        console.log(this.current, "current");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateUserProfile() {
    this._authService.update(this.currentUser._id, this.current).subscribe({
      next: (response) => {
        console.log('Profile updated successfully!', response);
        this.toastr.success('Profil mis à jour avec succès!', 'Succès');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.toastr.error('Erreur lors de la mise à jour du profil!', 'Erreur'); 
      }
    });
  }
}
