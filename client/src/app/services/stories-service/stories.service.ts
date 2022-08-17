import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from 'src/app/datatypes/story';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {
  readonly storiesUrl: string = environment.apiUrl + 'stories';
  userUrl: string;

  constructor(private httpClient: HttpClient) { }

  getLearnerStories(learnerId: string): Observable<Story[]> {
    return this.httpClient.get<Story[]>(this.storiesUrl + '/' + learnerId);
  }

  getLearnerStory(storyName: string, storyID: string): Observable<Story> {
    return this.httpClient.get<Story>(this.storiesUrl + '/theStory/' + storyName + '/' + storyID);
  }
}
