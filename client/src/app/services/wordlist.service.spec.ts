import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WordList } from '../datatypes/wordlist';
import { WordListService } from './wordlist.service';

describe('WordListService', () => {
  let service: WordListService;
  const testWordLists: any = [
    {
      name: 'birthday',
      enabled: true,

      nouns: [
        { word: 'cake', forms: ['cake', 'cakes'] },
        { word: 'parent', forms: ['parent', 'parents'] }
      ],

      verbs: [
        {
          word: 'blow',
          forms: ['blow', 'blows', 'blew', 'blown', 'blowing']
        },
        { word: 'wish', forms: ['wish', 'wishes', 'wished', 'wishing'] },
        { word: 'laugh', forms: ['laugh', 'laughs', 'laughed', 'laughing'] }
      ],

      adjectives: [
        { word: 'fun', forms: ['fun'] },
        { word: 'impressive', forms: ['impressive'] }
      ],

      misc: []
    },
    {
      name: 'farm_animals',
      enabled: true,
      nouns: [
        { word: 'cat', forms: ['cat', 'cats'] },
        { word: 'chicken', forms: ['chicken', 'chickens'] }
      ],

      verbs: [
        { word: 'moo', forms: ['moo', 'moos', 'mooed', 'mooing'] },
        { word: 'oink', forms: ['oink', 'oinks', 'oinked', 'oinking'] },
        {
          word: 'cluck',
          forms: ['cluck', 'clucks', 'clucking', 'clucked']
        },
        { word: 'baa', forms: ['baa', 'baas', 'baaed', 'baaing'] },
        { word: 'meow', forms: ['meow', 'meows', 'meowing', 'meowed'] },
      ],

      adjectives: [],

      misc: []
    }
  ];
  let wordListService: WordListService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);

    service = TestBed.inject(WordListService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getWordList() calls api/wordLists', () => {
    service.getWordList().subscribe(
      wordLists => expect(wordLists).toBe(testWordLists)
    );

    const req = httpTestingController.expectOne(service.wordListUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(testWordLists);
  });

  it('getWordListByName() calls api/wordLists/name', () => {
    const targetWordList: WordList = testWordLists[1];
    const targetName: string = targetWordList.name;
    service.getWordListByName(targetName).subscribe(
      wordList => expect(wordList).toBe(targetWordList)
    );

    const expectedUrl: string = service.wordListUrl + '/' + targetName;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetWordList);
  });

  it('addWordList() posts to api/wordLists', () => {

    service.addWordList(testWordLists[1]).subscribe(
      name => expect(name).toBe(testWordLists[1].name)
    );

    const req = httpTestingController.expectOne(service.wordListUrl);

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testWordLists[1]);

    req.flush(testWordLists[1].name);
  });

  it('editWordList() puts to api/wordLists', () => {

    service.editWordList(testWordLists[1].name,testWordLists[1]).subscribe(
      wordList => expect(wordList).toBe(testWordLists[1])
    );

    const req = httpTestingController.expectOne(service.wordListUrl + '/farm_animals');

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(testWordLists[1]);

    req.flush(testWordLists[1]);
  });

  it('deleteWordList() puts to api/wordLists', () => {

    service.deleteWordList(testWordLists[1]).subscribe(
      wordList => expect(wordList).toBe(testWordLists[1])
    );

    const req = httpTestingController.expectOne(service.wordListUrl + '/farm_animals');

    expect(req.request.method).toEqual('DELETE');

    req.flush(testWordLists[1]);
  });
});
