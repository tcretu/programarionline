import { Parametru } from '@models/parametru';
import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { FirebaseCrudService } from './firebase-crud.service';

const COLLECTION_NAME='parametri';

@Injectable({
  providedIn: 'root'
})
export class ParametriService extends FirebaseCrudService{

  constructor(protected override afs:AngularFirestore) {
    super(afs);
    this.collection= COLLECTION_NAME;
    this.key = 'tip';
  }

  getAsObservableByTip(tip:string):any{
    return this.getAsObservableByKey(tip);
  }

}
