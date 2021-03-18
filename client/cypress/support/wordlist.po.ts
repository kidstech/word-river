export class WordListPage {
    navigateTo() {
      return cy.visit('/wordlist');
    }

    getWordListCards() {
        return cy.get('.wordlist-cards');
    }

    clickViewWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[data-test=viewWordListButton]').click();
    }

    clickAddWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[data-test=addWordListButton]').click();
    }

    clickImportWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
        return card.find<HTMLButtonElement>('[data-test=importWordListButton]').click();
    }

    addWordListButton() {
        return cy.get('[data-test=addWordListButton]');
      }

    importWordListButton() {
        return cy.get('[data-test=importWordListButton]');
      }
}
