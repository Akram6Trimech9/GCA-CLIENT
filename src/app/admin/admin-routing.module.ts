import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../pages/admin/admin-panel/admin-panel.component';
import { CalendarComponent } from '../pages/admin/calendar/calendar.component';
import { FoldermanagementComponent } from '../pages/admin/foldermanagement/foldermanagement.component';
import { RdvComponent } from '../pages/admin/rdv/rdv.component';
import { AudianceComponent } from '../pages/admin/audiance/audiance.component';

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
  path:'audiance/:id',
  component:AudianceComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
