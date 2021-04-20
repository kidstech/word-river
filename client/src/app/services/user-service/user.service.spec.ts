import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { FirebaseAuthMock } from 'src/testing/firebase-auth-mock';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;


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

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
