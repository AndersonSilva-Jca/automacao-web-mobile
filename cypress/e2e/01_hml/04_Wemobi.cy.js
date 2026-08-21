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
const wemobi = "https://wemobistage.vendasjca.com.br/";

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
    // cy.get(loc.BUSCAS.DESTINO_IDA).click({ double: true }).type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    // cy.xpath(loc.WEMOBI_XPATH_SP).click({ force: true });
    SearchPage.wemobiBuscaOrigem();
    SearchPage.wemobiBuscaDestino();
    SearchPage.wemobiDataIda();
    SearchPage.wemobiConfirmarBusca();
    OfferPage.wemobiSelecionarPassagemIda();
    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssento();
    // CheckoutPage.wemobiResumoCompra();
  });
});
