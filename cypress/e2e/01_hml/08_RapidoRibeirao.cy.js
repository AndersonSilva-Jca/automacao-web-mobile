// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import LoginPage from "../../pages/hml/hml_LoginPage";
import SearchPage from "../../pages/hml/hml_SearchPage";
import OfferPage from "../../pages/hml/hml_OfferPage";
import PassengerPage from "../../pages/hml/hml_PassengerPage";
import SeatMapPage from "../../pages/hml/hml_SeatMapPage";
import CheckoutPage from "../../pages/hml/hml_CheckoutPage";
import loc from "../../support/locators.js";
const rapidoRibeirao = "https://rapidoribeiraopretostage.vendasjca.com.br/";

describe("Rapido Ribeirão", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Rapido Ribeirão - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then(() => {
      cy.visit(rapidoRibeirao);
      LoginPage.abrirModalLogin();
      LoginPage.preencherUsuario();
      LoginPage.PreencherSenha();
      LoginPage.confirmarLogin();
      LoginPage.logadoComSucesso();
    });
    SearchPage.buscaOrigem();
    SearchPage.buscaDestino();
    SearchPage.dataIda();
    SearchPage.confirmarBusca();
    OfferPage.selecionarPassagemIda();
    PassengerPage.selecionarPassageiro();
    SeatMapPage.selecionarAssento();
    CheckoutPage.resumoDaCompra();
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });
});
