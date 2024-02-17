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

}
