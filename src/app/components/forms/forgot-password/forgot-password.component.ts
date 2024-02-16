import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutentificareService } from '@services/autentificare.service';
import { environment as env } from '@environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public registerForm:any;
  public appName=env.app.name;
  constructor(public authService: AutentificareService,public router:Router) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.registerForm = new FormGroup(
      {
      'email': new FormControl(null,[Validators.required, Validators.pattern(emailregex)])
     }
    )
  }

  emaiErrors() {
    return this.registerForm.get('email').hasError('required') ? 'Camp obligatoriu' :
      this.registerForm.get('email').hasError('pattern') ? 'Adresa de e-mail invalida' :''
  }

   checkValidation(input: string){
    const validation = this.registerForm.get(input).invalid && (this.registerForm.get(input).dirty || this.registerForm.get(input).touched)
    return validation;
  }


  public onSubmit(formData: FormGroup, formDirective: FormGroupDirective): void {

    const email = formData.value.email;
    this.authService.sendPasswordResetEmails(email)
    formDirective.resetForm();
    this.registerForm.reset();
    this.goToLogin();
}

goToLogin(){
  this.router.navigate(['/autentificare']);
}

}
