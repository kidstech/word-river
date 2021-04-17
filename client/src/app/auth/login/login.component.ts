import { Router } from '@angular/router';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginEmail: string;
  loginPass: string;
  signUpName: string;
  signUpPass: string;
  signUpEmail: string;

  validLoginEmail: boolean;
  validLoginPassword: boolean;
  validSignUpName: boolean;
  validSignUpEmail: boolean;
  validSignUpPassword: boolean;

  constructor(private login: LoginService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.login.user);

      if (this.login.isLoggedIn) {
        this.router.navigate(['packs']);
      };
  }
  update(){
    this.validLoginEmail =
    this.validateEmail(this.loginEmail);
    this.validSignUpEmail =
    this.validateEmail(this.signUpEmail);
    this.validLoginPassword = this.loginPass.length > 6;
    this.validSignUpPassword = this.signUpPass.length > 6;
    console.log(this.loginEmail);
    console.log(`this.validLoginEmail ${this.validLoginEmail}\nthis.validLoginPass${this.validLoginPassword}`);
  }
  signIn(){
    this.login.signIn(this.loginEmail, this.loginPass, (uid) => {
      console.log(uid);
      this.router.navigate(['packs']);
    }, (err) => {
      console.log(err);
    });
  }
  signUp(){
    this.login.signUp('random',this.signUpEmail, this.signUpPass, (uid) => {
      console.log(uid);
      this.router.navigate(['packs']);
    }, (err) => {
      console.log(err);
    });
  }
  validateEmail(email) {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
}
