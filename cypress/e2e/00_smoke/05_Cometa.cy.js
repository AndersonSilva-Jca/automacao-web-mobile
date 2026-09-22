// 06/06/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

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
    cy.clearCookies();
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
    SearchPage.buscaOrigem();
    SearchPage.buscaDestinoCometa();
    SearchPage.dataIda();
    SearchPage.confirmarBusca();
    OfferPage.selecionarPassagemIda();
    PassengerPage.selecionarPassageiro();
    SeatMapPage.selecionarAssento();
    CheckoutPage.resumoDaCompra();

    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get('[alt="loader"]').should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });

  // it("Viação Cometa - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
  //   cy.env(["login", "senha"]).then(() => {
  //     cy.visit(cometa);
  //     // LoginPage.abrirModalLogin();
  //     // LoginPage.preencherUsuario();
  //     // LoginPage.PreencherSenha();
  //     // LoginPage.confirmarLogin();
  //     // LoginPage.logadoComSucesso();
  //   });

  //   const origem = ["Campinas (SP)", "Santos (SP)", "Sorocaba (SP)", "São Paulo (Rod. Barra Funda) (SP)", "São Paulo (Rod. Tietê) (SP)"];
  //   const indiceAleatorio = Math.floor(Math.random() * origem.length);
  //   const origemSorteada = origem[indiceAleatorio];

  //   cy.get(loc.BUSCAS.DESTINO_IDA).click().type(origemSorteada, { delay: 100 }).should("exist").invoke("show");
  //   cy.get(`[class="ui-menu-item-wrapper "][id="${origemSorteada}"]`).click({ force: true });
  //   cy.log(`Destino Sorteado e selecionado para o teste: ${origemSorteada}`);

  //   cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
  //   cy.xpath(loc.XPATH_RJ_TODOS).click({ force: true });

  //   // SearchPage.buscaOrigem();
  //   // SearchPage.buscaDestino();
  //   SearchPage.dataIda();
  //   SearchPage.confirmarBusca();
  //   OfferPage.selecionarPassagemIda();
  //   PassengerPage.selecionarPassageiro();
  //   SeatMapPage.selecionarAssento();
  //   CheckoutPage.resumoDaCompra();

  //   // cy.get('[alt="loader"]').should('not.be.visible')
  //   // cy.url({ timeout: 90000 }).should('include', '/pagamento')
  //   // Não finalizar a compra para evitar transações reais
  //   // cy.get('[alt="loader"]').should('not.exist')
  //   // cy.get('#tab-pix').click()
  //   // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
  //   // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  // });
});
