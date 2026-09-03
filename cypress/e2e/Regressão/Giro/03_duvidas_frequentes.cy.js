/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const giro = "https://www.clubegiro.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar Cards - FAQ", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(giro);
  });

  it("Deve validar Cards - FAQ", () => {
    cy.get(":nth-child(1) > .accordion-header").click();
    cy.get(":nth-child(1) > .accordion-body > .accordion-content > p").should("be.visible").log("O que é o clube Giro?");
    cy.get(":nth-child(2) > .accordion-header").click();
    cy.get(":nth-child(2) > .accordion-body > .accordion-content > p").should("be.visible").log("Como funciona o clube Giro?");
    cy.get(":nth-child(3) > .accordion-header").click();
    cy.get(":nth-child(3) > .accordion-body > .accordion-content > p").should("be.visible").log("O que são Missões");
    cy.get(":nth-child(4) > .accordion-header").click();
    cy.get(":nth-child(4) > .accordion-body > .accordion-content > p").should("be.visible").log("Quas prêmios e benefícios posso ganhar?");
    cy.get(":nth-child(5) > .accordion-header").click();
    cy.get(":nth-child(5) > .accordion-body > .accordion-content > p").should("be.visible").log("ganhei um Voucher, como uso meu desconto?");
    cy.get(":nth-child(6) > .accordion-header").click();
    cy.get(":nth-child(6) > .accordion-body > .accordion-content > p").should("be.visible").log("Posso usar mais de um voucher na mesma compra?");
    cy.get(":nth-child(7) > .accordion-header").click();
    cy.get(":nth-child(7) > .accordion-body > .accordion-content > p").should("be.visible").log("O desconto vale para ida e volta?");
  });
});
