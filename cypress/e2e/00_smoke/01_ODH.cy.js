/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
import HomePage from "../../pages/HomePage";
import OfferPage from "../../pages/OfferPage";
import SearchPage from "../../pages/SearchPage";
// 06/06/2026 - incio com github actions
import loc from "../../support/locators";
const odh = "https://www.outletdehoteis.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Outlet de Hotéis", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de Hotéis - Busca de destinos, Hotéis em promoção hoje, Promoção em hotéis por destino", () => {
    cy.visit(odh);
    HomePage.odhAssertHome();
    cy.wait(2000);
    SearchPage.odhBuscaDestino();
    SearchPage.odhCheckIn();
    SearchPage.odhConfirmarBusca();
    SearchPage.odhLoaderBusca();
    OfferPage.odhSelecionarHospedagem();
    HomePage.odhHome();
    HomePage.odhPromoHoje();

    // Promoção em hotéis por destino
    // cy.contains("Promoção em hotéis por destino").should("be.visible");
    // cy.get('img[alt="Fernando de Noronha"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
    // cy.get('img[alt="Jericoacoara"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
    // cy.get('img[alt="Porto de Galinhas"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
  });
});
