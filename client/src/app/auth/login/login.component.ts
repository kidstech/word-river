import { Router } from '@angular/router';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  loginForm: FormGroup;
  signUpForm: FormGroup;

  emailPattern = /.{1,50}@.{1,}\..{1,10}\w+/g;
  // eslint-disable-next-line max-len
  emailPattern2 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;


  validationMessages = {
    name: [
      { type: 'required', message: 'A name is required' },
      { type: 'maxLength', message: 'Your name must be less than 50 characters'}
    ],

    email: [
      { type: 'pattern', message: 'Invalid email entered' }
    ],

    password: [
      { type: 'minLength', message: 'Your password must be at least 8 characters long'}
    ]
  };



  constructor(
    private login: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.login.user);
    this.createForms();
    if (this.login.isLoggedIn) {
      this.router.navigate(['packs']);
    };
  }
  update() {
    console.log(this.loginForm.get('email').hasError('pattern'));
  }
  createForms() {
    //Validates login
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        // eslint-disable-next-line max-len
        Validators.pattern(this.emailPattern2)
      ])),

      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
      ]))
    });

    //Validates sign up
    this.signUpForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
      ])),

      email: new FormControl('', Validators.compose([
        // eslint-disable-next-line max-len
        Validators.pattern(this.emailPattern2)
      ])),

      password: new FormControl('', Validators.compose([
        Validators.minLength(8),
      ]))
    });
  }
  signIn() {
    this.login.signIn(this.loginEmail, this.loginPass, (uid) => {
      console.log(uid);
      this.router.navigate(['packs']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 2000,
      });
    });
  }
  signUp() {
    this.login.signUp('random', this.signUpEmail, this.signUpPass, (uid) => {
      console.log(uid);
      this.router.navigate(['packs']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 2000,
      });
    });
  }
  validateEmail(email) {
    // eslint-disable-next-line max-len
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
