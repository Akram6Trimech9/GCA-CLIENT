import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/home/home.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { adminGuard } from './core/guards/admin.guard';

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
   path:'authAdmin',
   component:AuthLayoutComponent,
   loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
}
];
