import { map } from 'rxjs';
import { Utilizator } from '@models/utilizator';
import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { FirebaseCrudService } from './firebase-crud.service';
import { environment as env } from '@environments/environment';

const COLLECTION_NAME = 'utilizatori';

@Injectable({
  providedIn: 'root'
})

export class UtilizatoriService extends FirebaseCrudService{
  constructor(protected override afs:AngularFirestore) {
    super(afs);
    this.collection = COLLECTION_NAME;
    this.key = 'email';
   }

  userHasRole(user:Utilizator, role:string){
    return user && user['roles'] && user['roles'].includes(role);
  }

  userIsAdmin(user:Utilizator){
    return this.userHasRole(user,'admin') || (env.app.author.email === user.email);
  }

  userIsFurnizor(user:Utilizator){
    return this.userHasRole(user,'furnizor');
  }

  userAddRole(user:any, role:string){
    if(!user.roles.includes(role)){
      user.roles.push(role);
      this.update(user.id, user);
    }
  }

  userRemoveRole(user:any, role:string){
    if(user.roles.includes(role)){
      user.roles=user.roles.filter((data:any)=>(data !=role));
      this.update(user.id,user);
    }
  }

  getAsObservableByUid(uid:string):AngularFirestoreCollection<Utilizator> {
    return this.afs.collection(COLLECTION_NAME, ref=>ref.where('uid','==',uid));
  }

  override create(data:any){
    const allRef$:AngularFirestoreCollection<Utilizator> = this.getAllAsObservable();
    let utilizator: Utilizator = {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      emailVerified: false,
      roles:[]
    };
    return allRef$.add({...utilizator});
  }





}
