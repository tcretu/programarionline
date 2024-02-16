import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InformatiiAplicatieComponent } from '@components/forms/informatii-aplicatie/informatii-aplicatie.component';
import { Serviciu } from '@models/serviciu';
import { ProgramariService } from '@services/programari.service';
import { ServiciiService } from '@services/servicii.service';
import { environment as env } from '@environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Slot } from '@models/slot';
import { ProgramareComponent } from '@components/forms/programare/programare.component';

@Component({
  selector: 'app-programeaza',
  templateUrl: './programeaza.component.html',
  styleUrl: './programeaza.component.scss'
})
export class ProgrameazaComponent {
  public lista_alfabetica_domenii_servicii:string[]=[];
  public lista_alfabetica_judete_servicii:string[]=[];
  public lista_alfabetica_orase_din_judet:string[]=[];
  public lista_servicii:Serviciu[]=[];
  public currentData:any=null;
  currentDataAsObservable: BehaviorSubject<any>;
  selectedDateAsObservable:BehaviorSubject<any>;
  public serviciu:any;
  public title:string;
  public subtitle:string;
  public judet='';
  public localitate='';
  public minDate= new Date();
  public maxDate = new Date(2100,0,1);
  public selectedDate:Date|null= null;
  public sloturi:Slot[]=[];
  public sloturi_viitoare:Slot[]=[];
  public sloturi_ocupate:Slot[]=[];
  public search_value='';
  public domeniu_serviciu:any|null=null;
  public dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if(!this.currentData){
      return '';
    }
    if(cellDate<new Date()){ // este in trecut
      return '';
    }
    // Only highligh dates inside the month view.
    if (view === 'month') {
      if(this.programari.zi_cu_locuri_libere(this.currentData.nume, this.currentData.furnizor, this.currentData.prestator, cellDate)){
        return 'zi-cu-locuri-libere';
      }else{
        if(this.programari.zi_cu_toate_locurile_ocupate(this.currentData.nume, this.currentData.furnizor, this.currentData.prestator, cellDate)){
          return 'zi-fara-locuri-libere';
        }
      }
        return '';
    }

