
import { ContextPack } from 'src/app/datatypes/contextPacks';
import { AddContextPackPage } from '../support/add-contextPack.po';
import { WordList } from 'src/app/datatypes/wordlist';

describe('Add Context Pack', () => {
    const page = new AddContextPackPage();

    beforeEach(() => {
        page.navigateTo();
    });

    it('Should have the correct title', () => {
        page.getTitle().should('have.text','New Context Pack');
    });

    it('Should enable and disable the add context pack button', () => {
        page.addContextPackButton().should('be.disabled');
        page.getFormField('name').type('test');
        page.addContextPackButton().should('be.disabled');
        page.getFormField('icon').type('invalid');
        page.addContextPackButton().should('be.disabled');
        page.getFormField('icon').clear().type('image.png');
        page.addContextPackButton().should('be.disabled');

        // Test that button disabled when no enabled option picked
        page.addContextPackButton().should('be.disabled');
        // Select true for enabled
        page.getFormField('enabled').click().then(() => {
            cy.get('#true').click();
        });
        // Button should be enabled
        page.addContextPackButton().should('be.enabled');
        // Switch to False and button should still be enabled
        page.getFormField('enabled').click().then(() => {
          cy.get('#false').click();
      });
        page.addContextPackButton().should('be.enabled');

    });

   it('Should show error messages for invalid inputs', () => {
     //Before doing anything there shouldn't be an error
     cy.get('[data-test=nameError]').should('not.exist');

     //Just clicking the name field without entering anything should cause an error message
     page.getFormField('name').click().blur();
     cy.get('[data-test=nameError]').should('exist').and('be.visible');

     page.getFormField('name').clear().type('This is a very long name that goes beyond the 50 character limit');
     cy.get('[data-test=nameError]').should('exist').and('be.visible');

     //Entering a valid name should remove the error.
     page.getFormField('name').clear().type('Iron Man').blur();
     cy.get('[data-test=nameError]').should('not.exist');


     //Some more tests for various invalid icon inputs
     page.getFormField('icon').type('image.notanimage').blur();
     cy.get('[data-test=iconError]').should('exist').and('be.visible');

     //Entering a valid icon should remove the error
     page.getFormField('icon').type('ironman.png').blur();
     cy.get('[data-test=iconError]').should('not.exist');


   });

   describe('Adding a new context pack', () => {

    beforeEach(() => {
        cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
        const testList: Array<WordList> = [];
        const contextPack: ContextPack = {
            _id: 'meow',
            schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
            name: 'felines',
            icon: 'image.png',
            enabled: false,
            wordlist: testList
        };
        page.addContextPack(contextPack);

        //We should see the confirmation message at the bottom of the screen
        cy.get('.mat-simple-snackbar').should('contain',`Added the ${contextPack.name} context pack successfully`);

        cy.url()
            .should('match', /\/packs\/[0-9a-fA-F]{24}$/)
            .should('not.match', /\/packs\/new$/);


   });
  });

});
