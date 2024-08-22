import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAddminComponent } from './register-addmin/register-addmin.component';

const routes: Routes = [
  {
    path:'adminstratorLogin',
    component:LoginAdminComponent
  },
  {
    path:'adminstratorRegister',
    component:RegisterAddminComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
