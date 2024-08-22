import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TopHeaderComponent } from '../../../shared/components/top-header/top-header.component';
import { PlacementComponent } from '../../../shared/components/placement/placement.component';
import { WhychooseusComponent } from '../../../shared/components/whychooseus/whychooseus.component';
import { AboutUsComponent } from '../../../shared/components/about-us/about-us.component';
import { AwardsComponent } from '../../../shared/components/awards/awards.component';
import { BlogsComponent } from '../../../shared/components/blogs/blogs.component';
import { ServicesComponent } from '../../../shared/components/services/services.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TopHeaderComponent,PlacementComponent,AboutUsComponent,WhychooseusComponent,AwardsComponent,BlogsComponent,ServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
