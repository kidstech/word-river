import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { WordList } from '../datatypes/wordlist';


@Injectable({
  providedIn: 'root'
})
export class WordListService {

  readonly wordListUrl: string = environment.apiUrl + 'wordlists';

  constructor(private httpClient: HttpClient) {

  }

  getWordList(): Observable<WordList[]> {
    let httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<WordList[]>(this.wordListUrl, {
      params: httpParams,
    });
  }

  getWordListByName(word: string): Observable<WordList> {
    return this.httpClient.get<WordList>(this.wordListUrl + '/' + word);
  }

  addWordList(newWordList: WordList): Observable<string> {
    // Send post request to add a new word list with the word list data as the body.
    return this.httpClient.post<{name: string}>(this.wordListUrl, newWordList).pipe(map(res => res.name));
  }

  editWordList(wordList: WordList): Observable<WordList> {
    return this.httpClient.put<WordList>(this.wordListUrl, wordList).pipe(map(res => res));
  }


}
