// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import loc from "../../support/locators.js";
import LoginPage from "../../pages/LoginPage";
import SearchPage from "../../pages/SearchPage";
import OfferPage from "../../pages/OfferPage";
import PassengerPage from "../../pages/PassengerPage";
import SeatMapPage from "../../pages/SeatMapPage";
import CheckoutPage from "../../pages/CheckoutPage";

const expressoSul = "https://www.expressodosul.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Expresso do Sul", () => {
  beforeEach(() => {
    // cy.clearCookies();
    // cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Expresso Sul - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.visit(expressoSul);
    cy.env(["login2", "senha2"]).then(() => {
      LoginPage.abrirModalLogin();
      LoginPage.preencherUsuarioExpSul();
      LoginPage.PreencherSenhaExpSul();
      LoginPage.confirmarLogin();
      LoginPage.logadoComSucesso();
    });
    SearchPage.buscaOrigemExpressoSul();
    SearchPage.dataIda();
    SearchPage.confirmarBusca();
    OfferPage.selecionarPassagemIdaExpressoSul();
    PassengerPage.selecionarPassageiro();
    SeatMapPage.selecionarAssento();
    // CheckoutPage.resumoDaCompraExpressoDoSul();
    CheckoutPage.resumoDaCompra();
  });
});
