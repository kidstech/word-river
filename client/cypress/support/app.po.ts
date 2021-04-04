export class AppPage {
  navigateTo() {
    return cy.visit('/');
  }

  navigateToPack() {
    return cy.visit('/packs/604cdf3c63292e16753345f8');
  }

  getAppTitle() {
    return cy.get('.app-title');
  }

  getHomeButton() {
    return cy.get('[data-test=home-button]');
  }

  getBackButton() {
    return cy.get('[data-test=back-button]');
  }


}
