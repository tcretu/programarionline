import { ParametriService } from '@services/parametri.service';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Parametru } from '@models/parametru';
import { environment as env } from '@environments/environment';
import { Observable, map, startWith } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciiService } from '@services/servicii.service';
import { FurnizoriService } from '@services/furnizori.service';
import { ProgramariService } from '@services/programari.service';
import { AutentificareService } from '@services/autentificare.service';
const MODEL_NAME='Serviciu';

@Component({
  selector: 'app-serviciu',
  templateUrl: './serviciu.component.html',
  styleUrl: './serviciu.component.scss'
})
export class ServiciuComponent implements OnInit{
  title:string;
  @Input() parametru?:Parametru;
  @Output() refreshList:EventEmitter<any> = new EventEmitter();
  @Output() onclose:EventEmitter<any> = new EventEmitter();
  currentData:any= new Parametru();
  message='';
  public orar_identic:boolean=false;
  public dataForm!:FormGroup;
  domeniuControl = new FormControl('');
  judetControl = new FormControl('');
  furnizorControl = new FormControl('');
  zileLibereControl=new FormControl('');
  filteredOptionsZiLibera: Observable<string[]>;
  filteredOptionsJudet: Observable<string[]>;
  filteredOptionsDomeniu: Observable<string[]>;
  filteredOptionsFurnizor: Observable<string[]>;
  furnizor:any=null;
  public lstZiLiberaParametri:string[]=[];
  public lstJudetParametri:string[]=[];
  public lstNumeFurnizori:string[]=[];
  public lstDomeniuParametri:string[]=[];
  constructor(public servicii:ServiciiService,
              private parametri:ParametriService,
              private furnizori:FurnizoriService,
              private snackBar:MatSnackBar,
              private programari:ProgramariService,
              private autentificare:AutentificareService,
              @Inject(MAT_DIALOG_DATA) public data:any,) {
   if(autentificare.isFurnizor && !autentificare.isAdmin){
      furnizori.getAsObservableBy('email', autentificare.UserData.email).snapshotChanges().pipe(
        map(changes=>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )),
        ).subscribe(documents=>{
          this.furnizor=documents[0];
        });
    }
    this.currentData=data.parametru;
    this.title= (typeof this.currentData.id=='undefined'? 'Adaugare ':'')+ MODEL_NAME;
    this.getFurnizoriNumeList();
    this.getParametriDomeniuList();
    this.getParametriJudetList();
    this.getParametriZiLiberaList();
    this.filteredOptionsDomeniu = this.domeniuControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterDomeniu(value || '')),
    );
    this.filteredOptionsJudet = this.judetControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterJudet(value || '')),
    );
    this.filteredOptionsFurnizor = this.furnizorControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterFurnizor(value || '')),
    );
    this.filteredOptionsZiLibera = this.zileLibereControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterZiLibera(value || '')),
    );

   }


 ngOnInit(): void {
  this.message='';
  this.dataForm = new FormGroup(
    {
    'nume': new FormControl(this.currentData.nume, [Validators.required]),
    'furnizor': new FormControl(this.currentData.furnizor, [Validators.required]),
    'domeniu': new FormControl(this.currentData.domeniu, [Validators.required]),
    'dezactivat': new FormControl(this.currentData.dezactivat),
    'judet': new FormControl(this.currentData.judet, [Validators.required]),
    'localitate': new FormControl(this.currentData.localitate, [Validators.required]),
    'strada': new FormControl(this.currentData.strada),
    'nr': new FormControl(this.currentData.nr),
    'bl': new FormControl(this.currentData.bl),
    'sc': new FormControl(this.currentData.sc),
    'ap': new FormControl(this.currentData.ap),
    'are_prestator':new FormControl(this.currentData.are_prestator),
    'prestator':new FormControl(this.currentData.prestator),
    'prestatie':new FormControl(this.currentData.prestatie),
    'zile_libere': new FormControl(this.currentData.zile_libere),
    'permanent': new FormControl(this.currentData.permanent),
    'data_start': new FormControl(this.currentData.data_start),
    'data_end': new FormControl(this.currentData.data_end),
    'durata_minute': new FormControl(this.currentData.durata_minute),
    'anulare_minute': new FormControl(this.currentData.anulare_minute),
    'orar_luni_start':new FormControl(this.currentData.orar[1].start),
    'orar_luni_end':new FormControl(this.currentData.orar[1].end),
    'orar_luni_inactiv':new FormControl(this.currentData.orar[1].inactiv),
    'orar_marti_start':new FormControl(this.currentData.orar[2].start),
    'orar_marti_end':new FormControl(this.currentData.orar[2].end),
    'orar_marti_inactiv':new FormControl(this.currentData.orar[2].inactiv),
    'orar_miercuri_start':new FormControl(this.currentData.orar[3].start),
    'orar_miercuri_end':new FormControl(this.currentData.orar[3].end),
    'orar_miercuri_inactiv':new FormControl(this.currentData.orar[3].inactiv),
    'orar_joi_start':new FormControl(this.currentData.orar[4].start),
    'orar_joi_end':new FormControl(this.currentData.orar[4].end),
    'orar_joi_inactiv':new FormControl(this.currentData.orar[4].inactiv),
    'orar_vineri_start':new FormControl(this.currentData.orar[5].start),
    'orar_vineri_end':new FormControl(this.currentData.orar[5].end),
    'orar_vineri_inactiv':new FormControl(this.currentData.orar[5].inactiv),
    'orar_sambata_start':new FormControl(this.currentData.orar[6].start),
    'orar_sambata_end':new FormControl(this.currentData.orar[6].end),
    'orar_sambata_inactiv':new FormControl(this.currentData.orar[6].inactiv),
    'orar_duminica_start':new FormControl(this.currentData.orar[0].start),
    'orar_duminica_end':new FormControl(this.currentData.orar[0].end),
    'orar_duminica_inactiv':new FormControl(this.currentData.orar[0].inactiv),
    'orar_identic':new FormControl(this.orar_identic),

   // orar:OrarZilnic[];

   }
  );
 }

 private _filterZiLibera(value: string): string[] {
  return this.lstZiLiberaParametri.filter(option => option.toLowerCase().includes(value.toLowerCase()));
 }
 private _filterJudet(value: string): string[] {
  return this.lstJudetParametri.filter(option => option.toLowerCase().includes(value.toLowerCase()));
 }

 private _filterDomeniu(value: string): string[] {
  return this.lstDomeniuParametri.filter(option => option.toLowerCase().includes(value.toLowerCase()));
 }

 private _filterFurnizor(value: string): string[] {
  return this.lstNumeFurnizori.filter(option => option.toLowerCase().includes(value.toLowerCase()));
 }

 getParametriJudetList(){
  this.lstJudetParametri=[];
  this.parametri.getAsObservableByTip('judet').snapshotChanges().pipe(
    map((changes:any)=>
      changes.map((c:any) =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    (documents:any)=>{
      documents.forEach((document:any)=>{
        let key:string = (typeof document.nume == 'undefined'?'':document.nume);
        if((key!='') && !this.lstJudetParametri.includes(key)){
          this.lstJudetParametri.push(key);
          this.lstJudetParametri.sort();
        }
      });
    }
  );
 }

 getParametriZiLiberaList(){
  this.lstZiLiberaParametri=[];
  this.parametri.getAsObservableByTip('zi libera').snapshotChanges().pipe(
    map((changes:any)=>
      changes.map((c:any) =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    (documents:any)=>{
      documents.forEach((document:any)=>{
        let key:string = (typeof document.nume == 'undefined'?'':document.nume);
        if((key!='') && !this.lstZiLiberaParametri.includes(key)){
          this.lstZiLiberaParametri.push(key);
          this.lstZiLiberaParametri.sort();
        }
      });
      if(!this.currentData.id){
        this.currentData.zile_libere=this.lstZiLiberaParametri;
      }
    }
  );
 }

 getParametriDomeniuList(){
  this.lstDomeniuParametri=[];
  this.parametri.getAsObservableByTip('domeniu').snapshotChanges().pipe(
    map((changes:any)=>
      changes.map((c:any) =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    (documents:any)=>{
      documents.forEach((document:any)=>{
        let key:string = (typeof document.nume == 'undefined'?'':document.nume);
        if((key!='') && !this.lstDomeniuParametri.includes(key)){
          this.lstDomeniuParametri.push(key);
          this.lstDomeniuParametri.sort();
        }
      });
    }
  );
 }

 getFurnizoriNumeList(){
  this.lstNumeFurnizori=[];
  this.furnizori.getAllAsObservable().snapshotChanges().pipe(
    map((changes:any)=>
      changes.map((c:any) =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    (documents:any)=>{
      if(this.furnizor){
        // nu este administrator, filtrez lista doar cu serviciile lui
        documents=documents.filter((furnizor:any)=>(furnizor.nume == this.furnizor.nume));
      }
      documents.forEach((document:any)=>{
        let key:string = (typeof document.nume == 'undefined'?'':document.nume);
        if((key!='') && !this.lstNumeFurnizori.includes(key)){
          this.lstNumeFurnizori.push(key);
          this.lstNumeFurnizori.sort();
        }
      });
    }
  );
 }

copy_orar(){
if(this.orar_identic){
  for(let i:number=2;i<8;i++){
    this.currentData.orar[i % 7].start=this.currentData.orar[1].start;
    this.currentData.orar[i % 7].end=this.currentData.orar[1].end;
  }
  this.snackBar.open('Orar copiat la celelalte zile','Inchide',{duration:env.notification_timeout});
}
}

 update(){
  if(this.currentData.id){
    // exista Parametru, fac update
    this.servicii.update(this.currentData.id, this.currentData)
    .then(()=> this.snackBar.open('Serviciul '+this.currentData.nume+ ' a fost actualizat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la actualizare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    }
      )
  }else{
    // Parametru nou, fac add
    this.servicii.create(this.currentData)
    .then(()=>this.snackBar.open('Serviciul '+this.currentData.nume+ ' a fost salvat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la salvare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    })
  }
 }

 reset_daca_nu_are_prestator(){
  if(!this.currentData.are_prestator){
    this.currentData.prestator='';
    this.currentData.prestatie='';
  }
 }


}
