/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../support/locators.js";
const cometa = "https://www.viacaocometa.com.br";
const viacao1001 = "https://www.autoviacao1001.com.br";
const catarinense = "https://www.catarinense.com.br/";
const expressoSul = "https://www.expressodosul.com.br/";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/";
const odp = "https://www.outletdepassagens.com.br";
const odt = "https://www.outletdehoteis.com.br";
const giro = "https://www.clubegiro.com.br";
const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

import loc from "../../support/locators";

describe("Validar cards de promoção", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit("/");
  });

  it("Deve validar o link do 1º card de promoção e redirecionar para a página de login", () => {
    cy.get(".aem-GridColumn > .promo-card > .promo-card-content > .promo-card-footer > .promo-card-btn", { timeout: 60000 }).eq(0).click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
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
    cy.get(".aem-Grid > .aem-GridColumn > .promo-card > .promo-card-content > .promo-card-footer > .promo-card-btn", { timeout: 15000 }).eq(1).click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login1", "senha1"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
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
    cy.get(".aem-Grid > .aem-GridColumn > .promo-card > .promo-card-content > .promo-card-footer > .promo-card-btn", { timeout: 60000 }).eq(2).click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 60000 });
    cy.env(["login", "senha"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
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
    cy.get(".aem-Grid > .aem-GridColumn > .promo-card > .promo-card-content > .promo-card-footer > .promo-card-btn", { timeout: 15000 }).eq(3).click({ force: true });
    cy.selecionarPassagemAleatoria1({ timeout: 15000 });
    cy.env(["login1", "senha1"]).then((env) => {
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
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
