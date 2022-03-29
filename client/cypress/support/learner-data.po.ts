export class LearnerDataPage {
  navigateTo() {
    return cy.visit('/learners/1203842390/learnerData');
  }

  //Word Table Methods
  getWords() {
    return cy.get('[data-test=words]');
  }

  getCounts() {
    return cy.get('[data-test=counts]');
  }

  getWordPaginator() {
    return cy.get('[data-test=wordPaginator]');
  }

  getWordSearch() {
    return cy.get('[data-test=wordSearch');
  }

  getStartsWith() {
    return cy.get('[data-test=startsWith]');
  }

  getEndsWith() {
    return cy.get('[data-test=endsWith]');
  }

  getMinWordCount() {
    return cy.get('[data-test=minWordCount]');
  }

  getMaxWordCount() {
    return cy.get('[data-test=maxWordCount]');
  }

  //Sentence Table Methods

  getTimesSubmitted() {
    return cy.get('[data-test=timeSubmitted]');
  }

  getSentences() {
    return cy.get('[data-test=sentenceText]');
  }

  getSentencePaginator() {
    return cy.get('[data-test=sentencePaginator]');
  }

}
