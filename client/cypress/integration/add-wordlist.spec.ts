import { AddWordListPage } from '../support/add-wordlist.po';
import { WordList } from 'src/app/datatypes/wordlist';

describe('Add Wordlist', () => {
  const page = new AddWordListPage();


  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });


  it('Should enable and disable the save button', () => {
    page.addWordListButton().should('be.disabled');
    page.getWordListName().type('sada');
    page.addWordListButton().should('be.enabled');
  });
  it('Should add a word', () => {
    page.addWord({ word: 'Boo', forms: [], type: 'nouns' });
    page.getWordCards().should('have.length', '1');
  });
  it('Should add a wordlist', () => {
    page.addWordList({
      name: 'funpack',
      enabled: true,
      nouns: [{ word: 'clown', forms: ['clowns'] }],
      adjectives: [{ word: 'heavy', forms: ['heavy', 'heavier', 'heavily'] }],
      verbs: [{ word: 'laugh', forms: ['laugh', 'laughing', 'laughed'] }],
      misc: [{ word: 'to', forms: [] }]
    });
    cy.url().should(url => expect(url.endsWith('/packs/605bc9d893b2d94300a98753')).to.be.true);
  });

  it('Should fail to add a duplicate word list', () => {
    page.addWordList({
      name: 'birthday',
      enabled: true,
      nouns: [{ word: 'clown', forms: ['clowns'] }],
      adjectives: [{ word: 'heavy', forms: ['heavy', 'heavier', 'heavily'] }],
      verbs: [{ word: 'laugh', forms: ['laugh', 'laughing', 'laughed'] }],
      misc: [{ word: 'to', forms: [] }]
    });
    cy.get('.mat-simple-snackbar').should('contain',`There is already a Word List with the name birthday in the context pack`);
  });


  it('Should add a field initially', () => {
    page.getInitialButton().click();
    page.getFormItems().should('have.length', '1');
  });
  it('Add form button does not work for empty input', () => {
    page.getInitialButton().click();
    page.getAddFormButton().click();
    page.getFormItems().should('have.length', '1');
  });
  it('Add form works for valid input', () => {
    page.getInitialButton().click();
    page.getFormItems().should('have.length', '1');
    page.getFormField().last().type('sdas');
    page.getAddFormButton().last().click();
    page.getFormItems().should('have.length', '2');
  });
  it('Should remove a form', () => {
    page.getFormField().last().type('sdas');
    page.getAddFormButton().last().click();
    page.getForms().should('have.length', '2');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '1');
  });
  it('Should remove multiple forms', () => {
    page.getFormField().last().type('sample text 1');
    page.getAddFormButton().last().click();
    page.getFormField().last().type('sample text 2');
    page.getAddFormButton().last().click();
    page.getFormField().last().type('sample text 3');
    page.getAddFormButton().last().click();
    page.getForms().should('have.length', '4');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '3');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '2');
    page.getRemoveButton().last().click();
    page.getForms().should('have.length', '1');
  });

});
