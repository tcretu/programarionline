import { Component, OnInit } from '@angular/core';
import { AutentificareService } from '@services/autentificare.service';
import { FormGroup , FormControl,Validators,FormGroupDirective} from '@angular/forms';
import { Router } from '@angular/router';
import { environment as env } from '@environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './autentificare.component.html',
  styleUrl: './autentificare.component.scss'
})
export class AutentificareComponent implements OnInit {
  public registerForm:any;
  public paswordVisible=false;
  public appName=env.app.name;
  constructor(public authService: AutentificareService, public router:Router) { }

  ngOnInit() {
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
    return this.registerForm.get('password').hasError('required') ? 'Camp obligatoriu' :
      this.registerForm.get('password').hasError('requirements') ? 'Parola neadecvata' : '';
  }
  checkValidation(input: string){
    const validation = this.registerForm.get(input).invalid && (this.registerForm.get(input).dirty || this.registerForm.get(input).touched)
    return validation;
  }


  public onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {

    const email = formData.value.email;
    const password = formData.value.password;
    this.authService.Login(email, password);
    formDirective.resetForm();
    this.registerForm.reset();
}
goToRegister(){
  this.router.navigate(['/inregistrare-utilizator']);
}


}
