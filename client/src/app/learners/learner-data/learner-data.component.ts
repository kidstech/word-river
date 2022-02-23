import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';


@Component({
  selector: 'app-learner-data',
  templateUrl: './learner-data.component.html',
  styleUrls: ['./learner-data.component.scss']
})
export class LearnerDataComponent implements OnInit {
  learnerData: LearnerData;
  learnerName: string;
  learnerId: string;
  learnerWords: Map<string, number>;

  constructor(
    private route: ActivatedRoute,
    private learnerDataService: LearnerDataService
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.learnerId = pmap.get('id');
      this.learnerDataService.getLearnerData(this.learnerId).subscribe(res=> {
        this.learnerData = res;
        this.learnerWords = res.wordCounts;
        this.learnerName = res.learnerName;
      });});
    }
}
