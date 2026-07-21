/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators.js";
const viacao1001 = "https://www.autoviacao1001.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar Cards - dúvidas frequentes", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(viacao1001);
  });
  it("Deve validar Cards - informação para sua viagem", () => {
    cy.get(":nth-child(2) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .image > .cmp-image > #cmp-image-link > .cmp-image__image").click();
    cy.url().should("include", "informacao-para-sua-viagem");
  });

  it("Deve validar Cards - remarcação", () => {
    cy.get(":nth-child(3) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .image > .cmp-image > #cmp-image-link > .cmp-image__image").click();
    cy.url().should("include", "/remarcacao");
  });
  it("Deve validar Cards - reembolso", () => {
    cy.get(":nth-child(4) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .image > .cmp-image > #cmp-image-link > .cmp-image__image").click();
    cy.url().should("include", "/reembolso");
  });

  it("Deve validar Cards - bagagem", () => {
    cy.get(":nth-child(5) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .image > .cmp-image > #cmp-image-link > .cmp-image__image").click();
    // cy.url().should('include', '/bagagem')
  });
});
