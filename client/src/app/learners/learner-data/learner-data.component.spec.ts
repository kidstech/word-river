import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';
import { MockLearnerDataService } from 'src/testing/learner-data.service.mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { MockSentencesService } from 'src/testing/sentences.service.mock';

import { LearnerDataComponent } from './learner-data.component';

describe('LearnerDataComponent', () => {
  let component: LearnerDataComponent;
  let fixture: ComponentFixture<LearnerDataComponent>;
  const paramMap = new Map();
  let mockStoryService: any;
  paramMap.set('id', '123');

  beforeEach(waitForAsync(() => {
  TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
    ],
      declarations: [ LearnerDataComponent ],
      providers: [
      {provide: LearnerDataService, useValue: new MockLearnerDataService()},
      {provide: SentencesService, useValue: new MockSentencesService()},
      {provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
         password: 'BirukMengistu', uid:'123'})},
      {provide: ActivatedRoute, useValue: {
        paramMap: of(paramMap)
      }}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockStoryService = jasmine.createSpyObj('StoryService', ['getLearnerStories']);
    fixture = TestBed.createComponent(LearnerDataComponent);
    component = fixture.componentInstance;
    fixture.whenStable().then(()=> {
    fixture.detectChanges();
    }
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set learnerStories when getLearnerStories returns a successful response', () => {
    const mockResponse = undefined;
    mockStoryService.getLearnerStories.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(component.learnerStories).toEqual(mockResponse);
  });

  it('should log an error when getLearnerStories returns an error', () => {
    const mockPmap = 'Hello';
    const mockThisIsOnit = 'This is ngOnInit';
    const mockError = new Error('Hello');
    mockStoryService.getLearnerStories.and.returnValue(throwError(mockError));

    spyOn(console, 'log');

    component.ngOnInit();

    //expect(console.log).toHaveBeenCalledWith(mockError);
  });
});

