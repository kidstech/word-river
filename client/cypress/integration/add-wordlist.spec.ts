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
    cy.url().should(url => expect(url.endsWith('/wordlist')).to.be.true);
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
    page.getFormField().type('sdas');
    page.getAddFormButton().last().click();
    page.getFormItems().should('have.length', '2');
  });

});
