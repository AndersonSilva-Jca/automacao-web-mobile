/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const odp = "https://www.outletdepassagens.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar cards de Melhores Destinos", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(odp);
  });

  it("Deve validar o link do 1º card de promoção e redirecionar para a página de login", () => {
    cy.get(".slick-current > .card-wrapper > .best-offer-card > .best-offer-card-background-filler > .best-offer-card-header").click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login > p > .normal").click();
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
    cy.get('[data-slick-index="1"] > .card-wrapper > .best-offer-card').click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login > p > .normal").click();
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
    cy.get('[data-slick-index="1"] > .card-wrapper > .best-offer-card > .best-offer-card-background-filler > .best-offer-card-body').click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login > p > .normal").click();
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
    cy.get('[data-slick-index="3"] > .card-wrapper > .best-offer-card').click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login > p > .normal").click();
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
