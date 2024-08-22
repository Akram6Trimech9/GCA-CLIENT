import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { AuthRequest } from '../../../core/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
     this._authService.login(record).subscribe({
       next:(value) => {
           if(value.token){
        this.router.navigate(['/client/home'])
           }
       },error:(err) => {
          
       },
     })
    } else {
       console.log('Form is invalid');
    }
  }
}
