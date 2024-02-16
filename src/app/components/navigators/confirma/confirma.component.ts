import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Programare } from '@models/programare';
import { ProgramariService } from '@services/programari.service';
import { Observable, map } from 'rxjs';
import { environment as env} from '@environments/environment';

@Component({
  selector: 'app-confirma',
  templateUrl: './confirma.component.html',
  styleUrl: './confirma.component.scss'
})
export class ConfirmaComponent  implements OnInit{
  id:string='';
  public success=false;
  public message:string='';
  public url_anulare='';
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
              if(docNew.confirmata){
                  this.message='Programarea a fost deja confirmata!'
                  this.url_anulare = location.origin+env.app.cancellation_path+this.id;
              }else{
                if(docNew.anulata){
                  this.message='Atentie! Nu puteti confirma o programare anulata!'
                }else{
                  docNew.confirmata=true;
                  programari.update(doc.id,docNew).then(
                    (programare)=>{//success
                      this.message='Programarea a fost confirmata cu succes!';
                      this.success=true;
                      this.url_anulare = location.origin+env.app.cancellation_path+this.id;
                    },
                    (error)=>{
                      console.log(error);
                      this.message='A aaparut o eroare la confirmare!';
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
