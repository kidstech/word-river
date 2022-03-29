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
