export class WordListPage {
    navigateTo() {
      return cy.visit('/packs/605bc9d893b2d94300a98753');
    }


    getWordListCards() {
        return cy.get('.wordlist-cards');
    }

    getCpCards() {
        return cy.get('.context-pack-display app-cp-card');
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

    clickDeleteContextPack() {
        return cy.get('[data-test=deleteContextPackButton]');
    }

    getDeleteContextPackConfirmation() {
        return cy.get('.confirmation');
    }

    getDeleteContextPackConfirmationCancel() {
        return cy.get('[data-test=cancel-delete]');
    }

    getDeleteContextPackConfirmDeleteButton() {
        return cy.get('[data-test=deleteContextPackConfirmationButton]');
    }
}
