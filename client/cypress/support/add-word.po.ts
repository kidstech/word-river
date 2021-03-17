import { Word } from 'src/app/datatypes/word';

export class AddWordPage{

    navigateTo() {
        return cy.visit('/wordlist/name');
      }

    getFormField(fieldName: string) {
        return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
      }

    addWordButton() {
        return cy.get('[data-test=confirmAddWordButton]');
      }
    selectMatSelectValue(select: Cypress.Chainable, value: string) {
        // Find and click the drop down
        return select.click()
          // Select and click the desired value from the resulting menu
          .get(`mat-option[value="${value}"]`).click();
      }
}
