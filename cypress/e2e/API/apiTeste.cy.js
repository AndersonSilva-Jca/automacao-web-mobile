// 21/09/2026 - incio com github actions
/// <reference types="cypress" />
// /// <reference types="@cypress/xpath" />

// require("cypress-xpath");

// import loc from "../../support/locators.js";
// import LoginPage from "../../pages/LoginPage";
// import SearchPage from "../../pages/SearchPage";
// import OfferPage from "../../pages/OfferPage";
// import PassengerPage from "../../pages/PassengerPage";
// import SeatMapPage from "../../pages/SeatMapPage";
// import CheckoutPage from "../../pages/CheckoutPage";

// require("cypress-xpath");
// const cometa = "https://www.viacaocometa.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

// const remarcacao = "https://api.jcatlm.com.br/SaleExchange/confirmsaleexchange";

describe("", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });
  // it("teste access token", () => {
  //   cy.request({
  //     method: "POST",
  //     url: "https://api.jcatlm.com.br/oauth/v3/access-token",
  //     body: {
  //       grant_type: "client_credentials",
  //     },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     const accessToken = response.body.access_token;
  //     cy.log("Access Token:", accessToken);
  //   });
  // });

  it("teste login", () => {
    cy.request({
      method: "POST",
      url: "https://api.jcatlm.com.br/customer/v1/account",
      body: {
        login: "qa.monitor@odptech.com.br",
        password: "odptech26",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const accessToken = response.body.access_token;
      cy.log("Access Token:", accessToken);
    });
  });
});
