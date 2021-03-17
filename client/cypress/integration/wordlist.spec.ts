import { WordListPage } from '../support/wordlist.po';

const page = new WordListPage();

describe('WordList', () => {

    before(() => {
        cy.task('seed:database');
    });

    beforeEach(() => {
        page.navigateTo();
    });

    it('Should load wordlists', () => {
        page.getWordListCards().should('have.length', '1');
    });

    it('Should click view wordlist on a wordlist and go to the right URL', () => {
        page.getWordListCards().first().then((card) => {
          // When the view wordlist button on the first wordlist card is clicked, the URL should have a valid mongo ID
          page.clickViewWordList(page.getWordListCards().first());
          // The URL should be '/users/' followed by a mongo ID
          cy.url().should('match', /\/wordlist\/[0-9a-fA-F]{24}$/);
        });
    });

    it('Should click add wordlist and go to the right URL', () => {
        // Click on the button for adding a new wordlist
        page.addWordListButton().click();
        // The URL should end with '/wordlist/new'
        cy.url().should(url => expect(url.endsWith('/wordlist/new')).to.be.true);

    });

    it('Should click import wordlist and go to the right URL', () => {
        // Click on the button for importing a new word
        page.importWordListButton().click();
        // The URL should end with '/wordlist/import'
        cy.url().should(url => expect(url.endsWith('/wordlist/import')).to.be.true);
    });

});
