import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavClientComponent } from './components/nav-client/nav-client.component';
import { FootClientComponent } from './components/foot-client/foot-client.component';
 import { TopHeaderComponent } from './components/top-header/top-header.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NavClientComponent,TopHeaderComponent,    FootClientComponent,

  ],
  exports:[
    NavClientComponent,
    TopHeaderComponent
  ]
})
export class SharedModule { }
