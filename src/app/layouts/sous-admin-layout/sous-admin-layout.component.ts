import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-sous-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl:'./sous-admin-layout.component.html' ,
  styleUrl: './sous-admin-layout.component.scss',
 })
export class SousAdminLayoutComponent {
  constructor(private _authService: AuthService) {}

  ngOnInit(): void {}

  logout() {
    this._authService.logoutAdmin();
  }

  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
 }
