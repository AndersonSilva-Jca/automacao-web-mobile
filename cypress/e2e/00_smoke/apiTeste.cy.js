// 21/09/2026 - incio com github actions
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

require("cypress-xpath");
const cometa = "https://www.viacaocometa.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

const remarcacao = "https://api.jcatlm.com.br/SaleExchange/confirmsaleexchange";

describe("Testes de B.O. em Remarcação e Cancelamento no Cartão", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });
  it("Simular Erro de Adyen Recusado/Erro de Comunicação na Remarcação", () => {
    // Intercepta a rota de Remarcação no Cartão e força erro 422/500
    cy.env(["login", "senha"]).then(() => {
      cy.visit(cometa);
      LoginPage.abrirModalLogin();
      LoginPage.preencherUsuario();
      LoginPage.PreencherSenha();
      LoginPage.confirmarLogin();
      LoginPage.logadoComSucesso();
    });
    cy.intercept("POST", "**/SaleExchange/confirmsaleexchange", {
      statusCode: 422,
      body: {
        code: "PAYMENT_REFUSED",
        message: "Cartão recusado pela adquirente ao tentar cobrar a diferença da remarcação.",
      },
    }).as("postRemarcacaoCartao");
    // cy.env(["login", "senha"]).then(() => {
    //   cy.visit(cometa);
    //   LoginPage.abrirModalLogin();
    //   LoginPage.preencherUsuario();
    //   LoginPage.PreencherSenha();
    //   LoginPage.confirmarLogin();
    //   LoginPage.logadoComSucesso();
    // });
    cy.visit("https://www.viacaocometa.com.br/minhas-compras");
    cy.get('[data-cy="btn-remarcar"]').click();
    cy.get('[data-cy="btn-confirmar-pagamento-cartao"]').click();

    cy.wait("@postRemarcacaoCartao");
    // Valida se a interface trata e exibe o erro em vez de congelar a tela
    cy.get(".error-message").should("contain", "Cartão recusado");
  });

  it("Simular Cancelamento de Cartão quando o estorno/refund falha no Gateway", () => {
    // Intercepta o cancelamento de Cartão síncrono
    cy.intercept("POST", "**/sale/v1/cancelsale", {
      statusCode: 500,
      body: {
        code: "ADYEN_REFUND_ERROR",
        message: "Não foi possível processar o estorno do cartão automaticamente.",
      },
    }).as("postCancelamentoCartao");

    cy.visit("https://www.viacaocometa.com.br/minhas-compras");
    cy.get('[data-cy="btn-cancelar"]').click();
    cy.get('[data-cy="btn-confirmar-cancelamento"]').click();

    cy.wait("@postCancelamentoCartao");
    cy.get(".toast-notification").should("be.visible");
  });
});
