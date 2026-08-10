// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

import loc from "../../support/locators.js";
import LoginPage from "../../pages/LoginPage.js";
import SearchPage from "../../pages/SearchPage.js";
import OfferPage from "../../pages/OfferPage.js";
import PassengerPage from "../../pages/PassengerPage.js";
import SeatMapPage from "../../pages/SeatMapPage.js";
import CheckoutPage from "../../pages/CheckoutPage.js";
const giro = "https://www.clubegiro.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Clube Giro", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Giro - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha2"]).then(() => {
      cy.visit(giro);
      LoginPage.giroModalLogin();
      LoginPage.giroAssertAcesse();
      LoginPage.giroPreencherUsuario();
      LoginPage.giroPreencherSenha();
      LoginPage.giroConfirmarLogin();
    });
    LoginPage.preencher2FA();
    LoginPage.giroLogadoComSucesso();
    SearchPage.giroBuscaOrigem();
    SearchPage.giroBuscaDestino();
    SearchPage.giroDataIda();
    SearchPage.giroConfirmarBusca();
    OfferPage.giroSelecionarPassagemIda();
    PassengerPage.giroSelecionarPassageiro();
    SeatMapPage.giroSelecionarAssento();
    CheckoutPage.giroResumoCompra();
  });
});
