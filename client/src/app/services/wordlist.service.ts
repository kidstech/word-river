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
  readonly defaultPack: string = '605bc9d893b2d94300a98753';

  readonly wordListUrl: string = `${environment.apiUrl}packs`;

  constructor(private httpClient: HttpClient) {

  }

  getWordList(): Observable<WordList[]> {
    const httpParams: HttpParams = new HttpParams();
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    return this.httpClient.get<WordList[]>(this.wordListUrl  + '/' + id + '/wordlists', {
      params: httpParams,
    });
  }

  getWordListByName(word: string): Observable<WordList> {
    const httpParams: HttpParams = new HttpParams();
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    const name: string = url[5];
    return this.httpClient.get<WordList>(this.wordListUrl + '/' + id + '/' + word);
  }

  addWordList(newWordList: WordList) {
    // Send post request to add a new word list with the word list data as the body.
    const httpParams: HttpParams = new HttpParams();
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    return this.httpClient.post<WordList>(this.wordListUrl + '/' + id, newWordList).pipe(map(res => res));
  }

  editWordList(name: string,wordList: WordList): Observable<WordList> {
    const httpParams: HttpParams = new HttpParams();
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    const name1: string = url[5];
    return this.httpClient.put<WordList>(this.wordListUrl + '/' + id + '/' + name1, wordList).pipe(map(res => res));
  }

  deleteWordList(deleteWordList: WordList): Observable<WordList> {
    return this.httpClient.delete<WordList>(this.wordListUrl + '/' + deleteWordList.name).pipe(map(res => res));
  }

}
