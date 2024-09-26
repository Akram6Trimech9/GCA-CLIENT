import { Component } from '@angular/core';
import { AuthService } from '../../core/service/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LockComponent } from './lock-component/lock.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule,CommonModule,LockComponent],
   templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  isLocked = true;  
  constructor(private _authService : AuthService){
  }
  ngOnInit(): void {
    
  }
  logout(){ 
    this._authService.logout()
  }
}
