// cypress/e2e/frontend/login-admin.cy.js
import LoginPage from '../../support/pages/LoginPage';

/*
Feature: Login do administrador

  Scenario: Login com credenciais válidas
    Given que exista um usuário administrador cadastrado na API
    When o administrador acessa a página de login do ServeRest
      And informa um e-mail e senha válidos
      And clica no botão "Entrar"
    Then deve ser redirecionado para a área administrativa
      And deve visualizar os menus da área de administração
*/

describe('Frontend - Login Administrador', () => {
  const adminUser = {
    nome: `Admin Cypress ${Date.now()}`,
    email: `admin_${Date.now()}@teste.com`,
    password: 'Admin123!',
    administrador: 'true',
  };

  before(() => {
    // cria usuário admin via API
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: adminUser,
      failOnStatusCode: false,
    }).then((res) => {
      expect(
        [201, 400],
        `status inesperado ao criar usuário: ${res.status}`,
      ).to.include(res.status);
    });
  });

  it('deve realizar login como administrador com sucesso', () => {
    LoginPage.visit();
    LoginPage.fillEmail(adminUser.email);
    LoginPage.fillPassword(adminUser.password);
    LoginPage.submit();
    LoginPage.assertAdminHome();
  });
});
