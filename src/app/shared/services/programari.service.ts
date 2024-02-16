import { Injectable } from '@angular/core';
import { ServiciiService } from './servicii.service';
import { map } from 'rxjs';
import { Serviciu } from '@models/serviciu';
import { Programare } from '@models/programare';
import { FirebaseCrudService } from './firebase-crud.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Parametru } from '@models/parametru';
import { ParametriService } from './parametri.service';
import { Slot } from '@models/slot';
const COLLECTION_NAME='programari';
@Injectable({
  providedIn: 'root'
})
export class ProgramariService extends FirebaseCrudService {
  documenteServicii:Serviciu[]=[];
  documenteProgramari:Programare[]=[];
  documenteParametri:Parametru[]=[];
  constructor(protected override afs:AngularFirestore,
              protected servicii:ServiciiService,
              protected parametri:ParametriService) {
    super(afs);
    this.collection= COLLECTION_NAME;
    this.key = 'nume';
    this.servicii.getAllAsObservable().snapshotChanges().pipe(
      map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )),
      ).subscribe(documents=>{
        documents=documents.map(document=>
          ({...document,
            data_start:(new Date(document.data_start.seconds*1000)),
            data_end:(new Date(document.data_end.seconds*1000))}));
          this.documenteServicii=documents;
      });

      this.parametri.getAllAsObservable().snapshotChanges().pipe(
        map(changes=>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )),
        ).subscribe(documents=>{
            this.documenteParametri=documents;
        });

      this.getAllAsObservable().snapshotChanges().pipe(
        map(changes=>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )),
        ).subscribe(documents=>{
          documents=documents.map((document:Programare)=>
          {
            let slot=document.slot;
            let any_day:any=slot.zi;
            slot.zi = new Date(any_day.seconds*1000);
            let timestamp:any=document.data;
            let new_data =new Date(timestamp.seconds * 1000);
           return  {...document, slot:slot, data:new_data};
          }
          );
          this.documenteProgramari=documents;
          });
  };


  zi_libera(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):boolean{
    let servicii_cu_nume = this.documenteServicii.filter(data=>
        ((data.nume==nume_serviciu)&&(data.furnizor==nume_furnizor)&&(data.prestator==nume_prestator)));
    if(servicii_cu_nume.length !=1){
      // nu exista un singur serviciu cu numele dat
      return false;
    }
    let parametri_zi_libera=this.documenteParametri.filter(parametru=>(parametru.tip=='zi libera'));
    let zile_libere=servicii_cu_nume[0].zile_libere;
    let found=false;
    zile_libere.forEach((zi_libera)=>{
          let parametru_zi_libera=parametri_zi_libera.find(parametru=>(parametru.nume==zi_libera));
          if(typeof parametru_zi_libera !== 'undefined'){
            let descriere_zi_libera=parametru_zi_libera.descriere;
            let __date=zi;
            let strToEval='__date= new Date("'+zi.toString()+'");'+descriere_zi_libera;
            if ((eval(strToEval) == true) && (!found)){
              found=true;
            }
          }
    });
    return found;
  }

  zi_fara_program(nume_serviciu:string, nume_furnizor:string,nume_prestator:string, zi:Date):boolean{
    let servicii_cu_nume = this.documenteServicii.filter(data=>
        ((data.nume==nume_serviciu)&&(data.furnizor==nume_furnizor)&&(data.prestator==nume_prestator)));
    if(servicii_cu_nume.length !=1){
      // nu exista un singur serviciu cu numele dat
      return false;
    }
    let serviciu:Serviciu=servicii_cu_nume[0];
    return serviciu.orar[zi.getDay()].inactiv;
  }

  zi_fara_locuri_libere(nume_serviciu:string, nume_furnizor:string,nume_prestator:string, zi:Date):boolean{
    return (this.sloturi_libere(nume_serviciu,nume_furnizor,nume_prestator,zi).length==0);
  }

  zi_cu_toate_locurile_ocupate(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):boolean{
    return (this.sloturi_libere(nume_serviciu,nume_furnizor,nume_prestator, zi).length==0) &&
          (!this.zi_fara_program(nume_serviciu,nume_furnizor,nume_prestator, zi)) &&
          (this.serviciu_disponibil_in_ziua(nume_serviciu,nume_furnizor, nume_prestator, zi)) &&
          (!this.zi_libera(nume_serviciu,nume_furnizor, nume_prestator,zi));
  }

  zi_cu_locuri_libere(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):boolean{
    return (this.sloturi_libere(nume_serviciu,nume_furnizor, nume_prestator, zi).length > 0) &&
            (this.serviciu_disponibil_in_ziua(nume_serviciu, nume_furnizor, nume_prestator, zi));
  }

  serviciu_disponibil_in_ziua(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):boolean{
    let servicii_cu_nume = this.documenteServicii.filter(data=>
      ((data.nume==nume_serviciu)&&(data.furnizor==nume_furnizor) && (data.prestator == nume_prestator)));
  if(servicii_cu_nume.length !=1){
    // nu exista un singur serviciu cu numele dat
    return false;
  }
  let serviciu:Serviciu=servicii_cu_nume[0];
  if(serviciu.permanent){
    //    console.log('Serviciu permanent')
    return true;
  }else{
    return ((serviciu.data_start <= zi) && (zi <= serviciu.data_end));
  }
  }

  sloturi(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):any{
    if(this.zi_libera(nume_serviciu, nume_furnizor, nume_prestator, zi)){
      //console.log('Zi libera')
      return [];
    }
    let servicii_cu_nume = this.documenteServicii.filter(data=>
      ((data.nume==nume_serviciu)&&(data.furnizor==nume_furnizor)&&((data.are_prestator && (data.prestator==nume_prestator))||(!data.are_prestator))));
    if(servicii_cu_nume.length !=1){
    // nu exista un singur serviciu cu numele dat
      console.log('Serviciu nu e unic')
      return [];
    }
    let serviciu:Serviciu=servicii_cu_nume[0];
    let durata_minute=serviciu.durata_minute;
    let ziNr=zi.getDay();
    let orarPeZi=serviciu.orar[ziNr];
    let nuAreProgram = serviciu.orar[ziNr].inactiv;
    if(nuAreProgram){
      //console.log('Nu are program')
      return [];
    }
    let _start=serviciu.orar[ziNr].start;
    let ora_start=_start.split(':')[0];
    let min_start=_start.split(':')[1];
    let timp_start = parseInt(ora_start)*60 + parseInt(min_start);

    let _end=serviciu.orar[ziNr].end;
    let ora_end=_end.split(':')[0];
    let min_end=_end.split(':')[1];
    let timp_end = parseInt(ora_end)*60 + parseInt(min_end);

    let result=[];
    for(let i= timp_start;i<timp_end;i+=durata_minute){
      let slot_curent=i;
      let ora_slot_curent=Math.trunc(slot_curent / 60);
      let str_ora_slot_curent =((ora_slot_curent<10)?'0':'')+ora_slot_curent;
      let minut_slot_curent = slot_curent % 60;
      let str_minut_slot_curent = ((minut_slot_curent<10)?'0':'')+minut_slot_curent;
      let slot:Slot=new Slot();
      slot.serviciu = nume_serviciu;
      slot.furnizor = nume_furnizor;
      slot.zi = zi;
      slot.prestator = nume_prestator;
      slot.start= (str_ora_slot_curent + ':' + str_minut_slot_curent);
      slot.durata_minute= durata_minute;
      result.push(slot);
    }
    return result;
  }

  prima_zi_cu_sloturi_ocupate(nume_serviciu:string, nume_furnizor:string,nume_prestator:string):any{
    let result=this.documenteProgramari.filter((programare:Programare)=>
              ((programare.slot.serviciu==nume_serviciu) &&
              (programare.slot.furnizor == nume_furnizor) &&
              (programare.slot.prestator == nume_prestator))
              ).map((programare:Programare)=>(programare.slot.zi));

    let minValue = new Date(3000,0,0);
    let maxValue = new Date(0,0,0);
    if(result.length==0){
      return new Date();
    }
    for (let item of result) {
        // Find minimum value
        if (item.getTime() < minValue.getTime())
          minValue = item;

        // Find maximum value
        if (item.getTime() > maxValue.getTime())
        maxValue = item;
    }
    return minValue;
  }

  ultima_zi_cu_sloturi_ocupate(nume_serviciu:string, nume_furnizor:string,nume_prestator:string):any{
    let result=this.documenteProgramari.filter((programare:Programare)=>
              ((programare.slot.serviciu==nume_serviciu) &&
              (programare.slot.furnizor == nume_furnizor) &&
              (programare.slot.prestator == nume_prestator))
              ).map((programare:Programare)=>(programare.slot.zi));
    let minValue = new Date(3000,0,0);
    let maxValue = new Date(0,0,0);
    if(result.length==0){
      return new Date();
    }
    for (let item of result) {
        // Find minimum value
        if (item.getTime() < minValue.getTime())
          minValue = item;

        // Find maximum value
        if (item.getTime() > maxValue.getTime())
        maxValue = item;
    }
    return maxValue;
  }


  sloturi_ocupate(nume_serviciu:string, nume_furnizor:string,nume_prestator:string, zi:Date):any{
    let result=this.documenteProgramari.filter((programare:Programare)=>
              ((programare.slot.serviciu==nume_serviciu) &&
              (programare.slot.furnizor == nume_furnizor) &&
              (programare.slot.prestator == nume_prestator) &&
              (programare.slot.zi.getDate()==zi.getDate())&&
              (programare.slot.zi.getMonth()==zi.getMonth())&&
              (programare.slot.zi.getFullYear()==zi.getFullYear())
              )).map((programare:Programare)=>({...programare.slot}));
    return result;
  }

  zi_cu_sloturi_ocupate(nume_serviciu:string, nume_furnizor:string,nume_prestator:string, zi:Date):any{
  return this.sloturi_ocupate(nume_serviciu, nume_furnizor,nume_prestator, zi).length > 0;
  }

  slot_ocupat(slot:Slot):boolean{
    let sloturi_ocupate_in_zi=this.sloturi_ocupate(slot.serviciu, slot.furnizor, slot.prestator, slot.zi);
    if(sloturi_ocupate_in_zi.length==0){
      return false;
    }
    return sloturi_ocupate_in_zi.filter((_slot:Slot)=>(_slot.start==slot.start)).length > 0;
  }

  programare(slot:Slot):Programare{
    let result=this.documenteProgramari.filter((programare:Programare)=>
    ((programare.slot.serviciu==slot.serviciu) &&
    (programare.slot.furnizor == slot.furnizor) &&
    (programare.slot.prestator == slot.prestator) &&
    (programare.slot.zi.getDate()==slot.zi.getDate())&&
    (programare.slot.zi.getMonth()==slot.zi.getMonth())&&
    (programare.slot.zi.getFullYear()==slot.zi.getFullYear())&&
    (programare.slot.start == slot.start)
    ));
    if(result.length==0){
      return new Programare();
    }
    return result[0];
  }

  slot_trecut(slot:Slot):boolean{
    let today:Date = new Date();
    let slotZi=slot.zi;
    slotZi.setHours(0,0,0,0);
    if(slot.start.indexOf(':')>0){
      let hours=parseInt(slot.start.split(':')[0]);
      let minutes=parseInt(slot.start.split(':')[1]);
      slotZi.setHours(hours);
      slotZi.setMinutes(minutes);
      return   slotZi.getTime() < today.getTime();
    }
    return false;
  }

  sloturi_libere(nume_serviciu:string, nume_furnizor:string, nume_prestator:string, zi:Date):any{
    let sloturi:Slot[]=this.sloturi(nume_serviciu, nume_furnizor, nume_prestator, zi);
    let sloturi_ocupate:Slot[]=this.sloturi_ocupate(nume_serviciu, nume_furnizor, nume_prestator,  zi);
    let result=sloturi.filter((slot:Slot)=> {
      return (sloturi_ocupate.filter((slot_ocupat:Slot)=>{
          return (this.slots_are_equal(slot_ocupat,slot))
       }
        ).length == 0);
      });
    return result;
  }

  slots_are_equal(thisSlot:Slot, slot:Slot):boolean{
    return ((slot.serviciu == thisSlot.serviciu) &&
            (slot.furnizor == thisSlot.furnizor) &&
            (slot.prestator == thisSlot.prestator) &&
            (slot.start == thisSlot.start) &&
            (slot.zi.getDate() == thisSlot.zi.getDate()) &&
            (slot.zi.getMonth()== thisSlot.zi.getMonth()) &&
            (slot.zi.getFullYear() == thisSlot.zi.getFullYear()));
  }

}
