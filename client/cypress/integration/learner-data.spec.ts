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

    page.getWords().should('have.length', '1');
    page.getCounts().should('have.length', '1');
    page.getWords().first().should('have.text', ' banana ');
    page.getCounts().first().should('have.text', ' 3 ');

    page.getWordPaginator().find('button.mat-paginator-navigation-previous.mat-icon-button')
    .click();

    page.getWords().should('have.length', '5');
    page.getCounts().should('have.length', '5');

    page.getWordPaginator().find('.mat-select')
    .click().get('mat-option').contains('10').click();

    page.getWords().should('have.length', '6');
    page.getCounts().should('have.length', '6');

  });



});
