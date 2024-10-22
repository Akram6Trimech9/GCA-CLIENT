import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../pages/admin/admin-panel/admin-panel.component';
import { CalendarComponent } from '../pages/admin/calendar/calendar.component';
import { FoldermanagementComponent } from '../pages/admin/foldermanagement/foldermanagement.component';
import { RdvComponent } from '../pages/admin/rdv/rdv.component';
import { AudianceComponent } from '../pages/admin/audiance/audiance.component';
 import { HonorraireComponent } from '../pages/admin/honorraire/honorraire.component';
import { CaisseComponent } from '../pages/admin/caisse/caisse.component';
import { intervenantsComponent } from '../pages/admin/inventaires/inventaires.component';
import { CabinetComponent } from '../pages/admin/cabinet/cabinet.component';
import { CompteGuestComponent } from '../pages/admin/compte-guest/compte-guest.component';
import { AffairesSingleComponentComponent } from '../pages/admin/affaires-single-component/affaires-single-component.component';
 import { PocesSingleComponent } from '../pages/admin/poces-single/poces-single.component';

const routes: Routes = [
 
{
  path:'Dashboard',
  component:AdminPanelComponent
},
{
  path:'calendar',
  component:CalendarComponent
},
{
  path:'folder',
  component:FoldermanagementComponent
},
{
  path:'rdv',
  component:RdvComponent
},
{
  path:'affaires',
  component:AffairesSingleComponentComponent
},
{
  path:'intervenants',
  component:intervenantsComponent
},
{
  path:'compte-guest/:id',
  component:CompteGuestComponent
},
{
  path:'honnoraire',
  component:HonorraireComponent
},
{
  path:'poces',
  component:PocesSingleComponent
},
{
  path:'audiance/:id',
  component:AudianceComponent
},
{
  path:'caisse',
  component:CaisseComponent
},
{
  path:'cabinet',
  component:CabinetComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
