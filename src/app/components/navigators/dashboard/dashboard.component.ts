import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { AutentificareService } from '@services/autentificare.service';
import { environment as env } from '@environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { InformatiiAplicatieComponent } from '@components/forms/informatii-aplicatie/informatii-aplicatie.component';
import { ProfilComponent } from '@components/forms/profil/profil.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isExpanded: boolean = false;
  public appName=env.app.name;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(public authService: AutentificareService,
            changeDetectorRef: ChangeDetectorRef,
            media: MediaMatcher,
            public dialogInfo:MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logOut(){
    if(confirm('Parasiti aplicatia?')){
      this.authService.Logout();
    }
  }

  onInfo(){
    this.dialogInfo.open(InformatiiAplicatieComponent)
  }

  onProfil(){
    this.dialogInfo.open(ProfilComponent,{data:{parametru:this.authService.UserData}})
  }


}
