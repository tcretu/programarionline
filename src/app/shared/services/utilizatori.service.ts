import { map } from 'rxjs';
import { Utilizator } from '@models/utilizator';
import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { FirebaseCrudService } from './firebase-crud.service';

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
    return this.userHasRole(user,'admin');
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
  /*
  async __setUserData(user: any) {
    try{
    const userRef=this.getUserDataAsObservable(user);
    let userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      roles:user.roles
    };
    userRef.set(userData, {merge: true});
  }catch(e){
  }
    return;
  }


  async __addUser(user: any) {
    try{
    const userRef:AngularFirestoreDocument<any> = this.afs.doc(COLLECTION_NAME+`/${user.uid}`);
    let userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: false,
      roles:[]
    };
    userRef.set({...userData});
    console.log('User add')
  }catch(e){
    console.log(e);
  }
    return;
  }
  */
 __getUserDataAsObservable(user: any) {
    return this.afs.doc(COLLECTION_NAME+`/${user.uid}`);
  }

  getAsObservableByUid(uid:string):AngularFirestoreCollection<Utilizator> {
    return this.afs.collection(COLLECTION_NAME, ref=>ref.where('uid','==',uid));
  }

  __getAllAsObservable():AngularFirestoreCollection<Utilizator>  {
   return  this.afs.collection(COLLECTION_NAME);
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

  __update(id?: string, data?: any): Promise<void> {
    const allRef$:AngularFirestoreCollection<Utilizator> = this.getAllAsObservable();
    return allRef$.doc(id).update(data);
  }

  __delete(id: string): Promise<void> {
    const allRef$:AngularFirestoreCollection<Utilizator> = this.getAllAsObservable();
    return allRef$.doc(id).delete();
  }

  ___deleteByUid(uid: string) {
    const allRef$:AngularFirestoreCollection<Utilizator> = this.getAsObservableByUid(uid);
    return allRef$.snapshotChanges().pipe(
      map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          return { id };
      }))).subscribe(
        documents=>{
          documents.forEach(document=>this.getAllAsObservable().doc<Utilizator>(document.id).delete());
        }
      );
  }


}
