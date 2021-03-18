import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'WordRiver');
  });

  it('The sidenav should open, navigate to "Users" and back to "Home"', () => {
    // Before clicking on the button, the sidenav should be hidden
    page.getSidenav()
      .should('be.hidden');


    page.getSidenavButton().click()
      .should('be.visible');


    page.getNavLink('Wordlists').click();
    cy.url().should('match', /\/wordlist$/);
    page.getSidenav()
      .should('be.hidden');
  });

});
