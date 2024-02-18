import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment as env} from "@environments/environment";
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AutentificareService } from "@services/autentificare.service";
import { AutentificareComponent } from '@components/forms/autentificare/autentificare.component';
import { InregistrareUtilizatorComponent } from '@components/forms/inregistrare-utilizator/inregistrare-utilizator.component';
import { UtilizatoriComponent } from '@components/views/utilizatori/utilizatori.component';
import { ForgotPasswordComponent } from '@components/forms/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from '@components/forms/verify-email/verify-email.component';
import { DashboardComponent } from '@components/navigators/dashboard/dashboard.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from 'src/app/app.material.module';
import { ParametriComponent } from '@components/views/parametri/parametri.component';
import { ProgrameazaComponent } from '@components/navigators/programeaza/programeaza.component';
import { ProgramariComponent } from '@components/views/programari/programari.component';
import { ProgramareComponent } from '@components/forms/programare/programare.component';
import { FurnizoriComponent } from '@components/views/furnizori/furnizori.component';
import { FurnizorComponent } from '@components/forms/furnizor/furnizor.component';
import { ServiciiComponent } from '@components/views/servicii/servicii.component';
import { ServiciuComponent } from '@components/forms/serviciu/serviciu.component';
import { ParametruComponent } from '@components/forms/parametru/parametru.component';
import { PageNotFoundComponent } from '@components/navigators/page-not-found/page-not-found.component';
import { ProfilComponent } from '@components/forms/profil/profil.component';
import { InformatiiAplicatieComponent } from '@components/forms/informatii-aplicatie/informatii-aplicatie.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfirmaComponent } from '@components/navigators/confirma/confirma.component';
import { AnuleazaComponent } from '@components/navigators/anuleaza/anuleaza.component';
import { InputMaskModule } from '@ngneat/input-mask';

@NgModule({
  declarations: [
   AppComponent,
   AutentificareComponent,
   ForgotPasswordComponent,
   PageNotFoundComponent,
   VerifyEmailComponent,
   DashboardComponent,
   UtilizatoriComponent,
   InregistrareUtilizatorComponent,
   ParametriComponent,
   ProgrameazaComponent,
   ProgramariComponent,
   ProgramareComponent,
   FurnizoriComponent,
   FurnizorComponent,
   ServiciiComponent,
   ServiciuComponent,
   ParametruComponent,
   ProfilComponent,
   InformatiiAplicatieComponent,
   ConfirmaComponent,
   AnuleazaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(env.firebase),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    InputMaskModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
