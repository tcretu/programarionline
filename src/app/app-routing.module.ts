import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutentificareComponent } from '@components/forms/autentificare/autentificare.component';
import { InregistrareUtilizatorComponent } from '@components/forms/inregistrare-utilizator/inregistrare-utilizator.component';
import { ForgotPasswordComponent } from '@components/forms/forgot-password/forgot-password.component';
import { DashboardComponent } from '@components/navigators/dashboard/dashboard.component';
import { VerifyEmailComponent } from '@components/forms/verify-email/verify-email.component';
import { UtilizatoriComponent } from '@components/views/utilizatori/utilizatori.component';
import { SecureAdminPagesGuardService } from '@shared/guards/secure-admin-pages.guard.service';
import { SecureAuthenticatedPagesGuardService } from '@shared/guards/secure-authenticated-pages.guard.service';
import { SecureAdminOrFurnizorPagesGuardService} from '@shared/guards/secure-admin-or-furnizor-pages.guard.service';
import { ParametriComponent } from '@components/views/parametri/parametri.component';
import { ProgrameazaComponent } from '@components/navigators/programeaza/programeaza.component';
import { ConfirmaComponent } from '@components/navigators/confirma/confirma.component';
import { AnuleazaComponent } from '@components/navigators/anuleaza/anuleaza.component';
import { PageNotFoundComponent } from '@components/navigators/page-not-found/page-not-found.component';
import { FurnizoriComponent } from '@components/views/furnizori/furnizori.component';
import { FurnizorComponent } from '@components/forms/furnizor/furnizor.component';
import { ServiciiComponent } from '@components/views/servicii/servicii.component';
import { ServiciuComponent } from '@components/forms/serviciu/serviciu.component';
import { ProgramariComponent } from '@components/views/programari/programari.component';
import { ProgramareComponent } from '@components/forms/programare/programare.component';
import { ProfilComponent } from '@components/forms/profil/profil.component';
import { InformatiiAplicatieComponent } from '@components/forms/informatii-aplicatie/informatii-aplicatie.component';
const routes: Routes = [
  { path: '', redirectTo: '/programeaza', pathMatch: 'full' },
  { path: 'autentificare', component: AutentificareComponent, title:'Autentificare' },
  { path: 'inregistrare-utilizator', component: InregistrareUtilizatorComponent, title:'Inregistrare utilizator' },
  { path: 'forgot-password', component: ForgotPasswordComponent, title:'Am uitat parola' },
  { path: 'verify-email-address', component: VerifyEmailComponent,canActivate:[SecureAuthenticatedPagesGuardService], title: 'Verificare adresa de e-mail' },
  { path: 'informatii-aplicatie', component: InformatiiAplicatieComponent, title:'Informatii aplicatie'},
  { path: 'programeaza', component:ProgrameazaComponent, title:'Programeaza un serviciu'},
  { path: 'confirma/:id', component:ConfirmaComponent, title:'Confirmare programare'},
  { path: 'anuleaza/:id', component:AnuleazaComponent, title:'Anulare programare'},
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate:[SecureAuthenticatedPagesGuardService],
    title:'Panou de bord',
    children:[
      { path: 'utilizatori',
        component: UtilizatoriComponent,
        title:'Utilizatori inregistrati',
        canActivate:[SecureAdminPagesGuardService],
      },
      { path: 'parametri', component: ParametriComponent, title:'Parametri',  canActivate:[SecureAdminPagesGuardService] },
      { path: 'furnizori', component: FurnizoriComponent, title:'Furnizori',  canActivate:[SecureAdminPagesGuardService] },
      { path: 'servicii', component: ServiciiComponent, title:'Servicii',  canActivate:[SecureAdminOrFurnizorPagesGuardService] },
      { path: 'programari', component: ProgramariComponent, title:'Programari',  canActivate:[SecureAdminOrFurnizorPagesGuardService] },
    ]
  },
  { path: '**', component: PageNotFoundComponent, title: 'Pagina cautata nu a fost gasita' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
