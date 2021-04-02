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
  readonly wordListUrl: string = `${environment.apiUrl}packs/`;
  constructor(private httpClient: HttpClient) {
  }
  getWordList(id: string): Observable<WordList[]> {
    const httpParams: HttpParams = new HttpParams();
    return this.httpClient.get<WordList[]>(this.wordListUrl + id + '/wordlists', {
      params: httpParams,
    });
  }
  getWordListByName(word: string, id: string): Observable<WordList> {
    return this.httpClient.get<WordList>(this.wordListUrl + id + '/' + word);
  }
  addWordList(newWordList: WordList, id: string) {
    // Send post request to add a new word list with the word list data as the body.
    return this.httpClient.post<WordList>(this.wordListUrl + id, newWordList).pipe(map(res => res));
  }

  editWordList(name: string, wordList: WordList, id: string): Observable<WordList> {
    return this.httpClient.put<WordList>(this.wordListUrl + id + '/' + name, wordList).pipe(map(res => res));
  }
  deleteWordList(deleteWordList: WordList, id: string): Observable<WordList> {
    return this.httpClient.delete<WordList>(this.wordListUrl + id + '/' + deleteWordList.name).pipe(map(res => res));
  }
}
