import { LearnerDataPage } from 'cypress/support/learner-data.po';

const page = new LearnerDataPage();

describe('Word Count Table', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have words and their counts', () => {
    cy.wait(1000);
    page.getWords().should('have.length', '5');
    page.getCounts().should('have.length', '5');
    page.getWords().first().should('have.text', ' away ');
    page.getCounts().first().should('have.text', ' 1 ');
  });

  it('Should paginate the data', () => {
    page.getWords().should('have.length', '5');
    page.getCounts().should('have.length', '5');

    page.getWordPaginator().find('button.mat-paginator-navigation-next.mat-icon-button')
    .click();

    page.getWords().should('have.length', '3');
    page.getCounts().should('have.length', '3');
    page.getWords().first().should('have.text', ' banana ');
    page.getCounts().first().should('have.text', ' 3 ');

    page.getWordPaginator().find('button.mat-paginator-navigation-previous.mat-icon-button')
    .click();

    page.getWords().should('have.length', '5');
    page.getCounts().should('have.length', '5');

    page.getWordPaginator().find('.mat-select')
    .click().get('mat-option').contains('10').click();

    page.getWords().should('have.length', '8');
    page.getCounts().should('have.length', '8');
  });

  it('Should apply filters', () => {
    //Testing word search field
    page.getWordSearch().type('away');
    page.getWords().first().should('have.text', ' away ');
    page.getWordSearch().clear();

    //Testing starts with field
    page.getStartsWith().type('a');
    page.getWords().should('have.length', '4');
    page.getWords().first().should('have.text', ' away ');
    page.getWords().eq(1).should('have.text', ' apple ');
    page.getWords().eq(2).should('have.text', ' abby ');
    page.getWords().eq(3).should('have.text', ' awesome ');

    //Testing ends with field
    page.getEndsWith().type('y');
    page.getWords().should('have.length', '2');
    page.getWords().first().should('have.text', ' away ');
    page.getCounts().first().should('have.text', ' 1 ');

    page.getWords().eq(1).should('have.text', ' abby ');
    page.getCounts().eq(1).should('have.text', ' 5 ');

    page.getEndsWith().clear();

    //Testing min word count field
    page.getMinWordCount().type('2');
    page.getWords().should('have.length', '3');
    page.getCounts().should('have.length', '3');


    //Testing max word count field
    page.getMaxWordCount().type('4');
    page.getWords().should('have.length', '2');
    page.getWords().first().should('have.text', ' apple ');

    page.getCounts().should('have.length', '2');
    page.getCounts().first().should('have.text', ' 2 ');
    page.getCounts().eq(1).should('have.text', ' 4 ');
  });
});

describe('Sentences Table', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have sentences and their times', () => {
    cy.wait(1000);
    page.getTimesSubmitted().should('have.length', '5');
    page.getSentences().should('have.length', '5');
    page.getSentences().first().should('have.text', ' a active ant at the alphabet ');
    page.getTimesSubmitted().first().should('have.text', ' 3/8/2022 8:28:10 PM ');
  });

  it('Should paginate the data', () => {
    page.getSentences().should('have.length', '5');
    page.getTimesSubmitted().should('have.length', '5');

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
    page.getDateFormField().type('3/9/2022');
    page.getSentences().should('have.length', '3');
    page.getTimesSubmitted().should('have.length', '3');
    page.getSentences().first().should('have.text', ' a big box ate my mean moose ');
    page.getSentences().eq(1).should('have.text', ' The new Batman movie looks really good ');
    page.getSentences().eq(2).should('have.text', ' My Ti-84 calculator is very handy ');

     //Testing Sentence text search
     page.getSentenceFormField().type('Batman');
     page.getSentences().first().should('have.text', ' The new Batman movie looks really good ');
  });

});
