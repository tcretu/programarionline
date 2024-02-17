import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Parametru } from '@models/parametru';
import { ParametriService } from '@services/parametri.service';
import { environment as env } from '@environments/environment';
import { Observable, map, startWith } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
const MODEL_NAME='Parametru';

@Component({
  selector: 'app-parametru',
  templateUrl: './parametru.component.html',
  styleUrl: './parametru.component.scss'
})
export class ParametruComponent implements OnInit, OnChanges{
title:string;
@Input() parametru?:Parametru;
@Output() refreshList:EventEmitter<any> = new EventEmitter();
@Output() onclose:EventEmitter<any> = new EventEmitter();
currentData:any= new Parametru();
message='';
public dataForm!:FormGroup;
public lstTip:string[]=[];
tipControl = new FormControl('');
filteredOptions: Observable<string[]>;
constructor(public parametri:ParametriService,
            private snackBar:MatSnackBar,
            @Inject(MAT_DIALOG_DATA) public data:any,) {
  this.currentData=data.parametru;
  this.title= (typeof this.currentData.id=='undefined'? 'Adaugare ':'')+ MODEL_NAME;
  this.getTipList();
  this.filteredOptions = this.tipControl.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value || '')),
  );
 }

 ngOnInit(): void {
  this.message='';
  this.dataForm = new FormGroup(
    {
    'tip': this.tipControl,
    'nume': new FormControl(this.currentData.nume, [Validators.required]),
    'descriere': new FormControl(this.currentData.descriere),
   }
  );
 }

 private _filter(value: string): string[] {
  return this.lstTip.filter(option => option.toLowerCase().includes(value.toLowerCase()));
}

 ngOnChanges(changes: SimpleChanges): void {
  this.message='';
  this.dataForm = new FormGroup(
    {
    'tip': new FormControl(this.parametru?.tip,[Validators.required]),
    'nume': new FormControl(this.parametru?.nume, [Validators.required]),
    'descriere': new FormControl(this.parametru?.descriere),
   }
  );
  this.currentData = {...this.parametru!};
  this.currentData.descriere=(typeof this.currentData.descriere == 'undefined')?'':this.currentData.descriere;
  this.title= (this.currentData.id? '':'Adaugare ')+ MODEL_NAME;
  this.getTipList();
 }

 getTipList(){
  this.lstTip=[];
  this.parametri.getAllAsObservable().snapshotChanges()
  .pipe(map(changes=>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).
    subscribe(
    documents=>{
      documents.forEach((document)=>{
        let tip:string = (typeof document.tip == 'undefined'?'':document.tip);
        if((tip!='') && !this.lstTip.includes(tip)){
          this.lstTip.push(tip);
          this.lstTip.sort();
        }
      });
    }
  );
 }

 update(){
  if(this.currentData.id){
    // exista Parametru, fac update
    this.parametri.update(this.currentData.id, this.currentData)
    .then(()=> this.snackBar.open('Parametrul '+this.currentData.tip+ ' a fost actualizat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la actualizare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    }
      )
  }else{
    // Parametru nou, fac add
    this.parametri.create(this.currentData)
    .then(()=>this.snackBar.open('Parametrul '+this.currentData.tip+ ' a fost salvat','Inchide',{duration:env.notification_timeout}))
    .catch(err=>{
      console.error(err);
      this.snackBar.open('A aparut o eroare la salvare:'+ err.message,'Inchide',{duration:env.notification_timeout});
    })
  }
 }


}
