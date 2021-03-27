import { ViewWordListPage } from 'cypress/support/view-wordlist.po';

const page = new ViewWordListPage();

describe('View WordList', () => {

  const t = '4';

    before(() => {
        cy.task('seed:database');
    });

    beforeEach(() => {
        page.navigateTo();
    });

    it('Should load wordlists', () => {
        page.getWordCards().should('have.length', '10');
    });

    it('Should add a word and then click add word button, showing right amount of words', () => {
        page.getWordCards().should('have.length', '10');
        page.addWord({ word: 'Boo', forms: [], type: 'misc' });
        page.getWordCards().should('have.length', '11');
    });

    it('Should delete a word and then save wordlist', () => {
        page.getWordCards().should('have.length', '10');
        page.deleteWordButton().eq(1).click();
        page.saveWordListButton().click({force: true});
        page.navigateTo();
        cy.wait(1000);
        page.getWordCards().should('have.length', '9');
    });

});
