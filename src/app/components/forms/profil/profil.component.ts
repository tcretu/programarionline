import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Furnizor } from '@models/furnizor';
import { Utilizator } from '@models/utilizator';
import { AutentificareService } from '@services/autentificare.service';
import { FurnizoriService } from '@services/furnizori.service';
import { UtilizatoriService } from '@services/utilizatori.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  @Input() parametru?:Utilizator;
  @Output() onclose:EventEmitter<any> = new EventEmitter();
  currentFurnizor:Furnizor|null=null;
  public user:Utilizator;
  constructor(public authService: AutentificareService,
              public utilizatori: UtilizatoriService,
              private furnizori: FurnizoriService,
              public dialogRef: MatDialogRef<ProfilComponent>,
              @Inject(MAT_DIALOG_DATA) public data:any,){
/*
    console.log(this.parametru)
    console.log(data)
    this.user=this.authService.UserData;
    if(this.parametru!=null){
      this.user=this.parametru;
    }
    */
    this.user= data.parametru;
    if(this.utilizatori.userHasRole(this.user,'furnizor')){
      this.furnizori.getAsObservableBy('email',this.user.email).snapshotChanges()
      .pipe(map(changes=>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        ))
      ).subscribe(
      documents=>{
        this.currentFurnizor = documents[0];
      }
      );
    }
    console.log(this.user)
  }

  __ngOnInit(){
  }

 __ngOnChanges(changes: SimpleChanges): void {
  //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //Add '${implements OnChanges}' to the class.
  /*
  if(this.parametru!=null){
    this.user=this.parametru;
  }
  */
  this.user= this.data.parametru;

  if(this.utilizatori.userHasRole(this.user,'furnizor')){
    this.furnizori.getAsObservableBy('email',this.user.email).snapshotChanges()
    .pipe(map(changes=>
      changes.map(c =>
        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
      ))
    ).subscribe(
    documents=>{
      this.currentFurnizor = documents[0];
    }
    );
  }
 }

  _close(){
    //this.refreshList.emit();
    this.onclose.emit();
   }

   __onInchideClick(){
    this.dialogRef.close();
  }

}
