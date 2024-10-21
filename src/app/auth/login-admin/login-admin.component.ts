import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AuthRequest } from '../../core/models/user';
import { CommonModule } from '@angular/common';
import { Role } from '../../core/constant/role';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.scss'
})
export class LoginAdminComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private _authService :AuthService,private router : Router) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],   
      password: ['', [Validators.required, Validators.minLength(6)]]  
    });
  }

   login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const record: AuthRequest = { 
        email: email , 
        password : password
      }
     this._authService.loginAdmin(record).subscribe({
       next:(value) => {
           if(value.token && value.role === Role.ADMIN){
        this.router.navigate(['/administrator'])
           }else if(value.token && value.role === Role.SOUSADMIN){
            this.router.navigate(['/sousadministrator'])

           }
       },error:(err) => {
          
       },
     })
    } else {
       console.log('Form is invalid');
    }
  }
}
