import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nav-client',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './nav-client.component.html',
  styleUrls: ['./nav-client.component.scss']
})
export class NavClientComponent implements OnInit {
  currentUser!: IUser | null;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.current.subscribe((res) => {
      console.log(res, 'res');
      this.currentUser = res; 
    });
  }
  logout(){ 
    this._authService.logout()
  }
}
