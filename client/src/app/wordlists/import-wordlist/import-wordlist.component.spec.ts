import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';
import { DisplayWordlistComponent } from '../display-wordlist/display-wordlist.component';
import { ImportWordlistComponent } from './import-wordlist.component';
import { WordList } from 'src/app/datatypes/wordlist';
import { Word } from 'src/app/datatypes/word';

/*describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;
  const paramMap = new Map();

  let ngZone: NgZone;
  paramMap.set('id', 'wow');
  const ex = {
    name: 'testWordlistForImport',
    enabled: true,
    nouns: [{ word: 'pig', forms: ['pig', 'pigs'] }],
    verbs: [{ word: 'sniff', forms: ['sniffs', 'sniffing'] }],
    adjectives: [{ word: 'round', forms: ['rounder', 'round'] }],
    misc: [{ word: 'to', forms: ['to'] }]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportWordlistComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'packs/wow', component: DisplayWordlistComponent }
      ]), COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }, {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(paramMap)
        }
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWordlistComponent);
    component = fixture.componentInstance;
    ngZone = TestBed.get(NgZone);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should import', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['{"name":"sad","enabled":true,"nouns":[],"verbs":[],"adjectives":[],"misc":[]}'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });
  it('should fail import with array', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['[{"name":"sad","enabled":true,"nouns":[],"verbs":[],"adjectives":[],"misc":[]}]'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });
  it('should fail import with invalid', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['turkey'], 'filename', { type: 'application/json' });
    const mockEvt = { target: { files: [mockFile] } };
    spyOn(window as any, 'FileReader').and.callThrough();
    component.onFileAdded(mockEvt as any);
    expect(window.FileReader).toHaveBeenCalled();
  });

  it('should save', () => {
    component.wordlist = ex;
    component.id = 'wow';
    expect(component.save()).toBe(true);
    component.wordlist = undefined;
    expect(component.save()).toBe(false);
  });
});
*/

describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockWordListService: jasmine.SpyObj<WordListService>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockWordListService = jasmine.createSpyObj('WordListService', ['addWordList']);

    TestBed.configureTestingModule({
      declarations: [ImportWordlistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => '1' }) } },
        { provide: Router, useValue: mockRouter },
        { provide: WordListService, useValue: mockWordListService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImportWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the id property correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(component.id).toBe('1');
  });

  it('should set validFile to true when a valid file is added', () => {
    const mockFile = new File(
      ['{"name": "List", "enabled": true, "nouns": [{"word": "apple", "forms": []}], "verbs": [], "adjectives": [], "misc": []}'],
      'wordlist.json',
      { type: 'application/json' }
    );
    const event = { target: { files: [mockFile] } };
    component.onFileAdded(event);

    // Simulate FileReader onload event by manually calling the onload callback
    const fileReader = new FileReader();
    const result = JSON.stringify(mockFile);
    const fileLoadEvent = { target: { result } };
    fileReader.onload(fileLoadEvent as any);

    expect(component.validFile).toBeTruthy();
    expect(component.wordlist).toEqual({
      name: 'List',
      enabled: true,
      nouns: [{ word: 'apple', forms: [] }],
      verbs: [],
      adjectives: [],
      misc: []
    });
  });

  it('should set validFile to false when an invalid file is added', () => {
    const mockFile = new File(['invalid file content'], 'wordlist.json', { type: 'application/json' });
    const event = { target: { files: [mockFile] } };
    component.onFileAdded(event);
    expect(component.validFile).toBeFalsy();
    expect(component.wordlist).toBeUndefined();
  });

  it('should set validFile to false when the file content is not a valid JSON', () => {
    // eslint-disable-next-line max-len
    const mockFile = new File(['{"name": "List", "enabled": true, "nouns": [{"word": "apple", "forms": []}]'], 'wordlist.json', { type: 'application/json' });
    const event = { target: { files: [mockFile] } };
    component.onFileAdded(event);
    expect(component.validFile).toBeFalsy();
    expect(component.wordlist).toBeUndefined();
  });

  it('should call addWordList and navigate when save is called with a valid wordlist', () => {
    const mockWordList: WordList = {
      name: 'List',
      enabled: true,
      nouns: [{ word: 'apple', forms: [] }],
      verbs: [],
      adjectives: [],
      misc: []
    };
    component.wordlist = mockWordList;
    component.save();
    expect(mockWordListService.addWordList).toHaveBeenCalledWith(mockWordList, '1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['packs', '1']);
  });

  it('should return false when save is called without a valid wordlist', () => {
    const result = component.save();
    expect(result).toBeFalsy();
    expect(mockWordListService.addWordList).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});

