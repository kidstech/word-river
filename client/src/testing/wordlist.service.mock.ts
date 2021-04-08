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
  testWordLists: WordList[] = [
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

  getWordList(id: string): Observable<WordList[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test WordLists regardless of what
    // filters are passed in.
    return of(this.testWordLists);
  }
  addWordList(newWordlist: WordList,id: string): Observable<WordList>{
    const observable = new Observable<WordList>(observer=>{
      for(const wl of this.testWordLists){
      if(newWordlist.name === wl.name){
        const error = {error: {
                      title: 'The word list already exists in the context pack'
                    }
                  };
        observer.error(error);
     }
     else if(newWordlist.name === null){
      const error = {error: {
        title: 'Server error'
      }
    };
      observer.error(error);
   }
     else{
        this.testWordLists.push(newWordlist);
       observer.next(newWordlist);
      }
    }
  });
    return observable;
  }
  getWordListByName(word: string, id: string): Observable<WordList> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test WordLists regardless of what
    // filters are passed in.
    return of(this.testWordLists[0]);
  }
  editWordList(name: string, wordlist: WordList, id: string): Observable<WordList>{
    this.testWordLists = this.testWordLists.map(w=>{
      if(w.name === name) {return wordlist;}
      else {return w;}
    });
    return of(this.testWordLists.filter(e=>e.name === name)[0]);
  }
  deleteWordList(wordlist: WordList, id: string): Observable<WordList>{
    this.testWordLists = this.testWordLists.filter(w=> w!==wordlist);
    return of(wordlist);
  }
}
