import { Injectable, NgZone } from '@angular/core';
import auth from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user-service/user.service';
import { User } from 'src/app/datatypes/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userData: any; // Save logged in user data
  signedIn: any;

  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private users: UserService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    // this.afAuth.authState.subscribe(user => {
    //   if (user) {
    //     this.userData = user;
    //     console.log(JSON.stringify(this.userData));

    //     localStorage.setItem('user', JSON.stringify(this.userData));
    //     JSON.parse(localStorage.getItem('user'));
    //   } else {
    //     localStorage.setItem('user', null);
    //     JSON.parse(localStorage.getItem('user'));
    //   }
    // });
  }

  // Sign in with email/password
  signIn(email, password, then: (uid) => any, err: (msg) => any) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => this.ngZone.run(() => {
        this.users.getUser(result.user.uid).subscribe(user => {
          this.setUserData(user);
          then(result.user.uid);
        }, error =>
          err(JSON.stringify(error))
        );
      })
      ).catch((error) => {
        console.log(JSON.stringify(error));
        switch (error.code) {
          case 'auth/user-not-found':
            err('The account you entered does not exist.');
            break;
          case 'auth/invalid-email':
            err('The email you entered is invalid.');
            break;
          case 'auth/wrong-password':
            err('Password is incorrect.');
            break;
          default:
            err(error);
            break;
        }
      });
  }

    // Sign up with email/password
    signUp(name, icon, email, password, then: (res) => any, err: (e) => any) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          const user: User = {
            authId: result.user.uid,
            name,
            icon,
            learners: [],
            contextPacks: []
          };
          this.users.createUser(user).subscribe(_ => {
            this.setUserData(user);
            then(result);
          }, error => err(JSON.stringify(error)));
        }).catch((e) => {
          console.log(JSON.stringify(e));
          switch (e.code) {
            case 'auth/email-already-in-use': //when the email is already in use
              err('The email you entered is already in use.');
              break;
            case 'auth/invalid-email': //when you type in nothing (bad formatted email)
              err('The email you entered is invalid.');
              break;
            case 'auth/weak-password': //when you put in a password of less than 6 characters
              err('Your password must be at least 6 characters long.');
              break;
            case 'auth/argument-error': //when you put in a password of less than 6 characters
              err('Please enter a valid email and password first.');
              break;
            default:
              err(e);
              break;
          }
        });
    }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user !== null);
    return user !== null;
  }
  set loggedIn(s) {
    this.signedIn = s;
  }
  get user() {
    console.log(localStorage.getItem('user'));

    return JSON.parse(localStorage.getItem('user'));
  }
  get authID() {
    return this.user ? this.user.uid : null;
  }
  // // Sign in with Google
  // googleAuth() {
  //   return this.authLogin(new auth.GoogleAuthProvider());
  // }

  // Auth logic to run auth providers
  // authLogin(provider) {
  //   return this.afAuth.signInWithPopup(provider)
  //     .then((result) => {
  //       this.ngZone.run(() => {
  //         this.router.navigate(['dashboard']);
  //       });
  //       this.setUserData(result.user);
  //     }).catch((error) => {
  //       window.alert(error);
  //     });
  // }

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
  signOut(then: (res) => any,err: (some) => any) {
    return this.afAuth.signOut().then(res => {
      localStorage.setItem('user',null);
      then(res);
    },error=>err(error));
  }
}
