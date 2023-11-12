import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerData } from 'src/app/datatypes/learnerData';
import { WordCounts } from 'src/app/datatypes/wordCounts';
import { Sentence } from 'src/app/datatypes/sentence';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StoriesService } from 'src/app/services/stories-service/stories.service';
import { Story } from 'src/app/datatypes/story';
import * as Highcharts from 'highcharts';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';




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
  learnerData: LearnerData;
  learnerName: string;
  learnerId: string;
  isGridListExpanded = false;
  learnerWords: Map<string, number>;
  sentences: Sentence[];
  totalSentences = 0;
  wordCountArray: WordCounts[];
  filteredGridListData: any[];
  gridListFormControl: FormGroup;
  wordsArray: string[];
  sentenceTableColumns = ['timeSubmitted', 'sentenceText'];
  wordCountTableColums = ['word', 'timesSeen'];
  formControl: FormGroup;
  wordFormControl: AbstractControl;
  learnerStories: Story[];
  highChartsLines: string[];
  totalWordCount = 0;
  columnHeight = 3;
  filterCriteria: any = {
    word: '',
    startsWith: '',
    endsWith: '',
    minWordCount: '',
    maxWordCount: ''
  };
  // Define a variable to store the current sorting option
  currentSortOption = '';

  public activity;
  public xData;
  public label;
  options: any;
  wordCountColumns: any;
  //below code sourced from https://stackblitz.com/edit/table-filtering-multiple-filters-example?file=app%2Ftable-filtering-example.ts
  constructor(
    private route: ActivatedRoute,
    private learnerDataService: LearnerDataService,
    private sentencesService: SentencesService,
    private formBuilder: FormBuilder,
    private storyService: StoriesService,
    private cdRef: ChangeDetectorRef
  ) {
    this.gridListFormControl = this.formBuilder.group({
      word: '',
      endsWith: '',
      startsWith: '',
      minWordCount: '',
      maxWordCount: ''
    });
    this.formControl = this.formBuilder.group({
      sentenceText: '',
      timeSubmitted: ''
    });
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

        this.updateTotalSentences();
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
        this.filteredGridListData = this.wordCountArray;
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
    this.gridListFormControl.get('word').valueChanges.subscribe(() => this.applySort());
    this.gridListFormControl.get('startsWith').valueChanges.subscribe(() => this.applySort());
    this.gridListFormControl.get('endsWith').valueChanges.subscribe(() => this.applySort());
    this.gridListFormControl.get('minWordCount').valueChanges.subscribe(() => this.applySort());
    this.gridListFormControl.get('maxWordCount').valueChanges.subscribe(() => this.applySort());

    // Initialize sorting
    this.applySort();


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
        return a && b && c && d && e;
      }) as (currentWord, aString) => boolean;

      // this.wordFormControl = this.formBuilder.group({
      //   word: '',
      //   endsWith: '',
      //   startsWith: '',
      //   minWordCount: '',
      //   maxWordCount: ''
      // });

      // console.log('Hello');
      // this.wordFormControl.valueChanges.subscribe(value => {
      //   console.log('Hello!');
      //   const filter = {...value, word: value.word.trim().toLowerCase()} as string;
      //   this.wordCountDataSource.filter = filter;
      // });



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
  //   convertLearnerWordsMapToArray2(): string[] {
  //     this.wordsArray= [];
  //     this.highChartsLines = [];
  //    for (const [key, value] of Object.entries(this.learnerWords)) {
  //      const word = new WordCounts();
  //      word.word = key;
  //      word.count = value;
  //      for(let i = 0; i <= value - 1; i++) {
  //       this.wordsArray.push(key);
  //      }
  //    }
  //    return this.wordsArray;
  //  }

  //  splitIntoColumns(columnHeight: number, array: WordCounts[]): WordCounts[][] {
  //   const columns: WordCounts[][] = [];
  //   for (let i = 0; i < array.length; i += columnHeight) {
  //     columns.push(array.slice(i, i + columnHeight));
  //   }
  //   return columns;
  // }

  // getGridColumnStyle(): string {
  //   return `repeat(${Math.ceil(this.wordCountArray.length / this.columnHeight)}, 1fr)`;
  // }

  sortWordTiles(sortOption: string): void {
    this.currentSortOption = sortOption;

    if (sortOption === 'alphabetic') {
      this.filteredGridListData.sort((a, b) => (a.word > b.word ? 1 : -1));
    } else if (sortOption === 'highest') {
      this.filteredGridListData.sort((a, b) => b.count - a.count);
    } else if (sortOption === 'lowest') {
      this.filteredGridListData.sort((a, b) => a.count - b.count);
    }

    this.cdRef.detectChanges(); // Trigger change detection to update the view
  }
// Function to apply filters and sorting when "See Results" button is clicked
applyFiltersAndSort(): void {
  // Update the filter criteria with the input values
  const filterCriteria = this.gridListFormControl.value;
  this.filteredGridListData = this.wordCountArray.filter(data2 => {
    const a = !filterCriteria.word || data2.word === filterCriteria.word;
    const b = !filterCriteria.endsWith || data2.word.endsWith(filterCriteria.endsWith);
    const c = !filterCriteria.startsWith || data2.word.startsWith(filterCriteria.startsWith);
    const d = !filterCriteria.minWordCount || data2.count >= filterCriteria.minWordCount;
    const e = !filterCriteria.maxWordCount || data2.count <= filterCriteria.maxWordCount;

    return a && b && c && d && e;
  });

  // Apply sorting to the filtered data
  this.sortWordTiles(this.currentSortOption);
}

  // Function to clear filters and sorting when "Clear" button is clicked
  clearFiltersAndSort(): void {
    // Clear filter criteria and reset form controls
    this.gridListFormControl.reset();
    this.filterCriteria = {}; // Reset the filter criteria object

    // Reset sorting
    this.currentSortOption = ''; // Set it to the default option, or you can define another default
    this.sortWordTiles(this.currentSortOption);

    // Clear the filtered data (show all)
    this.filteredGridListData = this.wordCountArray;
  }

  // Modify the existing filter function to call applyFilterAndSort
  applyFilter() {
    this.applyFiltersAndSort();
  }

  // Create a new function to apply sorting
  applySort() {
    // Apply sorting to the filtered data
    this.sortWordTiles(this.currentSortOption);
  }
  toggleGridListExpansion() {
    this.isGridListExpanded = !this.isGridListExpanded;

    // Check if gridListArray exists and has data
    if (this.wordCountArray && this.wordCountArray.length) {
      this.applySort(); // Reapply sorting when expanding/collapsing the grid
    } else {
      console.error('Word count array is empty or undefined.');
    }
  }

  updateTotalSentences() {
    // Example: Count the sentences from the dataSource
    this.totalSentences = this.sentenceDataSource.data.length;
  }




  //   findWord(sentence: string, word: string) {
  //     const split: string[] = sentence.split(' ');
  //     return split.includes(word);
  //  }


  }
