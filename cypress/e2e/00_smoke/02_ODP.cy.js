// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import loc from "../../support/locators.js";
import LoginPage from "../../pages/LoginPage.js";
import SearchPage from "../../pages/SearchPage.js";
import OfferPage from "../../pages/OfferPage.js";
import PassengerPage from "../../pages/PassengerPage.js";
import CheckoutPage from "../../pages/CheckoutPage.js";
const odp = "https://www.outletdepassagens.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

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
    SearchPage.odpBuscaDestino();
    SearchPage.odpDataIda();
    SearchPage.odpConfirmarBusca();
    OfferPage.odpSelecionarPassagemIda();
    PassengerPage.odpSelecionarPassageiro();
    CheckoutPage.odpResumoDaCompra();
  });
});
