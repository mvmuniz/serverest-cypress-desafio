// cypress/e2e/api/api-carrinhos.cy.js
import { login } from '../../support/api/authService';
import {
  criarProduto,
  listarProdutos,
} from '../../support/api/produtosService';
import {
  criarCarrinho,
  cancelarCarrinho,
} from '../../support/api/carrinhosService';

const API_URL = Cypress.env('apiUrl');

describe('API - Carrinhos', () => {
  let token;

  before(() => {
    // cria usuário admin para gerenciar produtos e carrinho
    const admin = {
      nome: `Admin Carrinho ${Date.now()}`,
      email: `admin_carrinho_${Date.now()}@teste.com`,
      password: 'teste123',
      administrador: 'true',
    };

    // garante usuário cadastrado
    cy.request({
      method: 'POST',
      url: `${API_URL}/usuarios`,
      body: admin,
      failOnStatusCode: false,
    }).then((resUser) => {
      expect([201, 400]).to.include(
        resUser.status,
        `status inesperado ao criar usuário: ${resUser.status}`,
      );
    });

    // faz login e guarda token
    login(admin.email, admin.password).then((resLogin) => {
      expect(resLogin.status).to.eq(200);
      token = resLogin.body.authorization;
    });
  });

  it('deve criar carrinho e cancelar devolvendo o estoque do produto', () => {
    const nomeProduto = `Produto Carrinho ${Date.now()}`;
    const produto = {
      nome: nomeProduto,
      preco: 200,
      descricao: 'Produto para teste de carrinho',
      quantidade: 10,
    };

    let produtoId;
    let estoqueInicial;

    // 1) cria o produto
    criarProduto(token, produto).then((resCriacao) => {
      expect(resCriacao.status, 'status ao criar produto').to.eq(201);
    });

    // 2) busca o produto recém-criado pela listagem
    listarProdutos()
      .then((resLista) => {
        expect(resLista.status).to.eq(200);

        const encontrado = resLista.body.produtos.find(
          (p) => p.nome === nomeProduto,
        );

        expect(encontrado, 'produto criado deve existir na listagem').to.exist;

        produtoId = encontrado._id;
        estoqueInicial = encontrado.quantidade;

        // 3) cria carrinho com quantidade 2 (usa token)
        return criarCarrinho(
          {
            produtos: [
              {
                idProduto: produtoId,
                quantidade: 2,
              },
            ],
          },
          token,
        );
      })
      .then((resCarrinho) => {
        expect(resCarrinho.status, 'status ao criar carrinho').to.eq(201);
        expect(resCarrinho.body).to.have.property('message');

        // 4) confere que estoque diminuiu
        return listarProdutos();
      })
      .then((resDepoisCarrinho) => {
        const produtoDepois = resDepoisCarrinho.body.produtos.find(
          (p) => p._id === produtoId,
        );

        expect(produtoDepois, 'produto deve existir após criar carrinho').to
          .exist;
        expect(
          produtoDepois.quantidade,
          'estoque deve diminuir após criar carrinho',
        ).to.eq(estoqueInicial - 2);

        // 5) cancela compra (usa token)
        return cancelarCarrinho(token);
      })
      .then((resCancel) => {
        expect(resCancel.status, 'status ao cancelar carrinho').to.eq(200);
        expect(resCancel.body).to.have.property('message');

        // 6) confere que estoque voltou ao original
        return listarProdutos();
      })
      .then((resFinal) => {
        const produtoFinal = resFinal.body.produtos.find(
          (p) => p._id === produtoId,
        );

        expect(produtoFinal, 'produto deve existir após cancelar carrinho').to
          .exist;
        expect(
          produtoFinal.quantidade,
          'estoque deve voltar ao valor inicial após cancelamento',
        ).to.eq(estoqueInicial);
      });
  });
});
