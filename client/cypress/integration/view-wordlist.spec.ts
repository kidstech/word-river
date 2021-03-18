import { ViewWordListPage } from 'cypress/support/view-wordlist.po';

const page = new ViewWordListPage();

describe('View WordList', () => {

    before(() => {
        cy.task('seed:database');
    });

    beforeEach(() => {
        page.navigateTo();
        cy.task('seed:database');
    });

    it('Should load wordlists', () => {
        page.getWordCards().should('have.length', '3');
    });



    it('Should delete a word and then save wordlist', () => {
        page.getWordCards().first().then((card) => {
            page.deleteWordButton().first().click();
            page.saveWordListButton().click();
        });
    });

    it('Should add a word and then click add word button, showing right amount of words', () => {
        page.getWordCards().should('have.length', '3');
        page.addWord({ word: 'Boo', forms: [], type: 'misc' });
        page.getWordCards().should('have.length', '4');
    });
});
