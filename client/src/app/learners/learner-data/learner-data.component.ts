import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { WordCounts } from 'src/app/datatypes/wordCounts';
import { Sentence } from 'src/app/datatypes/sentence';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StoriesService } from 'src/app/services/stories-service/stories.service';
import { Story } from 'src/app/datatypes/story';



@Component({
  selector: 'app-learner-data',
  templateUrl: './learner-data.component.html',
  styleUrls: ['./learner-data.component.scss']
})
export class LearnerDataComponent implements OnInit{
  @ViewChild('wordCountPaginator') wordCountPaginator: MatPaginator;
  @ViewChild('sentencePaginator') sentencePaginator: MatPaginator;
  sentenceDataSource = new MatTableDataSource<Sentence>();
  wordCountDataSource = new MatTableDataSource<WordCounts>();
  learnerData: LearnerData;
  learnerName: string;
  learnerId: string;
  learnerWords: Map<string, number>;
  sentences: Sentence[];
  wordCountArray: WordCounts[];
  sentenceTableColumns = ['timeSubmitted', 'sentenceText'];
  wordCountTableColums = ['word', 'timesSeen'];
  formControl: AbstractControl;
  wordFormControl: AbstractControl;
  learnerStories: Story[];

  //below code sourced from https://stackblitz.com/edit/table-filtering-multiple-filters-example?file=app%2Ftable-filtering-example.ts
  constructor(
    private route: ActivatedRoute,
    private learnerDataService: LearnerDataService,
    private sentencesService: SentencesService,
    private formBuilder: FormBuilder,
    private storyService: StoriesService
  ) {
  }



  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      console.log(pmap);
      console.log('This is ngOnInit');
      this.learnerId = pmap.get('id');

      this.storyService.getLearnerStories(this.learnerId).subscribe(res=> {
        this.learnerStories = res;
      },
      error => {
        console.log(error);
      });

      this.sentencesService.getSentences(this.learnerId).subscribe(res=> {
        this.sentences = res;
        this.sentenceDataSource.data = this.sentences;
        this.sentenceDataSource.paginator = this.sentencePaginator;
        // this.sentenceDataSource.filterPredicate = (data, filter) => {
        //   console.log(data.sentenceText);
        //   console.log(filter === data.sentenceText);
        // return  data.sentenceText.toLowerCase().split(' ').includes(filter) || data.sentenceText.toLowerCase() === filter;
        // };
      },
      error => {
        console.log(error);
      });
      this.learnerDataService.getLearnerData(this.learnerId).subscribe(res=> {
        this.learnerData = res;
        this.learnerWords = res.wordCounts;
        this.convertLearnerWordsMapToArray();
        this.learnerName = res.learnerName;
        this.wordCountDataSource.paginator = this.wordCountPaginator;
      });
    },
     error => {
        console.log(error);
      });

      this.sentenceDataSource.filterPredicate = ((data, filter) => {
        const a = !filter.sentenceText || data.sentenceText.toLowerCase().includes(filter.sentenceText);
        const b = !filter.timeSubmitted || data.timeSubmitted.split(' ').includes(filter.timeSubmitted);
        return a && b;
      }) as (currentSentence, aString) => boolean;

      this.formControl = this.formBuilder.group({
        sentenceText: '',
        timeSubmitted: ''
      });

      this.formControl.valueChanges.subscribe(value => {
        const filter = {...value, sentenceText: value.sentenceText.trim().toLowerCase()} as string;
        this.sentenceDataSource.filter = filter;
      });

      this.wordCountDataSource.filterPredicate = ((data, filter) => {
        const a =  !filter.word || data.word === filter.word;
        const b =  !filter.endsWith || data.word.endsWith(filter.endsWith);
        const c =  !filter.startsWith || data.word.startsWith(filter.startsWith);
        const d =  !filter.minWordCount || data.count >= filter.minWordCount;
        const e = !filter.maxWordCount || data.count <= filter.maxWordCount;
        return a && b && c && d && e;
      }) as (currentWord, aString) => boolean;

      this.wordFormControl = this.formBuilder.group({
        word: '',
        endsWith: '',
        startsWith: '',
        minWordCount: '',
        maxWordCount: ''
      });

      this.wordFormControl.valueChanges.subscribe(value => {
        const filter = {...value, word: value.word.trim().toLowerCase()} as string;
        this.wordCountDataSource.filter = filter;
      });
    }



     convertLearnerWordsMapToArray(): void {
       this.wordCountArray = [];
      for (const [key, value] of Object.entries(this.learnerWords)) {
        const word = new WordCounts();
        word.word = key;
        word.count = value;
        this.wordCountArray.push(word);
      }
      this.wordCountDataSource.data = this.wordCountArray;
    }

  //   findWord(sentence: string, word: string) {
  //     const split: string[] = sentence.split(' ');
  //     return split.includes(word);
  //  }
  }
