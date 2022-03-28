export class LearnerDataPage {
  navigateTo() {
    return cy.visit('/learners/1203842390/learnerData');
  }

  getWords() {
    return cy.get('[data-test=words]');
  }

  getCounts() {
    return cy.get('[data-test=counts]');
  }

  getWordPaginator() {
    return cy.get('[data-test=wordPaginator');
  }

}
