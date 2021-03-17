import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';

import { WordlistCardComponent } from './wordlist-card.component';

describe('WordlistCardComponent', () => {
  let component: WordlistCardComponent;
  let fixture: ComponentFixture<WordlistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordlistCardComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,RouterModule.forRoot([]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordlistCardComponent);
    component = fixture.componentInstance;
    component.wordlist = {
      name: 'farm_animals',
      enabled: true,
      nouns: [
        { word: 'cat', forms: ['cat', 'cats'] },
        { word: 'chicken', forms: ['chicken', 'chickens'] }
      ],
      verbs: [{ word: 'moo', forms: ['moo', 'moos', 'mooed', 'mooing'] },
      { word: 'oink', forms: ['oink', 'oinks', 'oinked', 'oinking'] },
      {
        word: 'cluck',
        forms: ['cluck', 'clucks', 'clucking', 'clucked']
      },
      { word: 'baa', forms: ['baa', 'baas', 'baaed', 'baaing'] },
      { word: 'meow', forms: ['meow', 'meows', 'meowing', 'meowed'] },],
      adjectives: [],
      misc: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
