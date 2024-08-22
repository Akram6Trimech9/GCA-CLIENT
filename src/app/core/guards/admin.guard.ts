import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, type CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  if(inject(AuthService).isLoggedIn() && inject(AuthService).isAdmin() ){
    return true ;
 }else{
    inject(Router).navigate(['/authAdmin/adminstratorLogin'])
    return false;

 }
};
