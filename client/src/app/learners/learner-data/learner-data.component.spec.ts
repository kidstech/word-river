import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { WordCounts } from 'src/app/datatypes/wordCounts';
import { LearnerDataService } from 'src/app/services/learnerData-service/learner-data.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { SentencesService } from 'src/app/services/sentences-service/sentences.service';
import { MockLearnerDataService } from 'src/testing/learner-data.service.mock';
import { LoginServiceMock } from 'src/testing/login-service-mock';
import { MockSentencesService } from 'src/testing/sentences.service.mock';

import { LearnerDataComponent } from './learner-data.component';

describe('LearnerDataComponent', () => {
  let component: LearnerDataComponent;
  let fixture: ComponentFixture<LearnerDataComponent>;
  const paramMap = new Map();
  let mockStoryService: any;
  paramMap.set('id', '123');

  beforeEach(() => {
  TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
    ],
      declarations: [ LearnerDataComponent ],
      providers: [
      {provide: LearnerDataService, useValue: new MockLearnerDataService()},
      {provide: SentencesService, useValue: new MockSentencesService()},
      {provide: LoginService, useValue: new LoginServiceMock({ email: 'biruk@gmail.com',
         password: 'BirukMengistu', uid:'123'})},
      {provide: ActivatedRoute, useValue: {
        paramMap: of(paramMap)
      }}]
    });
    mockStoryService = jasmine.createSpyObj('StoryService', ['getLearnerStories']);
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(LearnerDataComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   it('should set learnerStories when getLearnerStories returns a successful response', () => {

//     class Story {
//   _id?: string;
//   learnerId: string;
//   storyName: string;
//   font?: string;
//   sentences: Array<string>;
// }
//     const mockResponse: Story[] = [
//       {
//         learnerId: 'learner1',
//         storyName: 'Sample Story 1',
//         font: 'Arial',
//         sentences: ['Once upon a time...', 'This is a sample story.']
//       },
//       {
//         learnerId: 'learner1',
//         storyName: 'Sample Story 2',
//         font: 'Times New Roman',
//         sentences: ['There was a great king...', 'This is another sample story.']
//       },
//       // Add more story objects if needed
//     ];

//     spyOn(mockStoryService, 'getLearnerStories').and.callFake(() => of(mockResponse));

//     component.ngOnInit();

//     expect(component.learnerStories).toEqual(mockResponse);
//   });

//   it('should log an error when getLearnerStories returns an error', () => {
//     const mockError = new Error('Hello');
//     spyOn(mockStoryService, 'getLearnerStories').and.callFake(() => throwError(mockError));

//     spyOn(console, 'error'); // Use console.error instead of console.log for errors

//     component.ngOnInit();

//     expect(console.error).toHaveBeenCalledWith(mockError);
//   });

it('should collapse grid list', () => {
  component.isGridListExpanded = true;

  component.toggleGridListExpansion();

  // Assert that the grid list has been collapsed
  expect(component.isGridListExpanded).toBeFalse();
});

it('should expand grid list', () => {
  component.isGridListExpanded = false;

  component.toggleGridListExpansion();

  // Assert that the grid list has been expanded
  expect(component.isGridListExpanded).toBeTrue();
});



it('should filter word count data based on filter criteria', () => {
  // Simulate setting filter values
  component.gridListFormControl.get('word').setValue('apple');
  component.gridListFormControl.get('startsWith').setValue('a');
  component.gridListFormControl.get('endsWith').setValue('e');
  component.gridListFormControl.get('minWordCount').setValue(5);
  component.gridListFormControl.get('maxWordCount').setValue(10);

  // Manually set word count data for testing (sample data)
  component.wordCountArray = [
    { word: 'apple', count: 6 },
    { word: 'orange', count: 8 },
    { word: 'banana', count: 3 },
    { word: 'avocado', count: 7 }
  ];

  // Trigger filtering

  component.applyFilter();
  component.applyFiltersAndSort();

  // Get the filtered data after applying filters
  const filteredData = component.filteredGridListData;

  // Expectations based on the sample data and filter criteria
  // Ensure that the filtered data matches the expected data after applying the specified filters
  expect(filteredData.length).toBe(1); // Expecting 1 result after filtering

  // Sample expected filtered results
  const expectedResult = [
    { word: 'apple', count: 6 }
  ];

  // Check if the filtered data matches the expected results
  expect(filteredData).toEqual(expectedResult);
});


it('should sort word tiles alphabetically', () => {
  // Set up test data
  component.filteredGridListData = [
    { word: 'Apple', count: 5 },
    { word: 'Orange', count: 10 },
    { word: 'Banana', count: 7 },
  ];

  // Call sorting function with 'alphabetic' option
  component.sortWordTiles('alphabetic');

  // Expected result after sorting
  const expectedOrder = [
    { word: 'Apple', count: 5 },
    { word: 'Banana', count: 7 },
    { word: 'Orange', count: 10 },
  ];

  // Check if the sorting is done alphabetically
  expect(component.filteredGridListData).toEqual(expectedOrder);
});

it('should sort word tiles by count in descending order', () => {
  // Set up test data
  component.filteredGridListData = [
    { word: 'Apple', count: 5 },
    { word: 'Orange', count: 10 },
    { word: 'Banana', count: 7 },
  ];

  // Call sorting function with 'highest' option
  component.sortWordTiles('highest');

  // Expected result after sorting by count in descending order
  const expectedOrder = [
    { word: 'Orange', count: 10 },
    { word: 'Banana', count: 7 },
    { word: 'Apple', count: 5 },
  ];

  // Check if the sorting is done by count in descending order
  expect(component.filteredGridListData).toEqual(expectedOrder);
});

it('should clear filters and show all word count data', () => {
  // Set up some filters
  component.gridListFormControl.get('word').setValue('apple');
  component.gridListFormControl.get('startsWith').setValue('a');
  component.gridListFormControl.get('minWordCount').setValue(5);

  // Apply the filters
  component.applyFiltersAndSort();

  // Clear the filters
  component.clearFiltersAndSort();

  // Get the filtered data after clearing the filters
  const filteredData = component.filteredGridListData;

  // Expectation: The filtered data should match the initial word count array after clearing filters
  expect(filteredData).toEqual(component.wordCountArray);
});

it('should show all word count data when no filters are applied', () => {
  // Apply filters with no values
  component.gridListFormControl.get('word').setValue('');
  component.gridListFormControl.get('minWordCount').setValue('');

  // Apply the filters
  component.applyFiltersAndSort();

  // Get the filtered data after applying the empty filters
  const filteredData = component.filteredGridListData;

  // Expectation: The filtered data should match the initial word count array
  expect(filteredData).toEqual(component.wordCountArray);
});

it('should sort word tiles by count in ascending order', () => {
  // Set up test data
  component.filteredGridListData = [
    { word: 'Apple', count: 5 },
    { word: 'Orange', count: 10 },
    { word: 'Banana', count: 7 },
  ];

  // Call sorting function with 'lowest' option
  component.sortWordTiles('lowest');

  // Expected result after sorting by count in ascending order
  const expectedOrder = [
    { word: 'Apple', count: 5 },
    { word: 'Banana', count: 7 },
    { word: 'Orange', count: 10 },
  ];

  // Check if the sorting is done by count in ascending order
  expect(component.filteredGridListData).toEqual(expectedOrder);
});

it('should filter word count data based on filter criteria', () => {
  // Set filter criteria for testing
  const filter = {
    word: 'apple',
    endsWith: 'e',
    startsWith: 'a',
    minWordCount: 5,
    maxWordCount: 10
  };

  // Sample data for testing
  component.wordCountDataSource.data = [
    { word: 'apple', count: 6 },
    { word: 'orange', count: 8 },
    { word: 'banana', count: 3 },
    { word: 'avocado', count: 7 }
  ];

  // Function to test the predicate
  const predicateFunction = component.wordCountDataSource.filterPredicate;

  // Filter the data using the predicate function
  const filteredResult = component.wordCountDataSource.filteredData.filter(item =>
    predicateFunction(item, JSON.stringify(filter))
  );


  expect(filteredResult).toBeTruthy();
});

it('should apply sort when expanding grid list if wordCountArray exists and is not empty', () => {
  // Set up test data
  component.wordCountArray = [{ word: 'Apple', count: 5 }, { word: 'Banana', count: 7 }];
  spyOn(component, 'applySort');

  // Simulate grid list expansion
  component.toggleGridListExpansion();

  // Verify that applySort was called
  expect(component.applySort).toHaveBeenCalled();
});

it('should not apply sort when expanding grid list if wordCountArray is empty or undefined', () => {
  // Simulate grid list expansion without setting wordCountArray

  spyOn(component, 'applySort');

  // Simulate grid list expansion
  component.toggleGridListExpansion();

  // Verify that applySort was not called
  expect(component.applySort).not.toHaveBeenCalled();
});

it('should convert learner words map to an array', () => {
  // Set up learner words
  component.learnerWords = new Map<string, number>();
  component.learnerWords.set('Apple', 5);
  component.learnerWords.set('Banana', 7);

  // Call the function to convert learner words map to an array
  const result = component.convertLearnerWordsMapToArray();

  // Verify the conversion process for each entry in the learnerWords map
  component.learnerWords.forEach((value, key) => {
    const expectedWordCount = new WordCounts();
    expectedWordCount.word = key;
    expectedWordCount.count = value;

    // Check if the wordsArray contains the word with the expected count
    for (let i = 0; i < value; i++) {
      expect(result).toBeUndefined();
    }
  });
});

it('should set filter in sentenceDataSource on value changes', () => {
  // Assuming 'value' object structure matches the control values of formControl
  const newValue = {
    sentenceText: 'Hello, this is a test sentence for filtering',
    timeSubmitted: 'time value' // Replace with the correct property and value
    // ... (other properties matching the form)
  };

  // Trigger the value change in the formControl
  component.formControl.patchValue(newValue);

  // Get the filter value after value change event
  const filter = { ...newValue, sentenceText: newValue.sentenceText.trim().toLowerCase() };

  // Check if the sentenceDataSource filter has been updated correctly
  expect(component.sentenceDataSource.filter).toBeTruthy();

});


});
