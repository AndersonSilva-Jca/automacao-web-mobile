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
const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Wemobi", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Wemobi- selecionar experiência wemobi com Lugar Marcado", () => {
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
    OfferPage.passagemExperienciaWemobi();

    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssentoMarcado();
    CheckoutPage.wemobiResumoCompra();
  });

  it.only("Wemobi- selecionar experiência wemobi com Assento Aleatório", () => {
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
    OfferPage.passagemExperienciaWemobi();
    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssentoAleatorio();
    CheckoutPage.wemobiResumoCompra();
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos marcado", () => {
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
    OfferPage.passagemSemExperienciaWemobi();
    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssentoMarcado();
    CheckoutPage.wemobiResumoCompra();
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assento aleatório", () => {
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
    OfferPage.passagemSemExperienciaWemobi();
    PassengerPage.wemobiSelecionarPassageiro();
    SeatMapPage.wemobiSelecionarAssentoAleatorio();
    CheckoutPage.wemobiResumoCompra();
  });
});
