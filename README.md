
# ServeRest – Desafio de Automação de Testes E2E

Este projeto apresenta uma solução de automação de testes End-to-End (E2E) para a plataforma ServeRest (API e Frontend), utilizando Cypress e boas práticas de organização de testes.

---

## 1. Detalhes Técnicos do Projeto

| Componente              | Especificação              |
|-------------------------|----------------------------|
| Framework de Testes     | Cypress 13.13.2            |
| Ambiente de Execução    | Node.js 18.x               |
| Linguagem de Programação| JavaScript                 |
| API testada             | https://serverest.dev      |
| Frontend testado        | https://front.serverest.dev |

---

## 2. Escopo da Automação

O projeto cobre **6 cenários de teste** principais para validação dos fluxos críticos da aplicação.

### 2.1. Visão Geral

| Tipo de Teste | Quantidade | Descrição                                                                 |
|---------------|-----------:|---------------------------------------------------------------------------|
| API           | 3 cenários | Validação de endpoints de Login, Produtos e Carrinhos                    |
| Frontend      | 3 cenários | Fluxos de Login, Administração de Produtos e Listagem de Produtos (UI)   |

### 2.2. Padrões e Metodologias

- **Page Object Model (POM)** no frontend  
  - Classes em `cypress/support/pages` encapsulam seletores e ações de tela.
  - Facilita manutenção e reaproveitamento de código entre os cenários.

- **Service Layer para API**  
  - Módulos em `cypress/support/api` centralizam as chamadas HTTP (login, produtos, carrinhos).
  - Simplifica os testes, deixando a lógica de request isolada.

- **Cenários descritos em Gherkin (comentado)**  
  - Nos testes de frontend, cada spec inicia com um bloco em formato Given/When/Then dentro de comentário:
    ```js
    /*
      Feature: ...
        Scenario: ...
          Given ...
          When ...
          Then ...
    */
    ```
  - Isso documenta o objetivo de negócio de cada teste sem exigir configuração extra de Cucumber.

---

## 3. Estrutura de Diretórios

A estrutura segue o padrão do Cypress, separando testes E2E de módulos de suporte:

