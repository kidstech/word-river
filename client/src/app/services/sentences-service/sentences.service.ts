import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Sentence } from 'src/app/datatypes/sentence';
@Injectable({
  providedIn: 'root'
})
export class SentencesService {

  readonly sentencesUrl: string = environment.apiUrl + 'sentences';

  constructor(private http: HttpClient) { }

  getSentences(id: string): Observable<Sentence[]> {
    return this.http.get<Sentence[]>(this.sentencesUrl + '/' + id);
  }
}
