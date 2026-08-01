/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");

import LoginPage from "../../pages/LoginPage.js";
import SearchPage from "../../pages/SearchPage.js";
import OfferPage from "../../pages/OfferPage.js";
import PassengerPage from "../../pages/PassengerPage.js";
import SeatMapPage from "../../pages/SeatMapPage.js";
import CheckoutPage from "../../pages/CheckoutPage.js";
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Wemobi", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then(() => {
      cy.visit(wemobi);
      LoginPage.wemobiModalLogin();
      LoginPage.wemobiPreencherUsuario();
      LoginPage.wemobiPreencherSenha();
      LoginPage.wemobiConfirmarLogin();
      LoginPage.wemobiLogadoComSucesso();
    });
    SearchPage.wemobiBuscaOrigem();
    SearchPage.wemobiBuscaDestino();
    SearchPage.wemobiDataIda();
    SearchPage.wemobiConfirmarBusca();
    OfferPage.wemobiSelecionarPassagemIda();
    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssento();
    CheckoutPage.wemobiResumoCompra();
  });
});
