import { Injectable } from '@angular/core';
import { Furnizor } from '@models/furnizor';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { FirebaseCrudService } from './firebase-crud.service';

const COLLECTION_NAME='furnizori';

@Injectable({
  providedIn: 'root'
})
export class FurnizoriService extends FirebaseCrudService {

  constructor(protected override afs:AngularFirestore) {
    super(afs);
    this.collection=COLLECTION_NAME;
    this.key = 'name';
  }

  __getAsObservable(id:string):AngularFirestoreDocument<Furnizor> {
    return this.afs.doc(`${COLLECTION_NAME}/${id}`);
  }

  __getAllAsObservable():AngularFirestoreCollection<Furnizor> {
   return  this.afs.collection(COLLECTION_NAME);
  }

  __create(data:any){
    const allRef$:AngularFirestoreCollection<Furnizor> = this.getAllAsObservable();
    return allRef$.add({...data});
  }

  __update(id?: string, data?: any): Promise<void> {
    const allRef$:AngularFirestoreCollection<Furnizor> = this.getAllAsObservable();
    return allRef$.doc(id).update(data);
  }

  __delete(id: string): Promise<void> {
    const allRef$:AngularFirestoreCollection<Furnizor> = this.getAllAsObservable();
    return allRef$.doc(id).delete();
  }

}
