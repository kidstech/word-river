import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
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
  paramMap.set('id', '123');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
