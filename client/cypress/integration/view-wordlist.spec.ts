import { ViewWordListPage } from 'cypress/support/view-wordlist.po';

const page = new ViewWordListPage();

describe('View WordList', () => {

    before(() => {
        cy.task('seed:database');
    });

    beforeEach(() => {
        page.navigateTo();
    });

    it('Should load wordlists', () => {
        page.getWordCards().should('have.length', '1');
    });

    it('Should click delete and return to main page', () => {
        page.deleteWordListButton().click();
        cy.url().should(url => expect(url.endsWith('/wordlist')).to.be.true);
    });

    it('Should delete a word and then save wordlist', () => {
        page.getWordCards().first().then((card) => {
            page.deleteWordButton().first().click();
            page.saveWordListButton().click();
        });
    });

    it('Should add a word and then click add word button', () => {
        page.getWordCards().should('have.length', '1');
        page.addWord({ word: 'Boo', forms: [], type: 'nouns' });
        page.addWordButton().click();
        page.getWordCards().should('have.length', '2');
    });


});
