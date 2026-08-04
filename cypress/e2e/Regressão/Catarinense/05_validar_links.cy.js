/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");
import loc from "../../../support/locators.js";
const catarinense = "https://www.catarinense.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar todos os Links Footer", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(catarinense);
  });
  it("Deve validar Links Footer - Instagram", () => {
    cy.get('[alt="Instagram alt"]').click();
  });

  it("Deve validar Links Footer - Facebook", () => {
    cy.get('[alt="Facebook alt"]').click();
  });
  it("Deve validar Links Footer - Atendimento virtual whatsapp", () => {
    cy.get('[href="https://api.whatsapp.com/send?phone=5548988567424"]').click();
    // cy.url().should('include', '/send?phone=5511972645808')
  });
  it("Deve validar Links Footer - Vendas whatsapp", () => {
    cy.get('[href="https://api.whatsapp.com/send?phone=5548988567424"]').click();
    // cy.url().should('include', '/5511933153607')
  });
  it("Deve validar Links Footer - Fale Conosco", () => {
    cy.get('[href="/fale-conosco.html"]').click();
    cy.url().should("include", "/fale-conosco");
  });
});
