import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Furnizor } from '@models/furnizor';
import { FurnizoriService } from '@services/furnizori.service';
import { environment as env } from '@environments/environment';
import { Observable, map, startWith } from 'rxjs';
import { UtilizatoriService } from '@services/utilizatori.service';
import { ParametriService } from '@services/parametri.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
const MODEL_NAME='Furnizor';

@Component({
  selector: 'app-furnizor',
  templateUrl: './furnizor.component.html',
  styleUrl: './furnizor.component.scss'
})
export class FurnizorComponent implements OnInit, OnChanges{
  title:string;
  @Input() parametru?:Furnizor;
  @Input() readOnly=false;
  @Output() refreshList:EventEmitter<any> = new EventEmitter();
  @Output() onclose:EventEmitter<any> = new EventEmitter();
  currentData:any= new Furnizor();
  message='';
  public dataForm!:FormGroup;
  public lstEmailUtilizatori:string[]=[];
  public lstJudetParametri:string[]=[];
  emailControl = new FormControl('');
  judetControl = new FormControl('');
  filteredOptionsEmail: Observable<string[]>;
  filteredOptionsJudet: Observable<string[]>;
  constructor(public furnizori:FurnizoriService,
    private utilizatori:UtilizatoriService,
    private parametri:ParametriService,
    private route: ActivatedRoute,
    private snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data:any,) {

  this.currentData=data.parametru;
  this.title= (typeof this.currentData.id=='undefined'? 'Adaugare ':'')+ MODEL_NAME;
  this.getUtilizatoriEmailList();
  this.getParametriJudetList();
  this.filteredOptionsEmail = this.emailControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filterEmail(value || '')),
  );
  this.filteredOptionsJudet = this.judetControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filterJudet(value || '')),
  );
}

ngOnInit(): void {
  this.message='';
  this.dataForm = new FormGroup(
    {
    'nume': new FormControl(this.parametru?.nume, [Validators.required]),
    'cui': new FormControl(this.parametru?.cui, [Validators.required]),
    'email': new FormControl(this.parametru?.email, [Validators.required]),
    'judet': new FormControl(this.parametru?.judet, [Validators.required]),
    'localitate': new FormControl(this.parametru?.localitate, [Validators.required]),
    'strada': new FormControl(this.parametru?.strada),
    'telefon': new FormControl(this.parametru?.telefon, [Validators.required]),
    'nr': new FormControl(this.parametru?.nr),
    'bl': new FormControl(this.parametru?.bl),
    'sc': new FormControl(this.parametru?.sc),
    'ap': new FormControl(this.parametru?.ap),
   });
 }

 private _filterEmail(value: string): string[] {
  return this.lstEmailUtilizatori.filter(option => option.includes(value));
}

private _filterJudet(value: string): string[] {
  return this.lstJudetParametri.filter(option => option.toLowerCase().includes(value.toLowerCase()));
}

 ngOnChanges(changes: SimpleChanges): void {
  this.message='';
  this.dataForm = new FormGroup(
    {
    'nume': new FormControl(this.parametru?.nume, [Validators.required]),
    'cui': new FormControl(this.parametru?.cui, [Validators.required]),
    'email': new FormControl(this.parametru?.email, [Validators.required]),
    'judet': new FormControl(this.parametru?.judet, [Validators.required]),
    'localitate': new FormControl(this.parametru?.localitate, [Validators.required]),
    'strada': new FormControl(this.parametru?.strada),
    'telefon': new FormControl(this.parametru?.telefon, [Validators.required]),
    'nr': new FormControl(this.parametru?.nr),
    'bl': new FormControl(this.parametru?.bl),
    'sc': new FormControl(this.parametru?.sc),
    'ap': new FormControl(this.parametru?.ap),
   }
  );
  this.currentData = {...this.parametru!};
  this.title= (this.currentData.id? '':'Adaugare ')+ MODEL_NAME;
 }


 getUtilizatoriEmailList(){
  this.lstEmailUtilizatori=[];
  this.utilizatori.getAllAsObservable().snapshotChanges().pipe(
    map(changes=>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    documents=>{
      documents.forEach((document)=>{
        if(this.utilizatori.userHasRole(document, 'furnizor')){
          let key:string = (typeof document.email == 'undefined'?'':document.email);
          if((key!='') && !this.lstEmailUtilizatori.includes(key)){
            this.lstEmailUtilizatori.push(key);
            this.lstEmailUtilizatori.sort();
          }
        }
      });
    }
  );
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

 update(){
  console.log(this.currentData)
  if(this.currentData.id){
    // exista Parametru, fac update
    this.furnizori.update(this.currentData.id, this.currentData)
    .then(()=> this.snackBar.open('Furnizorul '+this.currentData.nume+ ' a fost actualizat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la actualizare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    }
      )
  }else{
    // Parametru nou, fac add
    this.furnizori.create(this.currentData)
    .then(()=>this.snackBar.open('Furnizorul '+this.currentData.nume+ ' a fost salvat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la salvare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    })
  }
 }


 close(){
  this.onclose.emit();
 }


}
