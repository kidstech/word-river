import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LearnerDataService {

  readonly learnerDataUrl: string = environment.apiUrl + 'learnerData';

  constructor(private http: HttpClient) { }

  getLearnerData(id: string): Observable<LearnerData> {
    return this.http.get<LearnerData>(this.learnerDataUrl + '/' + id);
  }
}
