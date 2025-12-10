// cypress/support/api/produtosService.js

const API_URL = Cypress.env('apiUrl');

export function criarProduto(token, produto) {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/produtos`,
    headers: {
      Authorization: token,
    },
    body: produto,
    failOnStatusCode: false,
  });
}

export function listarProdutos() {
  return cy.request({
    method: 'GET',
    url: `${API_URL}/produtos`,
  });
}

// >>> ESSA FUNÇÃO PRECISA EXISTIR E TER "export function"
export function buscarProdutoPorId(id) {
  return cy.request({
    method: 'GET',
    url: `${API_URL}/produtos/${id}`,
  });
}
