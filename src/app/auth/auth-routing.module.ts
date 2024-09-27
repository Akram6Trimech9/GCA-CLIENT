import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterAddminComponent } from './register-addmin/register-addmin.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
  {
    path:'adminstratorLogin',
    component:LoginAdminComponent
  },
  {
    path:'adminstratorRegister',
    component:RegisterAddminComponent
  },
  {
    path:'adminForgetPassword',
    component:ForgetPasswordComponent
  },
  {
    path:'reset/:token',
    component:ResetpasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
