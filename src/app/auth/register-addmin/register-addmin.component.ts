import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { DossiersService } from '../../services/dossiers.service';
import Validation from '../../utils/validation';
import { IUser } from '../../core/models/user';
import { Role } from '../../core/constant/role';

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

  constructor(private formBuilder: FormBuilder, private _authService: AuthService, private _router: Router , private _folderService : DossiersService) {
    this.activeForm = this.formBuilder.group({
      activeNumber: ['', Validators.required],
    });

    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        lastName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
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

  clientId !: Number 

  ngOnInit(): void {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get fa(): { [key: string]: AbstractControl } {
    return this.activeForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const record: IUser = {
      email: this.form.value.email,
      lastname: this.form.value.lastName,
      username: this.form.value.name,
      password: this.form.value.password,
      role: Role.ADMIN,
      adresse: this.form.value.address,
      dateOfBirth: this.form.value.dateOfBirth,
      cin: this.form.value.cin,
      telephone1: this.form.value.telephone,
    };

    this._authService.registerAdmin(record).subscribe({
      next: (value) => {
        if (value) {
          console.log(value, "value");
          this.clientId =value.id
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
    this._authService.activateAccount(this.activeForm.value.activeNumber).subscribe({
      next: (value) => {

        this._folderService.createDossier({client: {id : this.clientId},numeroDossier:this.clientId} ).subscribe({ 
          next:(value)=> {
            this._router.navigate(['/authAdmin/adminstratorLogin']);
          },error:(err) =>{
            
          },
        })

      },
      error(err) {
        console.error(err);
      },
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
