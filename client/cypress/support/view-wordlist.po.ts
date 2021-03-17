import { Word } from 'src/app/datatypes/word';
import { WordList } from 'src/app/datatypes/wordlist';



export class ViewWordListPage {
  navigateTo() {
    return cy.visit('/wordlist/birthday');
  }

  getWordCards() {
      return cy.get('.word-cards-container app-word-card');
  }

  deleteWordListButton() {
    return cy.get('[data-test=deleteWordListButton]');
  }

  deleteWordButton() {
    return cy.get('[data-test=deleteWordButton]');
  }

  saveWordListButton() {
    return cy.get('[data-test=saveWordListButton]');
  }

  clickViewWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
      return card.find<HTMLButtonElement>('[viewWordListButton]').click();
  }

  clickAddWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
      return card.find<HTMLButtonElement>('[addWordListButton]').click();
  }

  clickImportWordList(card: Cypress.Chainable<JQuery<HTMLElement>>) {
      return card.find<HTMLButtonElement>('[importWordListButton]').click();
  }

  addWordButton() {
      return cy.get('[data-test=addWordButton]');
    }
  getWordName() {
      return cy.get(`[data-test=newWord]`);
    }

  selectMatSelectType(type: string) {
      // Find and click the drop down
      return cy.get('#select').click()
        // Select and click the desired value from the resulting menu
        .get(`mat-option[value="${type}"]`).click();
    }
  addWord(newWord) {
      this.getWordName().type(newWord.word);
      this.selectMatSelectType(newWord.type);
      return this.addWordButton().click();
    }
}
