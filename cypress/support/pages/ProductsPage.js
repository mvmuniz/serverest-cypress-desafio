// cypress/support/pages/ProductsPage.js

class ProductsPage {
  // Já logado como admin
  visitList() {
    // Menu "Listar Produtos"
    cy.contains(/listar produtos/i).click({ force: true });
  }

  openCreateForm() {
    // Botão / link "Cadastrar produto"
    cy.contains(/cadastrar produto/i).click({ force: true });
  }

  fillForm({ nome, preco, descricao, quantidade }) {
    cy.get('[data-testid="nome"]').clear().type(nome);
    cy.get('[data-testid="preco"]').clear().type(preco);
    cy.get('[data-testid="descricao"]').clear().type(descricao);

    // Campo de quantidade por label
    cy.contains('label', /quantidade/i)
      .parent()
      .find('input')
      .clear()
      .type(quantidade);
  }

  submit() {
    // botão de salvar/cadastrar produto
    cy.get('button[type="submit"]').click();
  }

  // usado no admin-produtos.cy.js
  assertSuccess() {
    // depois de salvar, volta para a lista
    cy.url().should('include', '/admin/listarprodutos');
  }

  // usado no admin-produtos.cy.js
  assertProductInList(nome) {
    cy.contains('td', nome).should('be.visible');
  }

  // vamos usar no 3º cenário de frontend
  assertListHasProducts() {
    cy.get('table tbody tr').its('length').should('be.greaterThan', 0);
  }
}

export default new ProductsPage();
