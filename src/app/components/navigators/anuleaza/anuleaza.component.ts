import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Programare } from '@models/programare';
import { ProgramariService } from '@services/programari.service';
import { Observable, map } from 'rxjs';
import { environment as env} from '@environments/environment';
@Component({
  selector: 'app-anuleaza',
  templateUrl: './anuleaza.component.html',
  styleUrl: './anuleaza.component.scss'
})
export class AnuleazaComponent implements OnInit{
  id:string='';
  public success=false;
  public message:string='';
  public programare:Programare|null=null;
  constructor(private route: ActivatedRoute, private programari: ProgramariService) {}

  ngOnInit() {
    // Capture the session ID if available
    let programari=this.programari;
    this.route.paramMap.subscribe((params: ParamMap) => {

      if(params){
        this.id = params.get('id')!;
        if(this.id){
          this.programari.getAsObservableById(this.id).ref.get().then((doc)=> {
            if (doc.exists) {
              let docNew:any = {...doc.data()};
              this.programare=docNew;
              if(docNew.anulata){
                  this.message='Programarea a fost deja anulata!'
              }else{
                if(!docNew.confirmata){
                  this.message='Atentie! Nu puteti anula o programare ne-confirmata!'
                }else{
                  //verifica daca mai e timp ptr a putea anula
                  let data_programarii = new Date(docNew.slot.zi.seconds*1000);
                  console.log(data_programarii)
                  let ora_programare = parseInt(docNew.slot.start.split(':')[0]);
                  let minut_programare=parseInt(docNew.slot.start.split(':')[1]);
                  data_programarii.setHours(ora_programare,minut_programare,0,0);
                  let now = new Date();
                  if(data_programarii.getTime() - docNew.slot.anulareMinute*60*1000> now.getTime()){
                    // nu mai e permisa anularea
                    this.message='Programarea nu mai poate fi anulata deoarece a trecut termenul limita!'
                    return;
                  }
                  programari.delete(doc.id).then(
                    (programare)=>{//success
                      this.message='Programarea a fost anulata cu succes!';
                      this.success=true;
                    },
                    (error)=>{
                      console.log(error);
                      this.message='A aaparut o eroare la anulare!';
                    }
                  );
                }
              }
            } else {
              console.log("Nu a fost gasita programarea in sistem!");
              this.message='Programarea nu a fost identificata in sistem!'
            }
          }).catch((error) =>{
            console.log("There was an error getting your document:", error);
            this.message='A aparut o eroare la cautarea programarii!'
          });
        }
      }
    });
  }
}
