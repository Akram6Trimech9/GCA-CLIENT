import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
 import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  form: FormGroup;
  submitted = false;
  token: string | null = null;   

  constructor(
    private _router: Router,
    private toastr: ToastrService, 
    private formBuilder: FormBuilder, 
    private _authService: AuthService,
    private route: ActivatedRoute   
  ) {
     this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordsMatch('password', 'confirmPassword')   
    });
  }

  ngOnInit(): void {
     this.token = this.route.snapshot.paramMap.get('token');
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  passwordsMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['passwordMismatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

     const newPassword = this.form.value.password;

    if (this.token) {
      this._authService.resetPassword( this.token , {password: newPassword}).subscribe({
        next: () => {
          this.toastr.success('Mot de passe réinitialisé avec succès', 'Succès');
          this._router.navigate(['/client/login'])
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Une erreur s\'est produite lors de la réinitialisation du mot de passe', 'Erreur');
        }
      });
    } else {
      this.toastr.error('Le token est manquant', 'Erreur');
    }
  }
}
