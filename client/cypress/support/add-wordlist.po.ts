import {WordList} from 'src/app/datatypes/wordlist';

export class AddWordListPage{

    navigateTo() {
        return cy.visit('/wordlist/new');

    }

    addWordListButton() {

        return cy.get('[data-test=confirmAddUserButton]');

    }

    getFormField(fieldName: string) {
        return cy.get(`mat-form-field [formcontrolname=${fieldName}]`);
    }

    addWordList(newWordlist: WordList) {
        this.getFormField('name').type(newWordlist.name);
        return this.addWordListButton().click();
    }
}
