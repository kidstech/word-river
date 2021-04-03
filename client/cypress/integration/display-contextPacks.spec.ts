import { DisplayContextPacksComponent } from '../support/display-contextPacks.po';

const page = new DisplayContextPacksComponent();

describe('Display Context Pack', () => {

    beforeEach(() => {
        page.navigateTo();
        cy.task('seed:database');
    });

    it('Should have 4 context packs', () => {
        page.getCpCards().should('have.length', 4);
    });

    it('Should click "View Context Pack" on a context pack and lead to a valid URL', () => {
        page.getCpCards().first().then((card) => {
            page.clickViewCp(page.getCpCards().first());

            cy.url().should('match', /\/packs\/[0-9a-fA-F]{24}/);

        });
    });

    it('Should click "View Context Pack" on a context pack and have one word list', () => {
      page.getCpCards().first().then((card) => {

          page.clickViewCp(page.getCpCards().first());

          cy.url().should('match', /\/packs\/[0-9a-fA-F]{24}/);

         page.getWordListCards().should('have.length', 1);
      });
    });

    it('Should click add context pack and go to the right URL',() => {
        page.addCpButton().click();
        cy.url().should(url => expect(url.endsWith('/packs/new')).to.be.true);
        cy.get('.add-cp-title').should('have.text', 'New Context Pack');
    });

    it('Should click Delete Context Pack and remove the context pack from the page',() => {
        page.clickDeleteCp(page.getCpCards().first());
        page.getCpCards().should('have.length', 3);

    });
});
