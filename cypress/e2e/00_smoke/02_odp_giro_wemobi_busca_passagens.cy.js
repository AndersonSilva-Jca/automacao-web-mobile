/// <reference types='cypress' />

import loc from "../../support/locators";
// const { faker } = require('@faker-js/faker');3

// 15/05/2026 - incio com github actions
const odp = "www.outletdepassagens.com.br";
const giro = "www.clubegiro.com.br";
const wemobi = "www.wemobi.me";

describe("Digital - Fazer busca de destinos, selecionar datas, compra de passagens, selecionar assentos ", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
  });
});
it("Clube Giro - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  cy.env(["login", "senha"]).then((env) => {
    cy.visit(giro);
    cy.get(loc.HEADER_BOTAO_LOGIN).click();
    cy.get(loc.USUARIO).type(env.login);
    cy.get(loc.SENHA).type(env.senha, { log: false });
    cy.get(loc.BOTAO_LOGIN).click();
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  });
  cy.get(loc.BUSCAS.DESTINO_IDA).click().type(" Campos Dos Goytacazes - Shopping Estrada (RJ) ", { delay: 100 });
  cy.contains(" Campos Dos Goytacazes - Shopping Estrada (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Macaé - Terminal Rodoviário (RJ) ", { delay: 100 });
  cy.contains(" Macaé - Terminal Rodoviário (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DATA_IDA).click();
  cy.get(loc.LOADER).should("not.exist");
  cy.selecionarDataIda(5);
  cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  cy.selecionarAssentoAleatorio({ timeout: 90000 });
  cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
});

it("Wemobi - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  cy.env(["login", "senha"]).then((env) => {
    cy.visit(wemobi);
    cy.get("#button-header-login").click();
    cy.get(loc.USUARIO).type(env.login);
    cy.get(loc.SENHA).type(env.senha, { log: false });
    cy.get("#button-login-confirm").click();
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  });
  cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
  cy.contains(" São Paulo - Rodoviária Tietê (SP) ").click({ force: true });
  cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Rodoviária Novo Rio (RJ)", { delay: 100 });
  cy.contains(" Rio De Janeiro - Rodoviária Novo Rio (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DATA_IDA).click();
  cy.selecionarDataIda(5);
  cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
  cy.get("#reservation-seat-0").click();
  cy.get('[data-value="random-seat"]').click();
  cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
});

it.only("Outlet de passagens - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  cy.env(["login", "senha"]).then((env) => {
    cy.visit(odp);
    cy.get(".logged-out-section > .btn-outlet").click();
    cy.get(loc.USUARIO).type(env.login);
    cy.get(loc.SENHA).type(env.senha, { log: false });
    cy.get(".button-login").click();
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  });
  // cy.wait(8000);
  // cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });

  // cy.get(".ui-menu-item").contains("São Paulo - Rodoviária Tietê (SP)").click({ force: true });

  // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro Rodoviária Novo Rio (RJ)", { delay: 100 });

  // cy.contains("Rio De Janeiro - Rodoviária Novo Rio (RJ)").click({ force: true });

  // cy.get(loc.BUSCAS.DATA_IDA).click();
  // cy.selecionarDataIda(5);
  // cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();

  // cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  // cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
  // cy.get("#reservation-seat-0").click();
  // cy.get('[data-value="random-seat"]').click();
  // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
});
