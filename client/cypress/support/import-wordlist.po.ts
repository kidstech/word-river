export class ImportWordListPage {
    navigateTo() {
        return cy.visit('/packs/605bc9d893b2d94300a98753/import');
      };
      importButton() {
        return cy.get('[data-test=confirmImportButton]');
      }
      cancelImportButton() {
        return cy.get('[data-test=confirmCancelImportButton]');
      };
}
