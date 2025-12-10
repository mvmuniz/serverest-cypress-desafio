// cypress/e2e/frontend/admin-produtos.cy.js
import LoginPage from '../../support/pages/LoginPage';
import ProductsPage from '../../support/pages/ProductsPage';

/*
Feature: Gestão de produtos pelo administrador

  Scenario: Cadastro de um novo produto com sucesso
    Given que exista um usuário administrador cadastrado na API
      And o administrador esteja autenticado no frontend
    When ele acessa a tela "Listar Produtos"
      And acessa a opção "Cadastrar produto"
      And preenche o formulário com nome, preço, descrição e quantidade válidos
      And confirma o cadastro
    Then deve ser redirecionado para a lista de produtos
      And o novo produto deve aparecer na listagem
*/

describe('Frontend - Cadastro de Produto pelo Administrador', () => {
  const adminUser = {
    nome: `Admin Produtos ${Date.now()}`,
    email: `admin_prod_${Date.now()}@teste.com`,
    password: 'Admin123!',
    administrador: 'true',
  };

  const produto = {
    nome: `Produto Front ${Date.now()}`,
    preco: 999,
    descricao: 'Produto criado via teste E2E no frontend',
    quantidade: 5,
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

  it('deve cadastrar um novo produto com sucesso e exibi-lo na lista', () => {
    // login
    LoginPage.visit();
    LoginPage.fillEmail(adminUser.email);
    LoginPage.fillPassword(adminUser.password);
    LoginPage.submit();

    // fluxo de cadastro
    ProductsPage.visitList();
    ProductsPage.openCreateForm();
    ProductsPage.fillForm(produto);
    ProductsPage.submit();

    // validações
    ProductsPage.assertSuccess();
    ProductsPage.assertProductInList(produto.nome);
  });
});
