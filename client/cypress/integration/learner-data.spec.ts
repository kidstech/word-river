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



});
