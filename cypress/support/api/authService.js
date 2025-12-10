// cypress/support/api/authService.js

const API_URL = Cypress.env('apiUrl');

export function login(email, password) {
  return cy.request({
    method: 'POST',
    url: `${API_URL}/login`,
    body: {
      email,
      password,
    },
    failOnStatusCode: false, // deixa o teste decidir se é erro
  });
}
