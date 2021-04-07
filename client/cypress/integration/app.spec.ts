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

  it('Should go back to home page when back button is clicked from add context pack', () => {
    page.navigateToContextPackNew();
    page.getBackButton().click();
    cy.url().should('match', /\/$/);
  });

  it('Should go back to home page when back button is clicked from display wordlists', () => {
    page.navigateToPack();
    page.getBackButton().click();
    cy.url().should('match', /\/$/);
  });

  it('Should go back to context pack page when back button is clicked from view wordlist', () => {
    page.navigateToViewWordList();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });

  it('Should go back to the contextPack page when back button is clicked from import wordlist', () => {
    page.navigateToImportPage();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });
  it('Should go back to contextpack page when back button is clicked from add wordlist', () => {
    page.navigateToAddWordList();
    page.getBackButton().click();
    cy.url().should('match', /^(http:\/\/|https:\/\/)localhost:.{1,5}\/?packs\/.{24}\/?$/g);
  });

});
