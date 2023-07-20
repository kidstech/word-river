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
import * as Highcharts from 'highcharts';
//import { Word } from 'src/app/datatypes/word';


// eslint-disable-next-line no-var
declare var require: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);

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
 // wordDataSource = new MatTableDataSource<Word>();
  learnerData: LearnerData;
  learnerName: string;
  learnerId: string;
  learnerWords: Map<string, number>;
  sentences: Sentence[];
  wordCountArray: WordCounts[];
  wordsArray: string[];
  sentenceTableColumns = ['timeSubmitted', 'sentenceText'];
  wordCountTableColums = ['word', 'timesSeen'];
  formControl: AbstractControl;
  wordFormControl: AbstractControl;
  learnerStories: Story[];
  highChartsLines: string[];
  public activity;
  public xData;
  public label;
  options: any;
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

        let obj ={name:'',weight:0};
        const lines = this.highChartsLines;
        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        const highChartsData = Highcharts.reduce(lines, function(arr, word) {
            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions, no-shadow
            obj = Highcharts.find(arr, function(obj) {
                return obj.name === word;
            });
            if (obj) {
                 obj.weight += 1;
            } else {
                obj = {
                    name: word,
                    weight: 1,
                };
                arr.push(obj);
            }
            return arr;
        }, []);
        this.options = {
          accessibility: {
              screenReaderSection: {
                  beforeChartFormat: '<h5>{chartTitle}</h5>' +
                      '<div>{chartSubtitle}</div>' +
                      '<div>{chartLongdesc}</div>' +
                      '<div>{viewTableButton}</div>'
              }
          },
          series: [{
              type: 'wordcloud',
              // eslint-disable-next-line object-shorthand
              data: highChartsData,
              name: 'Occurrences'
          }],
          title: {
              text: ''
          },
          chart: {
            marginRight: 100,
            marginLeft: 100,
            marginBottom: 0
          },
          spacing: [50, 1, 1, 1]
      };
          Highcharts.chart('container', this.options);
      });


    },
     error => {
        console.log(error);
      });

      this.sentenceDataSource.filterPredicate = ((data2, filter) => {
        const a = !filter.sentenceText || data2.sentenceText.toLowerCase().includes(filter.sentenceText);
        const b = !filter.timeSubmitted || data2.timeSubmitted.split(' ').includes(filter.timeSubmitted);
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

      this.wordCountDataSource.filterPredicate = ((data2, filter) => {
        const a =  !filter.word || data2.word === filter.word;
        const b =  !filter.endsWith || data2.word.endsWith(filter.endsWith);
        const c =  !filter.startsWith || data2.word.startsWith(filter.startsWith);
        const d =  !filter.minWordCount || data2.count >= filter.minWordCount;
        const e = !filter.maxWordCount || data2.count <= filter.maxWordCount;
        const f = !filter.type || data2.type === filter.type;
        return a && b && c && d && e && f;
      }) as (currentWord, aString) => boolean;

      // this.wordDataSource.filterPredicate = ((data2, filter) => {
      //   const f = !filter.type || data2.type === filter.type;
      //   return f;
      // }) as (currentWord, aString) => boolean;

      this.wordFormControl = this.formBuilder.group({
        word: '',
        endsWith: '',
        startsWith: '',
        minWordCount: '',
        maxWordCount: '',
        type: ''
      });

      console.log('Hello');
      this.wordFormControl.valueChanges.subscribe(value => {
        console.log('Hello!');
        const filter = {...value, word: value.word.trim().toLowerCase()} as string;
        this.wordCountDataSource.filter = filter;
      });
    }



     convertLearnerWordsMapToArray(): void {
       this.wordCountArray = [];
       this.highChartsLines = [];
      for (const [key, value] of Object.entries(this.learnerWords)) {
        const word = new WordCounts();
        word.word = key;
        word.count = value;
        this.wordCountArray.push(word);
        for(let i = 0; i <= value - 1; i++) {
          this.highChartsLines.push(key);
         }
      }
      this.wordCountDataSource.data = this.wordCountArray;
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    convertLearnerWordsMapToArray2(): string[] {
      this.wordsArray= [];
      this.highChartsLines = [];
     for (const [key, value] of Object.entries(this.learnerWords)) {
       const word = new WordCounts();
       word.word = key;
       word.count = value;
       for(let i = 0; i <= value - 1; i++) {
        this.wordsArray.push(key);
       }
     }
     return this.wordsArray;
   }

  //   findWord(sentence: string, word: string) {
  //     const split: string[] = sentence.split(' ');
  //     return split.includes(word);
  //  }

  }
