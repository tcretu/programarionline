import { Injectable } from '@angular/core';
import { AngularFirestore , AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseCrudService {
  protected collection='';
  public key='id';
  public _filter={
    field:'',
    value:''
  };
  constructor(protected afs:AngularFirestore) { }

  __filter(_filter:any){
    this._filter=_filter;
  }

  reset(){
    this._filter={field:'',value:''};
  }


  getAsObservable(id:string):AngularFirestoreDocument<any> {
    return this.getAsObservableById(id);
  }

  getAsObservableById(id:string):AngularFirestoreDocument<any> {
    return this.afs.doc(this.collection+'/'+id);
  }

  getAsObservableByKey(key_value:string):AngularFirestoreCollection<any> {
    return this.getAsObservableBy(this.key, key_value);
  }

  getAsObservableBy(key_name:string, key_value:string):AngularFirestoreCollection<any> {
    return this.afs.collection(this.collection, ref=>ref.where(key_name,'==',key_value));
  }

  getAllAsObservable():AngularFirestoreCollection<any> {
    if(this._filter.field == ''){
      return  this.afs.collection(this.collection);
    }else{
      return  this.afs.collection(this.collection,ref=>ref.where(this._filter.field, '==', this._filter.value));
    }
  }

  getAllUnfilteredAsObservable():AngularFirestoreCollection<any> {
      return  this.afs.collection(this.collection);
  }


  create(data:any){
    const allRef$:AngularFirestoreCollection<any> = this.getAllUnfilteredAsObservable();
    return allRef$.add({...data});
  }

  update(id?: string, data?: any): Promise<void> {
    const allRef$:AngularFirestoreCollection<any> = this.getAllUnfilteredAsObservable();
    return allRef$.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    const allRef$:AngularFirestoreCollection<any> = this.getAllUnfilteredAsObservable();
    return allRef$.doc(id).delete();
  }

}
