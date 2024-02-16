export class Serviciu {
  nume:string;
  furnizor:string;
  domeniu:string;
  dezactivat:boolean;
  judet:string;
  localitate:string;
  strada:string;
  nr:string;
  bl:string;
  sc:string;
  ap:string;
  are_prestator:boolean;
  prestator:string;
  prestatie:string;
  zile_libere:string[];
  permanent:boolean;
  data_start:any;
  data_end:any;
  durata_minute:number;
  anulare_minute:number;
  orar:any[];

  constructor(){
    this.nume='';
    this.furnizor='';
    this.domeniu='';
    this.dezactivat=false;
    this.judet='';
    this.localitate='';
    this.strada='';
    this.nr='';
    this.bl='';
    this.sc='';
    this.ap='';
    this.are_prestator=false;
    this.prestator='';
    this.prestatie='';
    this.zile_libere=[];
    this.permanent=true;
    this.data_start= new Date();
    this.data_end= new Date();
    this.durata_minute=5;
    this.anulare_minute=0;
    this.orar=[];
    for(let i=0;i<7;i++){
      this.orar.push({start:'10:00',end:'12:00', inactiv:false});
    }
  }
}
