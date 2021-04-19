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
  const john = {name:'john',email:'asg@aqega.ags',password:'sagasgasg',uid:'123'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        // RouterTestingModule.withRoutes([
        //   {path:'packs/new',component:AddContextPackComponent},]),
      ],providers:[{ provide: AngularFireAuth, useValue: new FirebaseAuthMock() }]
    });
    // httpClient = TestBed.inject(HttpClient);
    // httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
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
});
