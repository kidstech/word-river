import { LearnerDataPage } from 'cypress/support/learner-data.po';

const page = new LearnerDataPage();

describe('Word Count Table', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

/// <reference types="cypress" />

describe('Mat Grid List Filtering and Sorting', () => {
  beforeEach(() => {
    // Visit the page
    cy.visit('http://localhost:4200/learners/1623445108990/learnerData');
  });

  it('should filter and sort words in Mat Grid List', () => {
    // Type filters and assert sorting

    // Type a complete word filter
    cy.get('[data-test="wordSearch"]').type('bacon');

    // Click "See Results" button to apply filters
    cy.get('button[color="primary"]').contains('See Results').click();

    // Add assertions for the filtered and sorted words in the grid list
    cy.get('[data-test="wordTile"]').should('have.length', 1); // Check if there is one grid tile displayed
    cy.get('.mat-grid-tile .word-tile-content').should('contain', 'bacon'); // Check if bacon is displayed

    // Click "Clear" button to reset filters
    cy.get('button[color="warn"]').contains('Clear').click();

    // type a starts with filter
    cy.get('[data-test="startsWith"]').type('b');

    // Click "See Results" button to apply filters
    cy.get('button[color="primary"]').contains('See Results').click();

    // Click to open the mat-select dropdown
    cy.get('[data-test="sortSelect"]').click();

    // Selected highest word count
    cy.get('mat-option').contains('Alphabetic').click();

    // Add assertions for the sorted words
    cy.get('.mat-grid-tile').should('have.length', 5); // Check if there is five word tiles displayed
    cy.get('.mat-grid-tile').first().should('contain', 'bacon'); // Check if bacon is displayed first

    // Clear filters
    cy.get('button[color="warn"]').contains('Clear').click();

    // type an ends with filter
    cy.get('[data-test="endsWith"]').type('a');

    // Click "See Results" button to apply filters
    cy.get('button[color="primary"]').contains('See Results').click();

    // check filtering worked
    cy.get('.mat-grid-tile').should('have.length', 1); // Check that one word is displayed

    // Clear filters
    cy.get('button[color="warn"]').contains('Clear').click();

    // type a min wordcount filter
    cy.get('[data-test="minWordCount"]').type('5');

    // Click "See Results" button to apply filters
    cy.get('button[color="primary"]').contains('See Results').click();

    // check filtering worked
    cy.get('.mat-grid-tile').should('have.length', 18); // Should display 18 words

    // Click to open the mat-select dropdown
    cy.get('[data-test="sortSelect"]').click();

    // Selected highest word count
    cy.get('mat-option').contains('Highest Word Count').click();

    // check if sorting worked
    cy.get('.mat-grid-tile').first().should('contain', 'bacon'); // Check if bacon is displayed first

    // Clear filters
    cy.get('button[color="warn"]').contains('Clear').click();

    // type a max wordcount filter
    cy.get('[data-test="maxWordCount"]').type('1');

    // Click "See Results" button to apply filters
    cy.get('button[color="primary"]').contains('See Results').click();

    // check filtering worked
    cy.get('.mat-grid-tile').should('have.length', 10); // Should display 10 words

    // Click to open the mat-select dropdown
    cy.get('[data-test="sortSelect"]').click();

    // Selected highest word count
    cy.get('mat-option').contains('Lowest Word Count').click();

    // check if sorting worked
    cy.get('.mat-grid-tile').first().should('contain', 'for'); // Check if bacon is displayed first

  });
});
});



//   it('Should have words and their counts', () => {
//     cy.wait(1000);
//     page.getWords().should('have.length', '5');
//     page.getCounts().should('have.length', '5');
//     page.getWords().first().should('have.text', ' away ');
//     page.getCounts().first().should('have.text', ' 1 ');
//   });

//   it('Should paginate the data', () => {
//     page.getWords().should('have.length', '5');
//     page.getCounts().should('have.length', '5');

//     page.getWordPaginator().find('button.mat-paginator-navigation-next.mat-icon-button')
//     .click();

