import { Router } from '@angular/router';
import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginEmail: string;
  loginPass='';
  signUpName: string;
  signUpPass='';
  signUpEmail: string;

  loginForm: FormGroup;
  signUpForm: FormGroup;

  //eslint-disable-next-line max-len
  //emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


  // validationMessages = {
  //   name: [
  //     { type: 'required', message: 'A name is required' },
  //     { type: 'maxLength', message: 'Your name must be less than 50 characters'}
  //   ],

  //   email: [
  //     { type: 'pattern', message: 'Invalid email entered' }
  //   ],

  //   password: [
  //     { type: 'minLength', message: 'Your password must be at least 8 characters long'}
  //   ]
  // };
  downloadURL: any;
  uploaded: boolean;
  uploading: boolean;



  constructor(
    private login: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private storage: AngularFireStorage,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.login.user);
    // this.createForms();
    if (this.login.isLoggedIn) {
      this.router.navigate(['packs']);
    };
  }
  // update() {
  //   // console.log(this.loginForm.get('email').hasError('pattern'));
  // }
  // createForms() {
    // //Validates login
    // this.loginForm = this.fb.group({
    //   email: new FormControl('', Validators.compose([
    //     // eslint-disable-next-line max-len
    //     Validators.pattern(this.emailPattern)
    //   ])),

    //   password: new FormControl('', Validators.compose([
    //     Validators.minLength(8),
    //   ]))
    // });

    // //Validates sign up
    // this.signUpForm = this.fb.group({
    //   name: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.maxLength(50),
    //   ])),

    //   email: new FormControl('', Validators.compose([
    //     // eslint-disable-next-line max-len
    //     Validators.pattern(this.emailPattern)
    //   ])),

    //   password: new FormControl('', Validators.compose([
    //     Validators.minLength(8),
    //   ]))
    // });
  // }
  signIn(): Promise<any> {
    return this.login.signIn(this.loginEmail, this.loginPass, (uid) => {
      console.log(uid);
      this.snackBar.open('Signed in successfully!', null, {
        duration: 3000
      });
      this.router.navigate(['packs']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 3000,
        panelClass: ['snackbar-dark-theme']
      });
    });
  }
  signUp() {
    return this.login.signUp(this.signUpName,this.downloadURL, this.signUpEmail, this.signUpPass, (uid) => {
      console.log(uid);
      this.snackBar.open('Signed up successfully!', null, {
        duration: 3000,
      });
      this.router.navigate(['packs']);
    }, (err) => {
      this.snackBar.open(err, null, {
        duration: 3000,
        panelClass: ['snackbar-dark-theme']
      });
    });
  }
  onFileAdded(event) {

    const file = event.target.files[0];
    const filePath = `${Math.floor(Math.random() * 100000000)}`;
    const fileRef = this.storage.ref(filePath);
    this.uploading = true;
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL().subscribe(link => {
          this.downloadURL = link;
          this.uploaded = true;
          this.uploading = false;
        });
      })
    ).subscribe();
  }
}
