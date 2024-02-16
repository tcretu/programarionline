import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment as env } from '@environments/environment';

@Component({
  selector: 'app-informatii-aplicatie',
  templateUrl: './informatii-aplicatie.component.html',
  styleUrl: './informatii-aplicatie.component.scss'
})
export class InformatiiAplicatieComponent {
public app=env.app;
constructor(public dialogRef: MatDialogRef<InformatiiAplicatieComponent>){}

onInchideClick(){
  this.dialogRef.close();
}

}
