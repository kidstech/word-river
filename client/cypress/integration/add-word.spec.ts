import { AddWordPage } from '../support/add-word.po';
import { Word } from 'src/app/datatypes/word';

describe('Add Word', () => {

    const page = new AddWordPage();

    beforeEach(() => {
        page.navigateTo();
    });

    it('Add word should be disabled', () => {

        page.addWordButton().should('be.disabled');

      });




});
