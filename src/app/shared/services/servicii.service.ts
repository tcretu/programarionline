import { Serviciu } from '@models/serviciu';
import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { FirebaseCrudService } from './firebase-crud.service';

const COLLECTION_NAME='servicii';
@Injectable({
  providedIn: 'root'
})
export class ServiciiService extends FirebaseCrudService{

  constructor(protected override afs:AngularFirestore) {
    super(afs);
    this.collection= COLLECTION_NAME;
    this.key = 'nume';
  }

  getAsObservableByDomeniu(domeniu:string):any{
    return this.getAsObservableBy('domeniu',domeniu);
  }
}
