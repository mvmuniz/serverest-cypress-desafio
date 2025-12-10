// cypress/e2e/api/api-produtos.cy.js
import { login } from '../../support/api/authService';
import { criarProduto, listarProdutos } from '../../support/api/produtosService';

const API_URL = Cypress.env('apiUrl');

describe('API - Produtos', () => {
  let token;

  before(() => {
    // login como administrador para obter token
    const user = {
      nome: `Admin Produtos ${Date.now()}`,
      email: `admin_prod_${Date.now()}@teste.com`,
      password: 'teste123',
      administrador: 'true',
    };

    // garante que o usuário exista
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuarios`,
      body: user,
      failOnStatusCode: false,
    }).then((resUser) => {
      expect([201, 400]).to.include(resUser.status);
    });

    // faz login e guarda o token
    login(user.email, user.password).then((resLogin) => {
      expect(resLogin.status).to.eq(200);
      token = resLogin.body.authorization;
    });
  });

  it('deve criar produto com sucesso e listar na API', () => {
    const nome = `Produto API ${Date.now()}`;
    const novoProduto = {
      nome,
      preco: 1000,
      descricao: 'Produto criado via teste automatizado de API',
      quantidade: 3,
    };

    criarProduto(token, novoProduto).then((resCriacao) => {
      expect(resCriacao.status, 'status deve ser 201 ao criar produto').to.eq(201);
      expect(resCriacao.body).to.have.property('message');
      expect(resCriacao.body).to.have.property('_id');
    });

    listarProdutos().then((resLista) => {
      expect(resLista.status).to.eq(200);
      const encontrado = resLista.body.produtos.find((p) => p.nome === nome);
      expect(encontrado, 'produto criado deve existir na listagem').to.exist;
    });
  });

  it('deve retornar erro ao tentar criar produto duplicado', () => {
    const nomeDuplicado = `Duplicado ${Date.now()}`;

    const produtoBase = {
      nome: nomeDuplicado,
      preco: 500,
      descricao: 'Produto base para teste de duplicidade',
      quantidade: 1,
    };

    // cria o primeiro produto
    criarProduto(token, produtoBase).then((resCriacao) => {
      expect(resCriacao.status).to.eq(201);
    });

    // tenta criar o mesmo produto de novo
    criarProduto(token, produtoBase).then((resDuplicado) => {
      expect([400, 409], 'status de erro esperado para duplicidade').to.include(
        resDuplicado.status,
      );
      expect(resDuplicado.body).to.have.property('message');
    });
  });
});
