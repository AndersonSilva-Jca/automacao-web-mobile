/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

import loc from "../../../support/locators";

describe("Validar cards de promoção", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(wemobi);
  });

  it("Deve validar o link do 1º card de promoção e redirecionar para a página de login", () => {
    cy.get('a[href="https://www.wemobi.me/disponibilidade?range_data_ida=15&origem_id=2674&destino_id=2697&num_psgr=1&num_chda=0&num_chds=0"]').invoke("removeAttr", "target").click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#login-component-button-login").click({ force: true });
    });
    // cy.get('#buyer-check-1', { timeout: 60000 }).click({ force: true })
    // cy.get('#btn-proceed').should('be.visible').and('not.be.disabled').click();
    // cy.selecionarAssentoAleatorio({ timeout: 15000 });
    // cy.wait(10000)
    // cy.get('#btn-proceed').should('be.visible').click()
    // cy.url().should('include', '/pagamento')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // Não finalizar a compra para evitar transações reais
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });
  it("Deve validar o link do 2º card de promoção e redirecionar para a página de login", () => {
    cy.get('a[href="https://www.wemobi.me/disponibilidade?range_data_ida=15&origem_id=2697&destino_id=250&num_psgr=1&num_chda=0&num_chds=0"]').invoke("removeAttr", "target").click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#login-component-button-login").click({ force: true });
      // cy.get(loc.MENSAGEM_LOGADO).if('not.be.visible').get('.normal').should('contain', 'O email ou senha inseridos não constam em nosso cadastro')
    });
    // cy.get('#buyer-check-1', { timeout: 20000 }).click({ force: true })
    // cy.get('#btn-proceed').should('be.visible').and('not.be.disabled').click();
    // cy.selecionarAssentoAleatorio({ timeout: 15000 });
    // // cy.wait(10000)
    // cy.get('#btn-proceed').should('be.visible').click()
    // cy.url().should('include', '/pagamento')
  });

  it("Deve validar o link do 3º card de promoção e redirecionar para a página de login", () => {
    cy.get('a[href="https://www.wemobi.me/disponibilidade?range_data_ida=15&origem_id=2653&destino_id=2674&num_psgr=1&num_chda=0&num_chds=0"]').invoke("removeAttr", "target").click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#login-component-button-login").click({ force: true });
      // cy.get(loc.MENSAGEM_LOGADO).if('not.be.visi;ble').get('.normal').should('contain', 'O email ou senha inseridos não constam em nosso cadastro')
    });
    // cy.get('#buyer-check-1', { timeout: 20000 }).click({ force: true })
    // cy.get('#btn-proceed').should('be.visible').and('not.be.disabled').click();
    // cy.selecionarAssentoAleatorio({ timeout: 15000 });
    // // cy.wait(10000)
    // cy.get('#btn-proceed').should('be.visible').click()
    // cy.url().should('include', '/pagamento')
  });

  it("Deve validar o link do 4º card de promoção e redirecionar para a página de login", () => {
    cy.get('a[href="https://www.wemobi.me/disponibilidade?range_data_ida=15&origem_id=2697&destino_id=529&num_psgr=1&num_chda=0&num_chds=0"]').invoke("removeAttr", "target").click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#login-component-button-login").click({ force: true });
      // cy.get(loc.MENSAGEM_LOGADO).if('not.be.visible').get('.normal').should('contain', 'O email ou senha inseridos não constam em nosso cadastro')
    });
    // cy.get('#buyer-check-1', { timeout: 20000 }).click({ force: true })
    // cy.get('#btn-proceed').should('be.visible').and('not.be.disabled').click();
    // cy.selecionarAssentoAleatorio({ timeout: 15000 });
    // // cy.wait(10000)
    // cy.get('#btn-proceed').should('be.visible').click()
    // cy.url().should('include', '/pagamento')
  });
});
