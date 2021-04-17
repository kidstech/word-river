import { Injectable, NgZone } from '@angular/core';
import auth from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        console.log(JSON.stringify(this.userData));

        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  signIn(email, password, then: (uid) => any, err: (msg) => any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => this.ngZone.run(() => {
        this.setUserData(result.user);
        then(result.user.uid);
      })
      ).catch((error) => {
        err(error);
      });
  }

  // Sign up with email/password
  signUp(name, email, password, then: (res) => any, error: (err) => any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        then(result);
        this.setUserData(result.user);
      }).catch((e) => {
        error(e);
      });
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user!==null);
    return user !== null;
  }
  get user() {
    return JSON.parse(localStorage.getItem('user'));
  }
  // // Sign in with Google
  // googleAuth() {
  //   return this.authLogin(new auth.GoogleAuthProvider());
  // }

  // Auth logic to run auth providers
  authLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.setUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user) {
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    // const userData: User = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL,
    //   emailVerified: user.emailVerified
    // };
    // return userRef.set(userData, {
    //   merge: true
    // });
    localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));
  }

  // Sign out
  signOut(then: (res) => any) {
    return this.afAuth.signOut().then(res => {
      localStorage.removeItem('user');
      then(res);
    });
  }
}
