import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametriService } from '@services/parametri.service';
import { Parametru } from '@models/parametru';
import { map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '@environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ParametruComponent } from '@components/forms/parametru/parametru.component';
const COLLECTION_NAME='parametri';

@Component({
  selector: 'app-parameters',
  templateUrl: './parametri.component.html',
  styleUrl: './parametri.component.scss'
})
export class ParametriComponent implements AfterViewInit {
parametruCurent:Parametru|null;
displayedColumns: string[] = ['tip', 'nume', 'descriere'];
displayedColumnsExt: string[] = this.displayedColumns.concat([/*'Edit',*/ 'Delete']);
title:string= COLLECTION_NAME.charAt(0).toUpperCase()+COLLECTION_NAME.substring(1).toLowerCase();
filterSelectObj:any =this.displayedColumnsExt.map(column=>{return {name:column, columnProp:column,options:[]}});
allDocuments:Parametru[]=[];
dataSet:Parametru[]=[];
filterValue:string='';
dataSource= new MatTableDataSource();
filterValues:any = {};
@ViewChild(MatPaginator)
paginator!: MatPaginator;

constructor(public afs:AngularFirestore,
          private parametri:ParametriService,
          private snackBar:MatSnackBar,
          public dialogInfo:MatDialog) {
  this.getAllDocuments();
  this.parametruCurent=null;
  this.parametri.reset();
}


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}

// filtering utils
getFilterObjectByName(name:string){
  let filterObj= this.filterSelectObj.filter((data:any)=>{return data.name==name});
  if(filterObj.length == 0){
    return null;
  }
  return filterObj[0];
}

// filtering utils
getFilterObject(fullObj: any[], key:any) {
  const uniqChk:string[] = [];
  fullObj.filter((obj: { [x: string]: string; }) => {
    if (!uniqChk.includes(obj[key])) {
      uniqChk.push(obj[key]);
    }
    return obj;
    });
  return uniqChk;
}

// incarca toate datele
getAllDocuments() {
this.parametri.getAllAsObservable().snapshotChanges().pipe(
  map(changes=>
    changes.map(c =>
      ({ id: c.payload.doc.id, ...c.payload.doc.data() })
    ))
  ).subscribe(documents=>{
    this.allDocuments=documents;
    this.dataSet=this.allDocuments;
    this.dataSource.data = this.allDocuments;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.filterSelectObj.filter((o:any) => {
      o.options = this.getFilterObject(this.dataSource.data, o.columnProp);
    });
    this.parametruCurent=null;
  }
  );
}


applyFilter(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value.trim();
  if(this.filterValue ==''){
    this.dataSource.data=this.dataSet;
  }else{
    this.dataSource.data=(this.dataSet.filter((filterV)=>{
      return JSON.stringify(Object.values(filterV)).toLowerCase().indexOf(this.filterValue.toLowerCase())>=0;
    }) ) ;
  }
}

createFilter() {
let filterFunction = (data: any, filter: string): boolean =>{
  let searchTerms = JSON.parse(filter);
  let isFilterSet = false;
  for (const col in searchTerms) {
    if (searchTerms[col].toString() !== '') {
      isFilterSet = true;
    }else {
      delete searchTerms[col];
    }
  }

  let nameSearch = () => {
    let found = false;
    if (isFilterSet) {
      for (const col in searchTerms) {
        if((data[col]!=null)&&(data[col].toString().toLowerCase().indexOf(searchTerms[col].trim().toLowerCase())!=-1)){
          found = true;
        }
        /*
        searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
          if ((data[col]!=null) && (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet)) {
            found = true
          }
        });
        */
      }
      return found;
    } else {
      return true;
    }
  }
  return nameSearch();
}
return filterFunction
}


filterChange(filter:any, event:any) {
  this.filterValues[filter.columnProp] = event.value != null? event.value.toString().trim().toLowerCase():'';
  this.dataSource.filter = JSON.stringify(this.filterValues)
}

resetFilters() {
  this.filterValues = {}
  this.filterSelectObj.forEach((value:any, key:any) => {
    value.modelValue = undefined;
  })
  this.dataSource.filter = "";
}


//actiunile de pe butoanele din fiecare linie
edit(data:any){
  // seteaza parametrul curent in componenta de editare
  //this.parametruCurent=data;
  this.dialogInfo.open(ParametruComponent, {data:{parametru:data}});
}


delete(data:any){
  if(confirm('Stergeti inregistrarea?')){
    this.parametri.delete(data.id);
    this.snackBar.open('Parametrul '+data.tip+ ' a fost sters','Inchide',{duration:env.notification_timeout});
  }
}


//apelat la Adauga din actionBar
newData(){
  // creeaza un parametru nou pentru operatiunea de Adauga in componenta de editare
  let data = new Parametru();
//  this.parametruCurent=data;
  this.dialogInfo.open(ParametruComponent, {data:{parametru:data}});
}


resetEditContent(){
  // reseteaza parametrul curent de editat si va disparea componenta de editare
  this.parametruCurent=null;
}


reset(){
  this.resetFilters();
  this.getAllDocuments();
  this.snackBar.open('Lista de '+COLLECTION_NAME+' a fost actualizata!','Inchide',{duration:env.notification_timeout});
}

}
