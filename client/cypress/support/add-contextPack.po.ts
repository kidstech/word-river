import { count } from 'console';
import {ContextPack} from 'src/app/datatypes/contextPacks';

export class AddContextPackPage {
  navigateTo() {
    return cy.visit('/packs/new');
  }

  getTitle() {
    return cy.get('.add-cp-title');
  }

  addContextPackButton() {
    return cy.get('[data-test=addCpButton]');
    }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
    // Select and click the desired value from the resulting menu
      .get(`mat-option[value="${value}"]`).click();
  }
  getFormField(fieldName: string) {
    return cy.get(`mat-form-field [formcontrolname=${(fieldName)}]`);
  }

  addContextPack(newContextPack: ContextPack) {
    this.getFormField('name').type(newContextPack.name);
    this.getFormField('icon').type(newContextPack.icon);
    this.selectMatSelectValue(this.getFormField('enabled'), newContextPack.enabled.toString());
    return this.addContextPackButton().click();
  }

  navigateToHome() {
    return cy.visit('/');
  }

  getCpCards() {
   return cy.get('.context-pack-display app-cp-card');
  }

  getUploadButton() {
    return cy.get('[data-test=upload-image]');
  }
}
