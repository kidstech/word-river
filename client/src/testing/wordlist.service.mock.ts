import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';

/**
 * A 'mock' version of the `WordListService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockWordListService extends WordListService {
  static testWordLists: WordList[] = [
    {
      name: 'animal',
      enabled: true,
      nouns:[{word:'pig',forms:['pig','pigs']}],
      verbs:[{word:'sniff',forms:['sniffs','sniffing']}],
      adjectives:[{word:'round',forms:['rounder','round']}],
      misc:[{word:'to',forms:['to']}]
    },
    {
      name: 'farm',
      enabled: false,
      nouns: [{word:'horse', forms:['horse']}],
      adjectives: [{word:'large',forms:['large','larger']}],
      verbs: [{word:'smell',forms:['smell','smelling']}],
      misc: [{word:'if',forms:['if']}],
    },
    {
      name: 'sad',
      enabled: true,
      nouns: [{word:'tear', forms:['tear','tears']}],
      verbs: [{word:'cry',forms:['cries','crying']}],
      adjectives:[{word:'weak',forms:['weak','weaker']}],
      misc:[{word:'then',forms:['then']}]
    },
    {
      name: 'school',
      enabled: true,
      nouns:[{word:'class',forms:['class','classes']}, {word:'grade',forms:['grades','grade']}],
      adjectives:[{word:'hard',forms:['hard','harder']}],
      verbs:[{word:'pass',forms:['pass','passing']}, {word:'fail',forms:['fail','fails']}],
      misc:[{word:'and',forms:['and']}]
    },
    {
      name: 'family',
      enabled: true,
      nouns:[{word:'aunt',forms:['aunt','aunts']}],
      adjectives:[{word:'small',forms:['small']}],
      verbs:[{word:'hug',forms:['hug','hugs']}, {word:'hit',forms:['hit','hitting']}],
      misc:[{word:'the',forms:['the']}]
    },
  ];

  constructor() {
    super(null);
  }

  getWordList(): Observable<WordList[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test WordLists regardless of what
    // filters are passed in.
    return of(MockWordListService.testWordLists);
  }
  getWordListByName(name): Observable<WordList> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test WordLists regardless of what
    // filters are passed in.
    return of(MockWordListService.testWordLists.filter(e=>e.name === name)[0]);
  }
}
