import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayoutComponent } from '../layouts/client-layout/client-layout.component';
import { HomeComponent } from '../pages/client/home/home.component';
import { ServicesComponent } from '../pages/client/services/services.component';
import { ContactComponent } from '../pages/client/contact/contact.component';
import { BlogComponent } from '../pages/client/blog/blog.component';
import { AboutUsComponent } from '../shared/components/about-us/about-us.component';
import { LoginComponent } from '../pages/client/login/login.component';
import { RegisterComponent } from '../pages/client/register/register.component';
import { AudianceComponent } from '../pages/admin/audiance/audiance.component';

const routes: Routes = [

{
  path:'',
  redirectTo:'home',
  pathMatch:'full'
},
{
  path:'home',
  component:HomeComponent
},
{
  path:'service',
  component:ServicesComponent
},
{
  path:'contact',
  component:ContactComponent
},
{
  path:'blog',
  component:BlogComponent
},
{
  path:'about',
  component:AboutUsComponent
},
{
  path:'login',
  component:LoginComponent
},
{
  path:'audiance',
  component:AudianceComponent
},
{
  path:'register',
  component:RegisterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
