import { ViewWordListPage } from 'cypress/support/view-wordlist.po';

const page = new ViewWordListPage();

describe('View WordList GridView', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should load wordlists', () => {
    page.getWordCards().should('have.length', '10');
  });

  it('Should bring up the delete confirmation', () => {
    page.toggleConfirmationButton().click();
    cy.get('.confirmation').should('have.length', '1');
  });

  it('Should close the delete confirmation', () => {
    page.toggleConfirmationButton().click();
    cy.get('.confirmation').should('have.length', '1');
    page.cancelConfirmationButton().click();
    cy.get('.confirmation').should('not.exist');
  });

  it('Should add a word and then click add word button, showing right amount of words', () => {
    page.getWordCards().should('have.length', '10');
    page.addWord({ word: 'Boo', forms: [], type: 'misc' });
    page.getWordCards().should('have.length', '11');
  });

  it('Should type a word and get a suggestion', () => {
    page.getWordCards().should('have.length', '10');
    page.typeWord({ word: 'Chicken', forms: [], type: 'noun' });
    cy.wait(2000);
    page.addWordButton().should('be.enabled');
  });

  it('Should delete a word', () => {
    page.getWordCards().should('have.length', '10');
    cy.get('.wordgridcards').first().trigger('mouseover');
    page.deleteWordButton().eq(1).click({ force: true });
    page.getWordCards().should('have.length', '9');
  });

  it('Should save wordlist', () => {
    page.saveWordListButton().click({ force: true });
    page.navigateTo();
  });

});

describe('View WordList ListView', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should load word cards', () => {
    page.getToggleButton().click();
    page.getWordCardsList().should('have.length', '10');
  });

  it('Should bring up the delete confirmation', () => {
    page.getToggleButton().click();
    page.toggleConfirmationButton().click();
    cy.get('.confirmation').should('have.length', '1');
  });

  it('Should close the delete confirmation', () => {
    page.getToggleButton().click();
    page.toggleConfirmationButton().click();
    cy.get('.confirmation').should('have.length', '1');
    page.cancelConfirmationButton().click();
    cy.get('.confirmation').should('not.exist');
  });

  it('Should add a word and then click add word button, showing right amount of words', () => {
    page.getToggleButton().click();
    page.getWordCardsList().should('have.length', '10');
    page.addWord({ word: 'Boo', forms: [], type: 'misc' });
    page.getWordCardsList().should('have.length', '11');
  });

  it('Should delete a word', () => {
    page.getToggleButton().click();
    page.getWordCardsList().should('have.length', '10');
    cy.get('.wordlistcards').first().trigger('mouseover');
    page.deleteWordButton().eq(1).click({ force: true });
    page.getWordCardsList().should('have.length', '9');
  });

  it('Should save wordlist', () => {
    page.getToggleButton().click();
    page.saveWordListButton().click({ force: true });
    page.navigateTo();
  });

});