//     page.getWords().should('have.length', '3');
//     page.getCounts().should('have.length', '3');
//     page.getWords().first().should('have.text', ' banana ');
//     page.getCounts().first().should('have.text', ' 3 ');

//     page.getWordPaginator().find('button.mat-paginator-navigation-previous.mat-icon-button')
//     .click();

//     page.getWords().should('have.length', '5');
//     page.getCounts().should('have.length', '5');

//     page.getWordPaginator().find('.mat-select')
//     .click().get('mat-option').contains('10').click();

//     page.getWords().should('have.length', '8');
//     page.getCounts().should('have.length', '8');
//   });

//   it('Should apply filters', () => {
//     //Testing word search field
//     page.getWordSearch().type('away');
//     page.getWords().first().should('have.text', ' away ');
//     page.getWordSearch().clear();

//     //Testing starts with field
//     page.getStartsWith().type('a');
//     page.getWords().should('have.length', '4');
//     page.getWords().first().should('have.text', ' away ');
//     page.getWords().eq(1).should('have.text', ' apple ');
//     page.getWords().eq(2).should('have.text', ' abby ');
//     page.getWords().eq(3).should('have.text', ' awesome ');

//     //Testing ends with field
//     page.getEndsWith().type('y');
//     page.getWords().should('have.length', '2');
//     page.getWords().first().should('have.text', ' away ');
//     page.getCounts().first().should('have.text', ' 1 ');

//     page.getWords().eq(1).should('have.text', ' abby ');
//     page.getCounts().eq(1).should('have.text', ' 5 ');

//     page.getEndsWith().clear();

//     //Testing min word count field
//     page.getMinWordCount().type('2');
//     page.getWords().should('have.length', '3');
//     page.getCounts().should('have.length', '3');

//     //Testing max word count field
//     page.getMaxWordCount().type('4');
//     page.getWords().should('have.length', '2');
//     page.getWords().first().should('have.text', ' apple ');

//     page.getCounts().should('have.length', '2');
//     page.getCounts().first().should('have.text', ' 2 ');
//     page.getCounts().eq(1).should('have.text', ' 4 ');
//   });
// });

describe('Sentences Table', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have sentences and their times', () => {
    cy.wait(1000);
    page.getTimesSubmitted().should('have.length', '6');
    page.getSentences().should('have.length', '6');
    page.getSentences().first().should('have.text', ' a active ant at the alphabet ');
    page.getTimesSubmitted().first().should('have.text', ' 3/8/2022 8:28:10 PM ');
  });

  it('Should paginate the data', () => {
    page.getSentences().should('have.length', '1');
    page.getTimesSubmitted().should('have.length', '1');

    page.getSentencePaginator().find('button.mat-paginator-navigation-next.mat-icon-button')
    .click();

    page.getSentences().should('have.length', '1');
    page.getTimesSubmitted().should('have.length', '1');
    page.getSentences().first().should('have.text', ' My Ti-84 calculator is very handy ');
    page.getTimesSubmitted().first().should('have.text', ' 3/9/2022 8:24:10 PM ');

    page.getSentencePaginator().find('button.mat-paginator-navigation-previous.mat-icon-button')
    .click();

    page.getSentences().should('have.length', '5');
    page.getTimesSubmitted().should('have.length', '5');

    page.getSentencePaginator().find('.mat-select')
    .click().get('mat-option').contains('10').click();

    page.getSentences().should('have.length', '6');
    page.getTimesSubmitted().should('have.length', '6');
  });

  it('Should apply filters', () => {
    //Testing Sentence date search field
    page.getTimesSubmitted().type('3/9/2022');
    page.getSentences().should('have.length', '1');
    page.getTimesSubmitted().should('have.length', '1');
    page.getSentences().first().should('have.text', ' a big box ate my mean moose ');
    page.getSentences().eq(1).should('have.text', ' The new Batman movie looks really good ');
    page.getSentences().eq(2).should('have.text', ' My Ti-84 calculator is very handy ');

     //Testing Sentence text search
     page.getSentenceFormField().type('Batman');
     page.getSentences().first().should('have.text', ' The new Batman movie looks really good ');
  });


})
;
