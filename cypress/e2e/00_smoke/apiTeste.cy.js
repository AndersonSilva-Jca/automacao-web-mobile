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

describe("", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });
  it("", () => {});
});
