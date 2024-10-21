import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/home/home.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { adminGuard } from './core/guards/admin.guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { SousAdminLayoutComponent } from './layouts/sous-admin-layout/sous-admin-layout.component';
import { sousAdminGuard } from './core/guards/sousAdmin-guard';

export const routes: Routes = [
 {
    path:'',
    redirectTo:'client',
    pathMatch:'full'
 },
 {
    path:'client',
    component:ClientLayoutComponent,
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule)
 }
,
 {
    path:'administrator',
    component:AdminLayoutComponent,
    canActivate:[adminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
 },
 {
   path:'sousadministrator',
   component:SousAdminLayoutComponent,
   canActivate:[sousAdminGuard],
   loadChildren: () => import('./sous-admin/sous-admin.module').then(m => m.SousAdminModule)
},

 {
   path:'compte',
   component:UserLayoutComponent,
   canActivate:[authGuard],
   loadChildren: () => import('./user/user.module').then(m => m.UserModule)
},
 {
   path:'authAdmin',
   component:AuthLayoutComponent,
   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
}
];
