import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutentificareService } from '@services/autentificare.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    public authService: AutentificareService,
    private route:Router
  ) { }
  ngOnInit(): void {
  }

  goToLogin(){
    this.route.navigate(['/autentificare']);
  }

}
