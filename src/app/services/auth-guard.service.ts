import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGroup } from 'src/app/interfaces/authorization.types';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }

  protected hasRequiredPermission(authGroup: AuthGroup): Promise<boolean> | boolean {
    // If user’s permissions already retrieved from the API
    if (this.auth.currentUserValue) {
        if (authGroup) {
            return this.auth.hasPermission(authGroup);
        } else {
            return this.auth.hasPermission(null);
        }
    } 
}
}
