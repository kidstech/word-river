export class AddWordListPage{

    navigateTo() {
        return cy.visit('/wordlist/new');
      }

    getTitle() {
        return cy.get('.add-user-title');
      }

}
