import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DossiersService } from '../../services/dossiers.service';
import Validation from '../../utils/validation';
import { IUser } from '../../core/models/user';
import { Role } from '../../core/constant/role';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-addmin',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register-addmin.component.html',
  styleUrl: './register-addmin.component.scss'
})
export class RegisterAddminComponent {
  activeForm: FormGroup;
  form: FormGroup;
  submitted = false;
  activeAccount: boolean = false;
  selectedFile: File | null = null; // Store the uploaded file
  photoError: boolean = false;

  constructor(private toastr: ToastrService, private formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private _folderService: DossiersService) {
    this.activeForm = this.formBuilder.group({
      activeNumber: ['', Validators.required],
    });

    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        lastName: ['', [Validators.required, Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
        confirmPassword: ['', Validators.required],
        telephone: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        cin: ['', Validators.required],
        address: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  clientId!: number;

  ngOnInit(): void {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get fa(): { [key: string]: AbstractControl } {
    return this.activeForm.controls;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.photoError = false;
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid || !this.selectedFile) {
      if (!this.selectedFile) {
        this.photoError = true; 
      }
      return;
    }

    // const record: IUser = {
    //   email: this.form.value.email,
    //   lastname: this.form.value.lastName,
    //   username: this.form.value.name,
    //   password: this.form.value.password,
    //   role: Role.ADMIN,
    //   adresse: this.form.value.address,
    //   dateOfBirth: this.form.value.dateOfBirth,
    //   cin: this.form.value.cin,
    //   telephone1: this.form.value.telephone,
    // };

     const formData = new FormData();
     formData.append('email', this.form.value.email);
     formData.append('lastname', this.form.value.lastName);
     formData.append('username', this.form.value.name);
     formData.append('password', this.form.value.password);
     formData.append('role', Role.ADMIN);
     formData.append('adresse', this.form.value.adresse);
     formData.append('dateOfBirth', this.form.value.dateOfBirth.toString());   
     formData.append('cin', this.form.value.cin);
     formData.append('telephone1', this.form.value.telephone);
    formData.append('userProfile', this.selectedFile as Blob);

    this._authService.register(formData).subscribe({
      next: (value) => {
        if (value) {
          console.log(value, 'value');
          this.clientId = value.id;
          this.activeAccount = true;
        }
      },
      error(err) {
        console.error(err);
      },
    });

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  active(): void {
    this._authService
      .activateAccount({
        verificationCode: this.activeForm.value.activeNumber,
        email: this.form.value.email,
      })
      .subscribe({
        next: (value) => {
          if (value.verified) {
            this._router.navigate(['/authAdmin/adminstratorLogin']);
          } else {
            this.toastr.error('Le code de vérification est incorrect', 'Erreur');
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Une erreur est survenue lors de l\'activation', 'Erreur');
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
    this.selectedFile = null;
  }
}
