import { AutentificareService } from '@services/autentificare.service';
import { ServiciiService } from './../../../shared/services/servicii.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciuComponent } from '@components/forms/serviciu/serviciu.component';
import { Serviciu } from '@models/serviciu';
import { map } from 'rxjs';
import { environment as env } from '@environments/environment';
import { FurnizoriService } from '@services/furnizori.service';
const COLLECTION_NAME='servicii';
@Component({
  selector: 'app-servicii',
  templateUrl: './servicii.component.html',
  styleUrl: './servicii.component.scss'
})
export class ServiciiComponent implements AfterViewInit{
  parametruCurent:Serviciu|null;
  displayedColumns: string[] = ['nume', 'furnizor','domeniu','prestator','dezactivat'];
  displayedColumnsExt: string[] = this.displayedColumns.concat(['Delete']);
  title:string= COLLECTION_NAME.charAt(0).toUpperCase()+COLLECTION_NAME.substring(1).toLowerCase();
  filterSelectObj:any =this.displayedColumnsExt.map(column=>{return {name:column, columnProp:column,options:[]}});
  allDocuments:Serviciu[]=[];
  dataSet:Serviciu[]=[];
  filterValue:string='';
  dataSource= new MatTableDataSource();
  filterValues:any = {};
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  furnizor:any=null;

  constructor(private router: Router,
    private servicii:ServiciiService,
    private snackBar:MatSnackBar,
    public dialogInfo:MatDialog,
    private autentificare:AutentificareService,
    private furnizori:FurnizoriService) {
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
    this.getAllDocuments();
    this.parametruCurent=null;
    this.servicii.reset();
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
this.servicii.getAllAsObservable().snapshotChanges().pipe(
  map(changes=>
    changes.map(c =>
      ({ id: c.payload.doc.id, ...c.payload.doc.data() })
    )),
  ).subscribe(documents=>{
    if(this.furnizor){
      // nu este administrator, filtrez lista doar cu serviciile lui
      documents=documents.filter((serviciu)=>(serviciu.furnizor == this.furnizor.nume));
    }else{
      if(!this.autentificare.isAdmin){
        // daca nu exista furnizor creat cu email ul respectiv si nu e admin
        documents=[];
      }
    }
    documents=documents.map(document=>
      ({...document,
        data_start:(new Date(document.data_start.seconds*1000)),
        data_end:(new Date(document.data_end.seconds*1000))}));
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
  console.log('Filter value='+this.filterValue)
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
return filterFunction;
}


filterChange(filter:any, event:any) {
  console.log(filter)
  this.filterValues[filter.columnProp] = event.value != null? event.value.toString().trim().toLowerCase():'';
  console.log(this.filterValues[filter.columnProp])
  console.log(this.filterValues)
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
  this.dialogInfo.open(ServiciuComponent, {data:{parametru:data}});
}


delete(data:any){
  if(confirm('Stergeti inregistrarea?')){
    this.servicii.delete(data.id);
    this.snackBar.open('Furnizorul '+data[this.servicii.key]+ ' a fost sters','Inchide',{duration:env.notification_timeout});
  }
}


//apelat la Adauga din actionBar
newData(){
  // creeaza un parametru nou pentru operatiunea de Adauga in componenta de editare
  let data = new Serviciu();
  this.dialogInfo.open(ServiciuComponent, {data:{parametru:data}});
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
