// cypress/e2e/api/api-login.cy.js
import { login } from '../../support/api/authService';

const API_URL = Cypress.env('apiUrl');

describe('API - Login', () => {
  const user = {
    nome: `Usuário Teste ${Date.now()}`,
    email: `usuario_${Date.now()}@teste.com`,
    password: 'teste123',
    administrador: 'true',
  };

  before(() => {
    // cria o usuário que vamos usar no teste de login
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuarios`,
      body: user,
      failOnStatusCode: false,
    }).then((response) => {
      // pode ser 201 (criado) ou 400 se já existir
      expect([201, 400]).to.include(
        response.status,
        `status inesperado ao criar usuário: ${response.status}`,
      );
    });
  });

  it('deve realizar login com sucesso e retornar token', () => {
    login(user.email, user.password).then((response) => {
      expect(response.status, 'status deve ser 200 para login válido').to.eq(200);
      expect(response.body).to.have.property('message', 'Login realizado com sucesso');
      expect(response.body, 'deve retornar authorization com token').to.have.property(
        'authorization',
      );
      expect(response.body.authorization).to.match(/^Bearer\s.+/);
    });
  });

  it('deve retornar erro para credenciais inválidas', () => {
    login('usuario_invalido@teste.com', 'senha_errada').then((response) => {
      expect(response.status, 'status deve ser 401 para login inválido').to.eq(401);
      expect(response.body).to.have.property('message');
    });
  });
});
