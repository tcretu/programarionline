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
import { FurnizoriService } from '@services/furnizori.service';
import { AutentificareService } from '@services/autentificare.service';
import { Programare } from '@models/programare';
const COLLECTION_NAME='programari';

@Component({
  selector: 'app-programari',
  templateUrl: './programari.component.html',
  styleUrl: './programari.component.scss'
})
export class ProgramariComponent {
  title:string= COLLECTION_NAME.charAt(0).toUpperCase()+COLLECTION_NAME.substring(1).toLowerCase();
  public lista_alfabetica_domenii_servicii:string[]=[];
  public lista_alfabetica_judete_servicii:string[]=[];
  public lista_alfabetica_orase_din_judet:string[]=[];
  public lista_servicii:Serviciu[]=[];
  public currentData:any=null;
  currentDataAsObservable: BehaviorSubject<any>;
  selectedDateAsObservable:BehaviorSubject<any>;
  public serviciu:any;
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
  furnizor:any=null;
  public dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if(!this.currentData){
      return '';
    }
    // Only highligh dates inside the month view.
    if (view === 'month') {
      if(this.programari.zi_cu_sloturi_ocupate(this.currentData.nume, this.currentData.furnizor, this.currentData.prestator, cellDate)){
        return 'zi-cu-locuri-ocupate';
      }
        return '';
    }

    return '';
  };
  constructor(protected programari:ProgramariService,
    protected servicii:ServiciiService,
    private autentificare:AutentificareService,
    private furnizori:FurnizoriService,
    public dialogInfo:MatDialog){
      if(autentificare.isFurnizor && !autentificare.isAdmin){
        furnizori.getAsObservableBy('email', autentificare.UserData.email).snapshotChanges().pipe(
          map(changes=>
            changes.map(c =>
              ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )),
          ).subscribe(documents=>{
            this.furnizor=documents[0];
            this.load_servicii();
          });
      }
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
              let result =
              this.programari.zi_cu_locuri_libere(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator,  date) &&
              this.programari.serviciu_disponibil_in_ziua(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator,  date);
              return result;
            }
            this.minDate = this.programari.prima_zi_cu_sloturi_ocupate(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator);
            this.maxDate = this.programari.ultima_zi_cu_sloturi_ocupate(this.currentData.nume,this.currentData.furnizor,this.currentData.prestator);
          }
      });
      this.title="Programari";
      this.subtitle = 'Selectati un serviciu';
      this.load_servicii();
  }

  load_servicii(){
    this.servicii.getAllAsObservable().snapshotChanges().pipe(
      map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      )),
      ).subscribe(documents=>{
        if(this.furnizor){
          // nu este administrator, filtrez lista doar cu serviciile lui
          documents=documents.filter((serviciu)=>(serviciu.furnizor == this.furnizor.nume));
        }
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

onSelectedChange(selectedDate:any) {
this.selectedDateAsObservable.next(selectedDate);
}

dateFilter(date:Date):boolean{
return true;
}

detalii_programare(programare:Programare){
const dialogRef =this.dialogInfo.open(ProgramareComponent,{data:{serviciu:this.currentData, slot:programare.slot, solicitant:programare.solicitant, mode:'read'}});
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
print(){
  const printContent = document.getElementById("Programari");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    if(WindowPrt && printContent){
      let styles=document.head.innerHTML;
      let printScript='<script>window.print();</script>';
      WindowPrt.document.write(styles)
      WindowPrt.document.write('<body class="mat-typography">'+printContent.innerHTML+printScript+'</body>');
      WindowPrt.focus();
      //WindowPrt.print();
      //WindowPrt.close();
    }
}

}
