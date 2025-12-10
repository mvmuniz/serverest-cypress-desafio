// cypress/e2e/frontend/listar-produtos.cy.js
import LoginPage from '../../support/pages/LoginPage';
import ProductsPage from '../../support/pages/ProductsPage';

/*
Feature: Consulta de produtos pelo administrador

  Scenario: Visualizar lista de produtos
    Given que exista um usuário administrador cadastrado na API
      And o administrador esteja autenticado no frontend
    When ele acessa a opção "Listar Produtos"
    Then a tabela de produtos deve ser exibida
      And deve existir pelo menos um produto cadastrado
*/

describe('Frontend - Listagem de produtos pelo administrador', () => {
  const adminUser = {
    nome: `Admin Lista Produtos ${Date.now()}`,
    email: `admin_lista_${Date.now()}@teste.com`,
    password: 'Admin123!',
    administrador: 'true',
  };

  before(() => {
    // cria usuário admin na API
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: adminUser,
      failOnStatusCode: false,
    }).then((res) => {
      expect(
        [201, 400],
        `status inesperado ao criar admin: ${res.status}`,
      ).to.include(res.status);
    });
  });

  it('deve exibir a lista de produtos após login como admin', () => {
    // login
    LoginPage.visit();
    LoginPage.fillEmail(adminUser.email);
    LoginPage.fillPassword(adminUser.password);
    LoginPage.submit();

    // navega para listagem
    ProductsPage.visitList();

    // garante que há itens na tabela
    ProductsPage.assertListHasProducts();
  });
});
