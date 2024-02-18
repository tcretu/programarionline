import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Serviciu } from '@models/serviciu';
import { Slot } from '@models/slot';
import { Solicitant } from '@models/solicitant';
import { ProgramariService } from '@services/programari.service';
import { ServiciiService } from '@services/servicii.service';
import { environment as env } from '@environments/environment';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { map } from 'rxjs';
import { Programare } from '@models/programare';
import {CNP} from '@shared/models/CNP';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-programare',
  templateUrl: './programare.component.html',
  styleUrl: './programare.component.scss'
})
export class ProgramareComponent implements OnInit{
  @Input() serviciu:Serviciu;
  @Input() slot:Slot;
  solicitant:Solicitant;
  dataForm:any;
  public readonly=false;
  public submitted:boolean=false;
  telefonInputMask = createMask('(0999) 999-999');
  cnpInputMask = createMask('9999999999999');
   constructor(@Inject(MAT_DIALOG_DATA) public data:any,
             protected programari:ProgramariService,
             private snackBar:MatSnackBar){
    this.serviciu=data.serviciu;
    this.slot= data.slot;
    if(data.hasOwnProperty('solicitant')){
      this.solicitant=data.solicitant;
    }else{
      this.solicitant=new Solicitant();
    }
    if(data.hasOwnProperty('mode')){
      this.readonly=data['mode']=='read';
    }


    }

    ngOnInit(): void {
      let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      this.dataForm = new FormGroup(
        {
        'nume': new FormControl(this.solicitant.nume, [Validators.required]),
        'cnp': new FormControl(this.solicitant.cnp, [Validators.required, this.isValidCNP]),
        'email': new FormControl(this.solicitant.email, [Validators.required,Validators.pattern(emailregex)]),
        'prenume': new FormControl(this.solicitant.prenume, [Validators.required]),
        'telefon': new FormControl(this.solicitant.telefon, [Validators.required]),
       });
    }

    creaza(){
      let currentData={
        slot:{
          durata_minute:this.slot.durata_minute,
          furnizor: this.slot.furnizor,
          serviciu:this.slot.serviciu,
          prestator:this.slot.prestator,
          start:this.slot.start,
          zi:this.slot.zi,
          anulare_minute:this.serviciu.anulare_minute,
        },
        solicitant:{
          nume:this.solicitant.nume,
          prenume:this.solicitant.prenume,
          cnp:this.solicitant.cnp,
          email:this.solicitant.email,
          telefon:this.solicitant.telefon
        },
        data: new Date(),
        libera:true,
        confirmata:false,
        anulata:false
      };
        // Parametru nou, fac add
      this.programari.create(currentData)
        .then((docRef)=>{
          this.submitted = true;
            let mesaj='Ati facut o rezervare  la serviciu '+currentData.slot.serviciu+ ' furnizat de '+ currentData.slot.furnizor;
            if(currentData.slot.prestator){
              mesaj+=(' prestat de '+ currentData.slot.prestator);
            }
            mesaj+=(' pentru data de '+('0'+currentData.slot.zi.getDate()).slice(-2)+'.'+('0'+(1+currentData.slot.zi.getMonth())).slice(-2)+'.'+currentData.slot.zi.getFullYear() +' ora '+currentData.slot.start);
            mesaj+=(' Pentru confirmare dati click aici: '+env.app.hosting+env.app.confirmation_path+docRef.id);
            mesaj+=(' Pentru anulare programare confirmata dati click aici:'+env.app.hosting+env.app.cancellation_path+docRef.id);
            this.sendEmail_confirmare_programare(currentData.solicitant.email, mesaj);
        })
        .catch(err=>{
          console.error(err);
          this.snackBar.open('A aparut o eroare la salvare:'+ err.message,'Inchide',{duration:env.notification_timeout});
        })
     }

     public sendEmail_confirmare_programare(email:string, mesaj:string) {
      let form_to_send= document.createElement('form');
      let node=document.createElement('input')
      node.type='text';
      node.name='to_name';
      node.value=email;
      form_to_send.appendChild(node);
      node=document.createElement('input');
      node.type='text';
      node.name='from_name';
      node.value='Programari ONLINE';
      form_to_send.appendChild(node);
      let ta=document.createElement('textarea');
      ta.name='message';
      ta.value=mesaj;
      form_to_send.appendChild(ta);
      emailjs
        .sendForm(env.emailjs.serviceId, env.emailjs.templateIdConfirmareProgramare, form_to_send as HTMLFormElement,
          {publicKey: env.emailjs.publicKey}
          ).then(
          () => {
            console.log('SUCCESS!');
          },
          (error) => {
            console.log('FAILED...', (error as EmailJSResponseStatus).text);
          },
        );
    }

    isValidCNP(control:any){
      let cnp= control.value;
      let cnpObj=new CNP(cnp);
      return !cnpObj.isValid() ? { 'requirements': true } : null;
    }

    cnpErrors() {
        return this.dataForm.get('cnp').hasError('required') ? 'Camp obligatoriu ' :
           this.dataForm.get('cnp').hasError('requirements') ? 'CNP invalid' : '';
    }

    checkValidation(input: string){
      const validation = this.dataForm.get(input).invalid && (this.dataForm.get(input).dirty || this.dataForm.get(input).touched)
      return validation;
    }

 }
