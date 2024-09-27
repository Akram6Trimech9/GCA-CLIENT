import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
 import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/service/auth.service';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports:[CommonModule, FormsModule,ReactiveFormsModule],
 
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  form: FormGroup;
  submitted = false;

  constructor(private toastr: ToastrService, private formBuilder: FormBuilder, private _authService: AuthService) {
     this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  isSended : Boolean = false
  onSubmit(): void {
    this.submitted = true;

     if (this.form.invalid) {
      return;
    }

     this._authService.forgetPassword(this.form.value.email).subscribe({
      next: () => {
        this.toastr.success('Veuillez vérifier votre email pour le lien de vérification', 'Email envoyé avec succès');
        this.isSended = true 
     
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Une erreur s\'est produite lors de l\'envoi de l\'email', 'Erreur');
      }
    });
  }
}
