export class ImportWordListPage {
    navigateTo() {
        return cy.visit('/wordlist/import');
      };
      importButton() {
        return cy.get('[data-test=confirmImportButton]');
      }
      cancelImportButton() {
        return cy.get('[data-test=confirmCancelImportButton]');
      };
}
