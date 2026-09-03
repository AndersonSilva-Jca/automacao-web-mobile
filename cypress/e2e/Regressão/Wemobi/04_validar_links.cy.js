/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar todos os Links Footer", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(wemobi);
  });

  it("Deve validar Links Footer - Instagram", () => {
    cy.get('[alt="logo instagram"]').click({ force: true });
  });

  it("Deve validar Links Footer - Facebook", () => {
    cy.get('[alt="logo facebook"]').click({ force: true });
  });

  it("Deve validar Links Footer - TikTok", () => {
    cy.get('[alt="logo tiktok"]').click({ force: true });
  });

  it("Deve validar Links Footer - YouTube", () => {
    cy.get('[alt="logo youtube"]').click({ force: true });
  });

  it("Deve validar Links Footer - X", () => {
    cy.get('[alt="logo twitter"]').click({ force: true });
  });

  it("Deve validar Links Footer - LinkedIn", () => {
    cy.get('[alt="logo linkedin"]').click({ force: true });
  });

  it("Deve validar Links Footer - Atendimento virtual whatsapp", () => {
    cy.get('[href="https://api.whatsapp.com/send?phone=5511955827101"]').click({ force: true });
    // cy.url().should('include', '/send?phone=5511972645808')
  });

  it("Deve validar Links Footer - Fale Conosco", () => {
    cy.get('[href="https://www.wemobi.me/fale-conosco"]').click({ force: true });
    cy.url().should("include", "/fale-conosco");
  });
});
