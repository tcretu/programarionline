export class Slot{
  serviciu:string;
  furnizor:string;
  prestator:string;
  zi:Date;
  start:string;
  durata_minute:number;
  anulare_minute:number;

  constructor(){
    this.serviciu='';
    this.furnizor='';
    this.prestator = '';
    this.zi= new Date();
    this.start='';
    this.durata_minute=0;
    this.anulare_minute=0;
  }

}
