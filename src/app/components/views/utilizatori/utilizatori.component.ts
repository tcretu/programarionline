import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { Utilizator } from '@models/utilizator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilizatoriService } from '@services/utilizatori.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment as env } from '@environments/environment';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProfilComponent } from '@components/forms/profil/profil.component';
import { InregistrareUtilizatorComponent } from '@components/forms/inregistrare-utilizator/inregistrare-utilizator.component';

@Component({
  selector: 'app-users',
  templateUrl: './utilizatori.component.html',
  styleUrl: './utilizatori.component.scss',
})
export class UtilizatoriComponent implements AfterViewInit{
  // allUsers:User[]=[];
  parametruCurent:Utilizator|null=null;
  allDocuments:Utilizator[]=[];
  dataSet:Utilizator[]=[];
  filterValue:string='';
  dataSource= new MatTableDataSource();
  filterSelectObj:any[] = [];
  filterValues:any = {};
  displayedColumns: string[] = [ 'email', 'displayName', 'emailVerified', 'IsAdmin', 'IsFurnizor'];
  displayedColumnsExt: string[] = this.displayedColumns.concat([/*'View',*/ 'Delete']);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(public utilizatori:UtilizatoriService,
              private router: Router,
              private snackBar:MatSnackBar,
              public dialogInfo:MatDialog) {
    this.filterSelectObj = [
      {
        name: 'uid',
        columnProp: 'uid',
        options: []
      },{
        name:'displayName',
        columnProp:'displayName',
        options:[]
      },{
        name:'email',
        columnProp:'email',
        options:[]
      },
      {
        name:'emailVerified',
        columnProp:'emailVerified',
        options:[]
      },
      {
        name:'isAdmin',
        columnProp:'isAdmin',
        options:[]
      },
      {
        name:'isFurnizor',
        columnProp:'isFurnizor',
        options:[]
      }
    ];
    this.getAllDocuments();
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  getFilterObjectByName(name:string){
    let filterObj= this.filterSelectObj.filter(data=>{return data.name==name});
    if(filterObj.length == 0){
      return null;
    }
    return filterObj[0];
  }

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

  getAllDocuments() {
    this.utilizatori.getAllAsObservable().snapshotChanges().pipe(
      map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        ))
      ).subscribe(documents=>{
        this.allDocuments=documents;
        this.allDocuments.forEach((user:any)=>
          {
          user.isAdmin = this.utilizatori.userHasRole(user,'admin');
          user.isFurnizor = this.utilizatori.userHasRole(user,'furnizor');
          }
        );
        this.dataSet=this.allDocuments;
        this.dataSource.data = this.allDocuments;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.filterSelectObj.filter((o:any) => {
          o.options = this.getFilterObject(this.dataSource.data, o.columnProp);
        });
      }
      );
    }
/*
  __getUsers() {
    this.utilizatori.getAllAsObservable().valueChanges().subscribe((users:any)=>{
      this.allUsers=users;
      this.allUsers.forEach((user:any)=>
        {
          user.isAdmin = this.utilizatori.userHasRole(user,'admin');
          user.isFurnizor = this.utilizatori.userHasRole(user,'furnizor');
        }
      );
    this.dataSet=this.allUsers;
    this.dataSource.data = this.allUsers;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.filterSelectObj.filter((o) => {
      o.options = this.getFilterObject(this.dataSource.data, o.columnProp);
    });
    });
 }
*/

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
resetFilter(){
  this.filterValue='';
  this.allDocuments=this.dataSet;
  this.dataSource.data=this.dataSet;
}

goToRegisterUser(){
  this.router.navigate(['/register-user']);
}

createFilter() {
  let filterFunction = function (data: any, filter: string): boolean {
    let searchTerms = JSON.parse(filter);
    let isFilterSet = false;
    for (const col in searchTerms) {
      if (searchTerms[col].toString() !== '') {
        isFilterSet = true;
      } else {
        delete searchTerms[col];
      }
    }

    let nameSearch = () => {
      let found = false;
      if (isFilterSet) {
        for (const col in searchTerms) {
          searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
            if ((data[col]!=null) && (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet)) {
              found = true
            }
          });
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
  //let filterValues = {}
  this.filterValues[filter.columnProp] = event.value != null? event.value.toString().trim().toLowerCase():'';
  this.dataSource.filter = JSON.stringify(this.filterValues)
}

resetFilters() {
  this.filterValues = {}
  this.filterSelectObj.forEach((value, key) => {
    value.modelValue = undefined;
  })
  this.dataSource.filter = "";
}

reset(){
  this.resetFilters();
  this.getAllDocuments();
  this.snackBar.open('Lista de parametri a fost actualizata!','Inchide',{duration:env.notification_timeout});
}

removeRole(user:any, rol:string){
  this.utilizatori.userRemoveRole(user,rol);
  this.snackBar.open('Eliminare rol '+rol+' la '+user.email,'Inchide',{duration:env.notification_timeout});
}

addRole(user:any, rol:string){
  this.utilizatori.userAddRole(user,rol);
  this.snackBar.open('Adaugare rol '+rol+' la '+user.email,'Inchide',{duration:env.notification_timeout});
}

//actiunile de pe butoanele din fiecare linie
view(data:any){
  // seteaza parametrul curent in componenta de editare
  this.dialogInfo.open(ProfilComponent,{data:{parametru:data}});
 //this.parametruCurent=data;
}

inregistrareUtilizator(){
this.dialogInfo.open(InregistrareUtilizatorComponent, {data:{modal:true}});
}


delete(data:any){
  if(confirm('Stergeti inregistrarea?')){
    this.utilizatori.delete(data.id);
    this.snackBar.open('Utilizatorul '+data.email+ ' a fost sters. Nu uitati sa stergeti si din panoul se administrare a proiectului Firebase sectiunea Authentication->Users. ','Inchide',{duration:env.notification_timeout*2});
  }
}

resetEditContent(){
  // reseteaza parametrul curent de editat si va disparea componenta de editare
  this.parametruCurent=null;
}

}
