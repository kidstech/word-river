import { MockWordListService } from '../../../testing/wordlist.service.mock';
import { WordListService } from 'src/app/services/wordlist.service';
import { WordList } from 'src/app/datatypes/wordlist';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';

import { DisplayWordlistComponent } from './display-wordlist.component';

describe('DisplayWordlistComponent', () => {
  let component: DisplayWordlistComponent;
  let fixture: ComponentFixture<DisplayWordlistComponent>;


  const testWordList = new WordList();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayWordlistComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,RouterModule.forRoot([]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial wordlist should be 23', () => {
    expect(component.wordcount).toBe(23);
  });

  // it('should count the number of words', () => {
  //   expect(testWordList.wordcount).toBe(3);
  // });
});
