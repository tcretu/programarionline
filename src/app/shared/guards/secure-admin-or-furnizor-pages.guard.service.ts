import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AutentificareService } from '@services/autentificare.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecureAdminOrFurnizorPagesGuardService implements CanActivate {

  constructor(private authService: AutentificareService, public router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Check the user is logged in or not
    //(In case the user is logged in he will have the access to pages that SecureInnerPage Guard have implimented 'Check app.routing.module.ts')
     if(this.authService.isAdmin || this.authService.isFurnizor){
      return true;
     }else{
      this.router.navigate(['/autentificare']);
      return false;
     }
    }
}