    return '';
  };

  constructor(protected programari:ProgramariService,
              protected servicii:ServiciiService,
              public dialogInfo:MatDialog){
  this.selectedDateAsObservable = new BehaviorSubject(null);
  this.selectedDateAsObservable.subscribe(_selectedDate=>{
      this.selectedDate = _selectedDate;
      if((this.currentData)&& (_selectedDate)){
        this.sloturi= this.programari.sloturi(this.currentData.nume, this.currentData.furnizor,this.currentData.prestator,  _selectedDate);
        this.sloturi_ocupate = this.programari.sloturi_ocupate(this.currentData.nume, this.currentData.furnizor,this.currentData.prestator,  _selectedDate);
        this.sloturi_viitoare=this.sloturi.filter(slot=>(!this.programari.slot_trecut(slot)));
      }else{
        this.sloturi=[];
        this.sloturi_ocupate=[];
        this.sloturi_viitoare=[];
      }
  });
  this.currentDataAsObservable = new BehaviorSubject(null);
  this.currentDataAsObservable.subscribe(_data =>{
  this.currentData = _data;
  this.selectedDate = null;
    if(_data){
      this.dateFilter=(date:Date):boolean=>{
        let dateOnly= date.setHours(0,0,0,0);
        let today = (new Date()).setHours(0,0,0,0);
        if(dateOnly < today){
          return false;
        }
        let result =
        this.programari.zi_cu_locuri_libere(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator,  date) &&
        this.programari.serviciu_disponibil_in_ziua(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator,  date);
        return result;
      }
    }
 })
 this.title=env.app.name;
 this.subtitle = 'Selectati un serviciu';
 this.servicii.getAllAsObservable().snapshotChanges().pipe(
      map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )),
      ).subscribe(documents=>{
          this.lista_servicii=documents.sort((a,b)=>(a.domeniu <b.domeniu ? -1:(a.domeniu == b.domeniu? (a.nume<b.nume?-1:1):1)));
          this.lista_alfabetica_domenii_servicii=documents.map(serviciu=>(serviciu.domeniu)).sort();
          this.lista_alfabetica_domenii_servicii = [...new Set(this.lista_alfabetica_domenii_servicii)];
          this.lista_alfabetica_judete_servicii=documents.map(serviciu=>(serviciu.judet)).sort();
          this.lista_alfabetica_judete_servicii = [...new Set(this.lista_alfabetica_judete_servicii)];
      });
  }

  load_data(){
    this.servicii.getAllAsObservable().snapshotChanges().pipe(
      map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )),
      ).subscribe(documents=>{
          if(this.judet!=''){
            documents=documents.filter(document=>(document.judet==this.judet));
            this.lista_alfabetica_orase_din_judet = documents.filter(serviciu=>(serviciu.judet == this.judet)).map(serviciu=>(serviciu.localitate));;
            if(this.localitate!=''){
              documents=documents.filter(document=>(document.localitate==this.localitate));
            }
          }
          if(this.search_value!=''){
                documents=documents.filter(document=>{
                  let found = false;
                  ['nume','furnizor','domeniu'].forEach(k=>{
                    if(document[k].toString().toLowerCase().indexOf(this.search_value.toLowerCase())>=0){
                      found=true;
                      console.log(document[k].toString())
                    }
                  });
                  return found;
                });
          }
          this.lista_servicii=documents.sort((a,b)=>(a.domeniu <b.domeniu ? -1:(a.domeniu == b.domeniu? (a.nume<b.nume?-1:1):1)));
          this.lista_alfabetica_domenii_servicii=documents.map(serviciu=>(serviciu.domeniu)).sort();
          this.lista_alfabetica_domenii_servicii = [...new Set(this.lista_alfabetica_domenii_servicii)];
      });
  }

  lista_alfabetica_servicii_din_domeniu(domeniu:string):any[]{
    let lista_servicii= this.lista_servicii.filter(serviciu=>(serviciu.domeniu == domeniu))
        .map(serviciu=>(serviciu.nume));
    lista_servicii = [... new Set(lista_servicii)];
    return lista_servicii;
  }

  lista_alfabetica_servicii_furnizori_dupa_domeniu_serviciu(domeniu:string, nume_serviciu:string):string[]{
    let lista_furnizori_servicii= this.lista_servicii.filter(serviciu=>
            ((serviciu.domeniu == domeniu)&&(serviciu.nume==nume_serviciu)))
            .map(serviciu=>(serviciu.furnizor))
            .sort((s1, s2)=>{return (s1<s2 ?-1:1)});
    return [...new Set(lista_furnizori_servicii)];
  }

  lista_alfabetica_servicii_prestatori_dupa_domeniu_serviciu_furnizor(domeniu:string, nume_serviciu:string, nume_furnizor:string):Serviciu[]{
    let lista_furnizori_servicii= this.lista_servicii.filter(serviciu=>
            ((serviciu.domeniu == domeniu)&&(serviciu.nume==nume_serviciu)&&(serviciu.furnizor==nume_furnizor)&&(serviciu.are_prestator)))
            .sort((s1, s2)=>{return (s1.prestator<s2.prestator?-1:1)});
    return [...new Set(lista_furnizori_servicii)];
  }


  load_lista_alfabetica_orase_din_judet(judet:string):string[]{
    return this.lista_servicii.filter(serviciu=>(serviciu.judet == judet)).map(serviciu=>(serviciu.localitate));
  }

  alege_serviciu(domeniu:string, nume_serviciu:string){
   this.domeniu_serviciu={domeniu:domeniu, serviciu:nume_serviciu};
  }

  setCurrentData(serviciu:Serviciu){
    this.currentDataAsObservable.next(serviciu);
    if(!serviciu.permanent){
      this.minDate = serviciu.data_start;
      this.maxDate = serviciu.data_end;
    }
    this.subtitle = 'Selectati un interval de programare';
  }

  setCurrentDataFrom(domeniu:string, nume_serviciu:string, nume_furnizor:string){
    let lista_furnizori_servicii= this.lista_servicii.filter(serviciu=>
      ((serviciu.domeniu == domeniu)&&(serviciu.nume==nume_serviciu)&&(serviciu.furnizor==nume_furnizor)&&(!serviciu.are_prestator)));
    if(lista_furnizori_servicii.length == 1){
      let serviciu = lista_furnizori_servicii[0];
      console.log(serviciu)
      this.currentDataAsObservable.next(serviciu);
      if(!serviciu.permanent){
        this.minDate = serviciu.data_start;
        this.maxDate = serviciu.data_end;
      }
      this.subtitle = 'Selectati un interval de programare';
    }


  }

  judet_changed(){
    this.load_data();
  }

  localitate_changed(){

  }

  onInfo(){
    this.dialogInfo.open(InformatiiAplicatieComponent)
  }

  onSelectedChange(selectedDate:any) {
    this.selectedDateAsObservable.next(selectedDate);
  }

  dateFilter(date:Date):boolean{
    return true;
  }

  programeaza(slot:Slot){
    const dialogRef =this.dialogInfo.open(ProgramareComponent,{data:{serviciu:this.currentData, slot:slot}});
    dialogRef.afterClosed().subscribe(result => {
      if(typeof result === 'undefined'){
        this.currentData=null;
        this.domeniu_serviciu=null;
      }
    });
    return false;
  }

  goToPage(page:any){
    switch(page){
      case 1: this.currentData = null;
              this.subtitle = 'Selectati un serviciu';
              break;

      case 2:
    }
  }

  search(){

  }


}
