import { Router } from '@angular/router';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private login: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.login.signOut((res)=>{
      if (this.login.isLoggedIn) {
        this.router.navigate(['packs']);
      } else {
        this.login.signIn('biruk@gmail.com', 'BirukMengistu', (uid) => {
          console.log(uid);
        }, (err) => {
          console.log(err);
        });
      }
    });

  }
}
