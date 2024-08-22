import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NavClientComponent } from '../../shared/components/nav-client/nav-client.component';
import { FootClientComponent } from '../../shared/components/foot-client/foot-client.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [NavClientComponent,CommonModule,FootClientComponent,RouterModule],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {

}
