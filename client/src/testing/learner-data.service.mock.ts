import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';

@Injectable()
export class MockLearnerDataService extends LearnerDataService {
  static wordMap = new Map<string, number>();
  static sessionTimes = new Map<string, string>();

  static testLearnerData: LearnerData = {
    learnerId: '1623445108911',
    learnerName: 'Bob',
    wordCounts: MockLearnerDataService.wordMap,
    sessionTimes: MockLearnerDataService.sessionTimes
  };

  constructor() {
    super(null);
  }

  getLearnerData(id: string): Observable<LearnerData> {
    MockLearnerDataService.wordMap.set('mango', 1);
    MockLearnerDataService.wordMap.set('tangerine', 1);
    MockLearnerDataService.wordMap.set('apple', 3);
    MockLearnerDataService.wordMap.set('banana', 5);
    MockLearnerDataService.wordMap.set('orange', 1);
    MockLearnerDataService.wordMap.set('grape', 1);
    MockLearnerDataService.sessionTimes.set('3/8/2022 8:27:50 PM', '');

    return of(MockLearnerDataService.testLearnerData);
  }

}
