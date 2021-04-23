import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from 'src/app/services/login-service/login.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { UserServiceMock } from 'src/testing/user-service-mock';

import { CreateLearnerComponent } from './create-learner.component';

describe('CreateLearnerComponent', () => {
  let component: CreateLearnerComponent;
  let fixture: ComponentFixture<CreateLearnerComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ CreateLearnerComponent ],
      providers: [{ provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
      password: 'BirukMengistu', uid:'123'}) },
    { provide: AngularFireStorage, useValue: new FireStorageMock() },
    { provide: UserService, useValue: new UserServiceMock() }
  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLearnerComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a new learner', (done) => {
    spyOn(router,'navigate');
    component.name = 'bob';
    component.downloadURL = 'icon.png';
    component.createLearner();
    setTimeout(done, 500);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
  it('should create a new learner fails with bad params', (done) => {
    spyOn(router,'navigate');
    component.name = null;
    component.downloadURL = 'icon.png';
    component.createLearner();
    setTimeout(done, 100);
    expect(router.navigate).not.toHaveBeenCalledWith(['/home']);
  });
});