```text
serverest-cypress-desafio/
├─ cypress/
│  ├─ e2e/
│  │  ├─ api/               # Testes de API
│  │  │  ├─ api-login.cy.js
│  │  │  ├─ api-produtos.cy.js
│  │  │  └─ api-carrinhos.cy.js
│  │  └─ frontend/          # Testes de frontend (UI)
│  │     ├─ login-admin.cy.js
│  │     ├─ admin-produtos.cy.js
│  │     └─ listar-produtos.cy.js
│  ├─ support/
│  │  ├─ api/               # Serviços para requisições HTTP
│  │  │  ├─ authService.js
│  │  │  ├─ produtosService.js
│  │  │  └─ carrinhosService.js
│  │  └─ pages/             # Page Objects do frontend
│  │     ├─ LoginPage.js
│  │     └─ ProductsPage.js
├─ cypress.config.js        # Configuração global do Cypress
├─ package.json             # Dependências e scripts do projeto
└─ package-lock.json        # Versões exatas das dependências




4. Instruções de Configuração e Execução
## 4.1. Pré-requisitos

Para configurar e executar o projeto, é necessário ter instalado:

Node.js (versão 18+)

npm (já incluso na instalação do Node.js)

Git

**4.2. Instalação**

No terminal, navegue até o diretório do projeto e execute:

npm install


Isso instalará todas as dependências listadas no package.json.

## 4.3. Execução dos Testes
### 4.3.1. Modo Interativo (Cypress Test Runner UI)

Indicado para desenvolvimento e debugging:

npx cypress open


Em seguida:

Selecionar E2E Testing

Escolher o navegador

Rodar os testes nas pastas:

cypress/e2e/api

cypress/e2e/frontend

## 4.3.2. Modo Headless (Linha de Comando)

Indicado para execução em lote e uso em pipelines de CI/CD.

Executar todos os testes:

npx cypress run


Executar somente testes de API:

npx cypress run --spec "cypress/e2e/api/**/*.cy.js"


Executar somente testes de frontend:

npx cypress run --spec "cypress/e2e/frontend/**/*.cy.js"

**5. Cenários Implementados**
## ### 5.1. API
### 5.1.1. Autenticação – Login

Arquivo: cypress/e2e/api/api-login.cy.js

Service: cypress/support/api/authService.js

Cenários:

Login com credenciais válidas

Cria usuário na API

Envia POST /login com e-mail e senha válidos

Valida:

status 200

mensagem de sucesso

campo authorization presente no corpo da resposta

Login com credenciais inválidas

Envia POST /login com senha incorreta

Valida:

status 401

mensagem de erro indicando credenciais inválidas

## 5.1.2. Produtos

Arquivo: cypress/e2e/api/api-produtos.cy.js

Service: cypress/support/api/produtosService.js

Cenários:

Criação de produto com sucesso

Faz login como administrador

Envia POST /produtos

Valida:

status 201

dados do produto retornados

Envia GET /produtos

Valida que o produto aparece na listagem

Tentativa de criação de produto duplicado

Tenta criar novamente o mesmo produto

Valida:

status de erro (ex.: 400)

mensagem indicando produto já cadastrado

## 5.1.3. Carrinhos

Arquivo: cypress/e2e/api/api-carrinhos.cy.js

Service: cypress/support/api/carrinhosService.js

Cenário:

Criação de carrinho e cancelamento devolvendo estoque

Cria usuário e faz login (obtém token)

Cria produto com quantidade inicial conhecida

Envia POST /carrinhos com esse produto

Valida:

criação do carrinho

redução do estoque após a criação

Envia DELETE /carrinhos/cancelar-compra

Valida:

cancelamento bem-sucedido

estoque retornando ao valor original

## 5.2. Frontend

Os testes de frontend utilizam:

LoginPage.js – ações de login

ProductsPage.js – ações de listagem e cadastro de produtos

Cada spec de frontend possui, no topo, um bloco Gherkin em comentário descrevendo o cenário em Given/When/Then.

## 5.2.1. Login do Administrador

Arquivo: cypress/e2e/frontend/login-admin.cy.js

Fluxo:

Cria usuário administrador via API

Acessa a página de login (/login)

Preenche e-mail e senha válidos

Clica em Entrar

Valida:

URL contendo /admin

elementos típicos da área administrativa visíveis

## 5.2.2. Cadastro de Produto pelo Administrador

Arquivo: cypress/e2e/frontend/admin-produtos.cy.js

Fluxo:

Cria usuário administrador via API

Faz login no frontend

Acessa Listar Produtos

Acessa Cadastrar produto

Preenche o formulário com:

nome

preço

descrição

quantidade

Envia o formulário

Valida:

redirecionamento para /admin/listarprodutos

presença do novo produto na tabela

### 5.2.3. Listagem de Produtos pelo Administrador

Arquivo: cypress/e2e/frontend/listar-produtos.cy.js

Fluxo:

Cria usuário administrador via API

Faz login no frontend

Acessa Listar Produtos

Valida:

tabela de produtos visível

existência de pelo menos uma linha em table tbody tr

## 
**5.3. Observação sobre o carrinho no Frontend**

A rota /carrinho do frontend atualmente exibe apenas a mensagem:

Em construção, aguarde

Não há itens de carrinho renderizados no DOM.
Por esse motivo, o fluxo de compra/carrinho foi validado somente na camada de API, no arquivo api-carrinhos.cy.js, onde a regra de negócio de estoque já está implementada.


Se algo do texto não bater exatamente com o que você tem (ex: nome de arquivo diferente), é só ajustar pontualmente e manter a estrutura.
::contentReference[oaicite:0]{index=0}
