// cypress/support/api/carrinhosService.js

const API_URL = Cypress.env('apiUrl');

/**
 * Cria um carrinho para o usuário autenticado
 * Necessita de token no header Authorization
 */
export function criarCarrinho(body, token) {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/carrinhos`,
    headers: {
      Authorization: token,
    },
    body,
    failOnStatusCode: false,
  });
}

/**
 * Cancela a compra do carrinho atual do usuário autenticado
 * Necessita de token no header Authorization
 */
export function cancelarCarrinho(token) {
  return cy.request({
    method: 'DELETE',
    url: `${API_URL}/carrinhos/cancelar-compra`,
    headers: {
      Authorization: token,
    },
    failOnStatusCode: false,
  });
}
