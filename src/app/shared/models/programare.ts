import { Timestamp } from "firebase/firestore";
import { Solicitant } from "./solicitant";
import { Slot } from "./slot";

export class Programare {
  slot:Slot;
  solicitant:Solicitant;
  data:Date;
  libera:boolean;
  confirmata:boolean;
  anulata:boolean;
  constructor(){
    this.slot= new Slot();
    this.solicitant=new Solicitant();
    this.data= new Date();
    this.libera=false;
    this.anulata=false;
    this.confirmata=false;
  }
}
