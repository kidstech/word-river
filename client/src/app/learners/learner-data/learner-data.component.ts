import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { WordCounts } from 'src/app/datatypes/wordCounts';
import { Sentence } from 'src/app/datatypes/sentence';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';


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
  sentences: Sentence[];
  wordCountArray: WordCounts[];
  sentenceTableColumns = ['timeSubmitted', 'sentenceText'];
  wordCountTableColums = ['word', 'timesSeen'];
  constructor(
    private route: ActivatedRoute,
    private learnerDataService: LearnerDataService,
    private sentencesService: SentencesService
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.learnerId = pmap.get('id');

      this.sentencesService.getSentences(this.learnerId).subscribe(res=> {
        this.sentences = res;
      });
      this.learnerDataService.getLearnerData(this.learnerId).subscribe(res=> {
        this.learnerData = res;
        this.learnerWords = res.wordCounts;
        console.log(this.learnerWords);
        this.convertLearnerWordsMapToArray();
        this.learnerName = res.learnerName;
      });});
    }

     convertLearnerWordsMapToArray(): void {
       this.wordCountArray = [];
      for (const [key, value] of Object.entries(this.learnerWords)) {
        const word = new WordCounts();
        word.word = key;
        word.count = value;
        this.wordCountArray.push(word);
      }
    }
  }
