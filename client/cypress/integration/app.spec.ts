import { AppPage } from '../support/app.po';

const page = new AppPage();

describe('App', () => {
  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getAppTitle().should('contain', 'WordRiver');
  });

  it('Should click the home button and navigate to the home page', () => {
    page.getHomeButton();
    cy.url().should('match', /\/$/);
  });

  it('Should go back when the back button is clicked', () => {
    page.navigateToPack();
    page.getBackButton().click();
    cy.url().should('match', /\/$/);
  });

});
