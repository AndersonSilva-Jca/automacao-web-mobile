// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

import loc from "../../support/locators";
import LoginPage from "../../pages/LoginPage";
import SearchPage from "../../pages/SearchPage";
import OfferPage from "../../pages/OfferPage";
import PassengerPage from "../../pages/PassengerPage";
import SeatMapPage from "../../pages/SeatMapPage";
import CheckoutPage from "../../pages/CheckoutPage";

const cometa = "https://www.viacaocometa.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Viação Cometa", () => {
  beforeEach(() => {
    cy.limpezaTotal();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Viação Cometa - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then(() => {
      cy.visit(cometa);
      LoginPage.abrirModalLogin();
      LoginPage.preencherUsuario();
      LoginPage.PreencherSenha();
      LoginPage.confirmarLogin();
      LoginPage.logadoComSucesso();
    });
    SearchPage.buscaTopRotasCometa();
    SearchPage.dataIda();
    SearchPage.confirmarBusca();
    OfferPage.selecionarPassagemIda();
    PassengerPage.selecionarPassageiro();
    SeatMapPage.selecionarAssento();
    // cy.wait(5000);

    CheckoutPage.resumoDaCompra();
  });
});
