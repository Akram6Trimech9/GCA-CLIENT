import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../pages/admin/admin-panel/admin-panel.component';
import { HomePageComponent } from '../pages/sous-admin/home-page/home-page.component';
import { FolderManagementComponent } from '../pages/sous-admin/folder-management/folder-management.component';
import { CalendarComponent } from '../pages/sous-admin/calendar/calendar.component';
 import { PocesSingleComponent } from '../pages/sous-admin/poces-single/poces-single.component';
import { RdvComponent } from '../pages/sous-admin/rdv/rdv.component';
import { intervenantsComponent } from '../pages/sous-admin/inventaires/inventaires.component';
import { HonorrairesComponent } from '../pages/admin/foldermanagement/modals/honorraires/honorraires.component';
import { GestionFichierComponent } from '../pages/admin/gestion_fichier/gestion_fichier.component';
  
const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'folder',
    component: FolderManagementComponent
  },
  {
    path: 'rdvs',
    component: RdvComponent
  },
  {
    path: 'intervenant',
    component: intervenantsComponent
  },
  {
    path: 'proces',
    component: PocesSingleComponent
  },
  {
    path: 'affaires',
    component: FolderManagementComponent
  },
  {
    path: 'disponibilities',
    component: CalendarComponent
  },
  {
    path: 'honoraires',
    component: HonorrairesComponent
  },
  {
    path: 'filemanager',
    component: GestionFichierComponent
  },
   
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SousAdminRoutingModule {}
