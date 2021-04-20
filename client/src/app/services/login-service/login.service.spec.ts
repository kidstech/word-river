import { UserServiceMock } from './../../../testing/user-service-mock';
import { UserService } from './../user-service/user.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { DisplayContextPacksComponent } from 'src/app/context-packs/display-contextPacks/display-context-packs.component';
import { environment } from 'src/environments/environment';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let fixture: ComponentFixture<LoginService>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', uid: '123' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        // RouterTestingModule.withRoutes([
        //   {path:'packs/new',component:AddContextPackComponent},]),
      ], providers: [{ provide: AngularFireAuth, useValue: new FirebaseAuthMock() },
      { provide: UserService, useValue: new UserServiceMock() }
      ]
    });
    // httpClient = TestBed.inject(HttpClient);
    // httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(LoginService);
  });

  it('should be created', (done) => {
    service.afAuth.authState.subscribe(res => {
      expect(res !== null).toBe(true);
      done();
    });
    expect(service).toBeTruthy();
  });
  it('saveUserData works', () => {
    service.setUserData(john);
    expect(localStorage.getItem('user')).toBeTruthy();
  });
  it('setLoggedIn works', () => {
    service.loggedIn = true;
    expect(service.signedIn).toBe(true);
    service.loggedIn = false;
    expect(service.signedIn).toBe(false);

  });
  it('getAuthID works', () => {
    service.setUserData(john);

    expect(service.authID).toBe('123');
  });
  it('convertMessage works', () => {
    const l = {
      'auth/email-already-in-use': 'The email you entered is already in use.',
      'auth/invalid-email': 'The email you entered is invalid.',
      'auth/weak-password': 'Your password must be at least 6 characters long.',
      'auth/argument-error': 'Please enter a valid email and password first.',
      'auth/user-not-found': 'The account you entered does not exist.',
      'auth/wrong-password': 'Password is incorrect.',
      'misc/error': 'misc/error'
    };
    Object.keys(l).forEach(k =>
      expect(l[k]).toEqual(service.convertMessage(k)));
  });
  it('signUp works', (done) => {
    service.signUp('fs', 'fa.fa', 'faf@ga.ag', 'fadge', res => {
      expect(res).toEqual({ user: { uid: '123' } });
      done();
    }, err => { });
    service.signUp('saf', 'asf', 'asf', '', res => {
    }, err => {
      expect(err).toBe('Error');
      done();
    });
  });
  it('signIn works', () => {
    service.signIn('faf@ga.ag', 'fadge', res => {
      expect(res).toEqual({ user: { uid: '123' } });
    }, err => {});
    service.signIn('', '', res => {
    }, err => {
      expect(err).toBeUndefined();
    });
  });
});
