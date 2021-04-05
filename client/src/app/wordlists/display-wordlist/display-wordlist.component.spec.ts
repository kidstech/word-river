import { MockWordListService } from '../../../testing/wordlist.service.mock';
import { WordListService } from 'src/app/services/wordlist.service';
import { WordList } from 'src/app/datatypes/wordlist';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule, ParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';

import { DisplayWordlistComponent } from './display-wordlist.component';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
import { of } from 'rxjs';

describe('DisplayWordlistComponent', () => {
  let component: DisplayWordlistComponent;
  let fixture: ComponentFixture<DisplayWordlistComponent>;
  let service: MockCPService;

  const paramMap = new Map();
  paramMap.set('id', 'moo');

  const testWordList = new WordList();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayWordlistComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, RouterModule.forRoot([]), COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() },
      { provide: ContextPackService, useValue: new MockCPService() },
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(paramMap)
        }
      }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayWordlistComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ContextPackService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should count', () => {
    component.list = [
      {
        name: '',
        enabled: true,
        adjectives: [{ word: '', forms: [] }],
        verbs: [{ word: '', forms: [] }],
        nouns: [{ word: '', forms: [] }],
        misc: [{ word: '', forms: [] }]
      }];
    component.countWords();
    expect(component.wordcount).toBe(4);
  });

  it('should delete a cp', () => {
    component.pack = {
      _id: 'boo',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'bovines',
      icon: 'image.png',
      enabled: true,
      wordlist: MockCPService.testList
    };
    service.addPack(component.pack);
    component.delete();
    expect(service.includes(component.pack)).toBe(false);
  });

});
