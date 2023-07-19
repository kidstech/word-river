import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FileService } from 'src/app/services/file.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { FileServiceMock } from 'src/testing/file-service.mock';
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
    { provide: FileService, useValue: new FileServiceMock() },
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

  it('should upload images"', (done) => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    component.onFileAdded(mockEvt as any);
    expect(component.uploading).toBe(true);
    setTimeout(()=>{expect(component.uploading).toBe(false); done();}, 150);
    });

  it('should set downloadURL to "/assets/moose.png" when selected is "moose"', () => {
    component.selected = 'moose';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/moose.png');
  });

  it('should set downloadURL to "/assets/narwhal.png" when selected is "narwhal"', () => {
    component.selected = 'narwhal';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/narwhal.png');
  });

  it('should set downloadURL to "/assets/penguin.png" when selected is "penguin"', () => {
    component.selected = 'penguin';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/penguin.png');
  });

  it('should set downloadURL to "/assets/pig.png" when selected is "pig"', () => {
    component.selected = 'pig';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/pig.png');
  });

  it('should set downloadURL to "/assets/duck.png" when selected is "duck"', () => {
    component.selected = 'duck';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/duck.png');
  });

  it('should set downloadURL to "/assets/add-img.png" for unknown selected values', () => {
    component.selected = 'unknown';
    component.inputChange(null);
    expect(component.downloadURL).toBe('/assets/add-img.png');
  });
});

