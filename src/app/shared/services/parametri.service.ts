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

  __getAsObservableById(id:string):AngularFirestoreDocument<Parametru> {
    return this.afs.doc(`${COLLECTION_NAME}/${id}`);
  }

  getAsObservableByTip(tip:string):any{
    return this.getAsObservableByKey(tip);
  }

  __getAsObservableByTip(tip:string):AngularFirestoreCollection<Parametru> {
    return this.afs.collection(COLLECTION_NAME, ref=>ref.where('tip','==',tip));
  }

  __getAllAsObservable():AngularFirestoreCollection<Parametru> {
   return  this.afs.collection(COLLECTION_NAME);
  }

  __create(data:any){
    const allRef$:AngularFirestoreCollection<Parametru> = this.getAllAsObservable();
    return allRef$.add({...data});
  }

  __update(id?: string, data?: any): Promise<void> {
    const allRef$:AngularFirestoreCollection<Parametru> = this.getAllAsObservable();
    return allRef$.doc(id).update(data);
  }

  __delete(id: string): Promise<void> {
    const allRef$:AngularFirestoreCollection<Parametru> = this.getAllAsObservable();
    return allRef$.doc(id).delete();
  }

}
