/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const odp = "https://www.outletdepassagens.com.br";

describe("Outlet de Passagens", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de passagens - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(odp);
      cy.get(".logged-out-section > .btn-outlet").click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login").click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });

    cy.wait(12000);
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Rio-De-Janeiro---Todos-(RJ)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(".btn-footer").should("be.visible").and("not.be.disabled").click();
    cy.get(".payment-type-container > .col-12 > .active").should("be.visible");
    cy.get('[data-js="subtotal-seats-container"] > .title-value > .title > .cmp-text > p').should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(".title-tooltip > .title").should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(":nth-child(5) > .title > .cmp-text > p > b").should("contain", "Valor Outlet").log("Valor total das passagens Outlet");
  });
});
