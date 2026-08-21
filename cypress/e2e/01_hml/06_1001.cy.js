// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import loc from "../../support/locators.js";
import LoginPage from "../../pages/hml/hml_LoginPage.js";
import SearchPage from "../../pages/hml/hml_SearchPage.js";
import OfferPage from "../../pages/hml/hml_OfferPage.js";
import PassengerPage from "../../pages/hml/hml_PassengerPage.js";
import SeatMapPage from "../../pages/hml/hml_SeatMapPage.js";
import CheckoutPage from "../../pages/hml/hml_CheckoutPage.js";
const viacao1001 = "https://autoviacao1001stage.vendasjca.com.br/";

describe("Auto Viação 1001", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Auto Viação 1001 - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login1", "senha1"]).then(() => {
      cy.visit(viacao1001);
      LoginPage.abrirModalLogin();
      LoginPage.preencherUsuario();
      LoginPage.PreencherSenha();
      LoginPage.confirmarLogin();
      LoginPage.logadoComSucesso();
    });
    // SearchPage.buscaOrigem();

    cy.get(loc.BUSCAS.DESTINO_IDA).click().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().focus().clear().type("São Paulo (Todos) (SP)", { delay: 100 });
    cy.contains(".location-title", " São Paulo (Todos) (SP) ").should("be.visible").closest(".ui-menu-item-wrapper").click();
    // cy.xpath(loc.XPATH_SP_TIETE).click({ force: true });
    // cy.wait(1000);
    // cy.get(loc.BUSCAS.DESTINO_IDA).click().clear().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    // SearchPage.buscaDestino();
    // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)");
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type("Rio de Janeiro (Novo Rio) (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Rio-de-Janeiro-(Novo-Rio)-(RJ)"]/p[1]').should("be.visible").click();
    SearchPage.dataIda();
    SearchPage.confirmarBusca();
    OfferPage.selecionarPassagemIda();
    PassengerPage.selecionarPassageiro();
    SeatMapPage.selecionarAssento();
    CheckoutPage.resumoDaCompra();
    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });
});
