import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AutentificareService } from '@services/autentificare.service';
import { FormGroup , FormControl,Validators,FormGroupDirective} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment as env } from '@environments/environment';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
const MODEL_NAME='utilizator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './inregistrare-utilizator.component.html',
  styleUrls: ['./inregistrare-utilizator.component.scss'],
})
export class InregistrareUtilizatorComponent implements OnInit {
  public registerForm:any;
  public paswordVisible=false;
  public isModal=false;
  public title:string;
  public appName=env.app.name;
  constructor(public authService: AutentificareService,
    private router:Router,
    private route:ActivatedRoute) {
    this.title= 'Inregistrare '+ MODEL_NAME;
  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.isModal=(params['modal']) ;
    });
    this.createForm();
  }


  public togglePassword(){
    this.paswordVisible = !this.paswordVisible;
  }

  createForm(){
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.registerForm = new FormGroup(
      {
      'email': new FormControl(null,[Validators.required, Validators.pattern(emailregex)]),
      'password': new FormControl(null, [Validators.required, this.checkPassword]),
     }
    )
  }

  emaiErrors() {
    return this.registerForm.get('email').hasError('required') ? 'Camp obligatoriu' :
      this.registerForm.get('email').hasError('pattern') ? 'Adresa de e-mail invalida' :''
  }

  checkPassword(control:any) {
    let enteredPassword = control.value
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;
    return (!passwordCheck.test(enteredPassword) && enteredPassword) ? { 'requirements': true } : null;
  }
  getErrorPassword() {
    return this.registerForm.get('password').hasError('required') ? 'Camp obligatoriu (Parola trebuie sa contina cel putin 6 caractere, o litera mare si o cifra)' :
      this.registerForm.get('password').hasError('requirements') ? 'Parola trebuie sa contina cel putin 6 caractere, o litera mare si o cifra' : '';
  }
  checkValidation(input: string){
    const validation = this.registerForm.get(input).invalid && (this.registerForm.get(input).dirty || this.registerForm.get(input).touched)
    return validation;
  }


  public onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {
    const email = formData.value.email;
    const password = formData.value.password;
    this.authService.Register(email, password);
    formDirective.resetForm();
    this.registerForm.reset();
}
goToLogin(){
  this.router.navigate(['/autentificare']);
}

closeIfModal(){
  if(this.isModal){
    this.router.navigate(['../../'],{relativeTo: this.route});
  }
}

}
