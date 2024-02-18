import { Injectable,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { FacebookAuthProvider } from '@angular/fire/auth';
import { Utilizator } from '@models/utilizator';
import { AngularFirestore,  AngularFirestoreCollection,  AngularFirestoreDocument, DocumentChangeAction
       } from '@angular/fire/compat/firestore';
import { UtilizatoriService } from './utilizatori.service';
import { environment as env } from '@environments/environment';

const anonymous:Utilizator={
  uid:'',
  email:'anonymous',
  displayName: '',
  photoURL: '',
  emailVerified: false,
  roles:[]
};
@Injectable({
  providedIn: 'root'
})
export class AutentificareService {

  public UserData : Utilizator=anonymous;
  Users: Utilizator[]=[];
  constructor(  private afs: AngularFirestore,
                private auth: AngularFireAuth,
                private router : Router,
                private ngZone: NgZone,
                private utilizatori:UtilizatoriService){
    this.auth.authState.subscribe(
      (user) => {
        if (user) {
          this.utilizatori.getAsObservableByUid(user.uid).valueChanges().subscribe(
            (userArray:any)=>{
              if(userArray.length){
                this.UserData={
                  uid: userArray[0].uid,
                  email: userArray[0].email,
                  displayName: userArray[0].displayName,
                  photoURL: userArray[0].photoURL,
                  emailVerified: userArray[0].emailVerified,
                  roles:userArray[0].roles
                };
              }
            }
          );
        } else {
          this.UserData =anonymous;
        }
      }
    );
   }


    hasRole(role:string){
      return this.UserData && this.UserData['roles'] && this.UserData['roles'].includes(role);
    }

    get isAdmin(){
      // seteaza administratorul aplicatiei cu rol de admin
      return (this.isLoggedIn && this.hasRole('admin')) || (env.app.author.email === this.UserData.email);
    }

    get isFurnizor(){
      return this.isLoggedIn && this.hasRole('furnizor');
    }

    //Check wither User Is looged in or not
    get isLoggedIn(): boolean {
     // console.log(this.UserData)
      return  (typeof this.UserData != 'undefined')&& (!(['', 'anonymous'].includes(this.UserData.email)));
    }

    //Register Method
    Register(email : string, password : string) {
      return this.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
       this.setCurrentUser(result.user);
       this.utilizatori.create(result.user);
        this.ngZone.run(() => {
          result.user?.sendEmailVerification().then(
            ()=>{
                this.router.navigate(['/verify-email-address']);
                }
          );
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
    }

    //Login Method
    Login(email : string, password : string){
      return this.auth.signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
    }
    //Logout
    Logout() {
      this.auth.signOut().then(()=>{
        this.UserData=anonymous;
        localStorage.setItem('user','');
        this.router.navigate(['/autentificare'])
      });
    }


    //Login with Google
    GoogleAuth() {
      return this.loginWithPopup(new GoogleAuthProvider());
    }


    //Login with Facebook
    FacebookAuth() {
      return this.loginWithPopup(new FacebookAuthProvider());
    }


    //Pop Up Provider
    loginWithPopup(provider :any) {
      return this.auth.signInWithPopup(provider).then(() => {
        this.router.navigate(['/dashboard']);
      });
    }

    //Send Password Reset Email
    async sendPasswordResetEmails(email : string){
       this.auth.sendPasswordResetEmail(email)
       .then(() => {
          window.alert('A fost trimis un e-mail de resetare parola la adresa '+email+'. Verificati Inbox-ul.');
       })
       .catch((error) => {
        window.alert(error.message);
      });
    }

    setCurrentUser(user: any) {
      this.UserData ={
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        roles:(typeof user.roles == 'undefined'? []:user.roles)
      };
    }

    deserialize(key:string, value:any) {
      let maskedValue = value;
      if  ((key === 'createdDate')) {
          maskedValue = value.seconds * 1000;
      }
      return maskedValue;
    }

}
