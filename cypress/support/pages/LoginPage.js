// cypress/support/pages/LoginPage.js

class LoginPage {
    visit() {
      cy.visit('/'); // baseUrl: https://front.serverest.dev
    }
  
    fillEmail(email) {
      cy.get('[data-testid="email"]').clear().type(email);
    }
  
    fillPassword(password) {
      cy.get('[data-testid="senha"]').clear().type(password);
    }
  
    submit() {
      cy.get('[data-testid="entrar"]').click();
    }
  
    assertAdminHome() {
      // 1) não deve mais estar na tela de login
      cy.url().should('not.include', '/login');
  
      // 2) valida algum elemento típico da área depois do login
      // Se isso der erro, a gente ajusta para o texto real da tela pós-login
      cy.contains(/bem vindo/i).should('exist');
    }
  
    assertLoginError(message) {
      cy.contains(message).should('be.visible');
    }
  }
  
  // exporta UMA instância (singleton)
  export default new LoginPage();
  