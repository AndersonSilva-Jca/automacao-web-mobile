// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import loc from "../../support/locators.js";
import LoginPage from "../../pages/hml/hml_LoginPage.js";
import SearchPage from "../../pages/hml/hml_SearchPage.js";
import OfferPage from "../../pages/hml/hml_OfferPage.js";
import PassengerPage from "../../pages/hml/hml_PassengerPage.js";
import CheckoutPage from "../../pages/hml/hml_CheckoutPage.js";
const odp = "https://outletdepassagensstage.vendasjca.com.br/";

describe("Outlet de Passagens", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de passagens - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then(() => {
      cy.visit(odp);
      LoginPage.odpModalLogin();
      LoginPage.odpPreencherUsuario();
      LoginPage.odpPreencherSenha();
      LoginPage.odpConfirmarLogin();
      LoginPage.odpLogadoComSucesso();
    });
    SearchPage.odpBuscaOrigem();
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.get('[role="option"][aria-label="Rio de Janeiro - Todos (RJ)"]').should("be.visible").click();
    SearchPage.odpDataIda();
    SearchPage.odpConfirmarBusca();
    OfferPage.odpSelecionarPassagemIda();
    PassengerPage.odpSelecionarPassageiro();
    // CheckoutPage.odpResumoDaCompra();
  });
});
