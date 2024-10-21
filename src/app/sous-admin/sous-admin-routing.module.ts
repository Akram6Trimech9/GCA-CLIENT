import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../pages/admin/admin-panel/admin-panel.component';
import { HomePageComponent } from '../pages/sous-admin/home-page/home-page.component';
import { FolderManagementComponent } from '../pages/sous-admin/folder-management/folder-management.component';

const routes: Routes = [ 
  {
    path:'home',
    component:HomePageComponent
  } ,
  {
    path:'folder',
    component:FolderManagementComponent
  } 
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SousAdminRoutingModule { }
