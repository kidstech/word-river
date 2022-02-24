export class LoginPage {
    navigateTo() {
        return cy.visit('/');
    }

    loginButton() {
        return cy.get(`[data-test=loginButton]`);
    }
    loginEmail() {
        return cy.get(`[data-test=loginEmail]`);
    }
    loginPassword() {
      return cy.get(`[data-test=loginPassword]`);
    }

    login(){
        this.loginEmail().type('cypresstests@example.com');
        this.loginPassword().type('testing123');
        this.loginButton().click();
    }
}
