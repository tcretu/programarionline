import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutentificareService } from '../services/autentificare.service';

@Injectable({
  providedIn: 'root'
})
export class SecureAuthenticatedPagesGuardService implements CanActivate {

  constructor(private authService: AutentificareService, public router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Check the user is logged in or not
    //(In case the user is logged in he will have the access to pages that SecureInnerPage Guard have implimented 'Check app.routing.module.ts')
     if(this.authService.isLoggedIn){
      return true;
     }else{
      this.router.navigate(['/autentificare']);
      return false;
     }
    }
}
