/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar link do clube giro", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(wemobi);
  });

  it("Deve validar o link das viações que operam na Wemobi -  Wemobi SP x RJ", () => {
    cy.get('[href="https://www.wemobi.me/passagens-onibus-sao-paulo-rio-de-janeiro"]').click({ force: true });
    cy.get('[style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação 1001", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-1001"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Busco", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/busco"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Catarinense", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-catarinense"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Cometa", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-cometa"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Expresso do Sul", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-expresso-do-sul"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Guanabara", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-guanabara"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Nova Itapemirim", () => {
    cy.get('.aem-GridColumn--phone--hide > .html-script-comp > .parceiros-wrapper > .parceiros-grid > [href="https://www.wemobi.me/viacao-nova-itapemirim"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Deve validar o link das viações que operam na Wemobi - Viação Planalto", () => {
    cy.get('[href="https://www.wemobi.me/viacao-planalto"]').click({ force: true });
    cy.get(':nth-child(1) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });
});
