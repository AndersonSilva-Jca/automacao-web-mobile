/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../support/locators.js";
const cometa = "https://www.viacaocometa.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";
const viacao1001 = "https://www.autoviacao1001.com.br";
const catarinense = "https://www.catarinense.com.br/";
const expressoSul = "https://www.expressodosul.com.br/";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/";
const odp = "https://www.outletdepassagens.com.br";
const odt = "https://www.outletdehoteis.com.br";
const giro = "https://www.clubegiro.com.br";
const wemobi = "https://www.wemobi.me";

describe("Validar todos os Links Footer", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(cometa);
  });
  it("Deve validar Links Footer - Instagram", () => {
    cy.get('.social-networks-list > :nth-child(1) > [href="https://www.instagram.com/viacaocometa.oficial/?hl=pt-br"]').click();
  });

  it("Deve validar Links Footer - Facebook", () => {
    cy.get('a[href="https://www.facebook.com/ViacaoCometaOficial"]').click();
  });
  it("Deve validar Links Footer - Atendimento virtual whatsapp", () => {
    cy.get('[href="https://api.whatsapp.com/send?phone=5511972645808"] > b').click();
    // cy.url().should('include', '/send?phone=5511972645808')
  });
  it("Deve validar Links Footer - Vendas whatsapp", () => {
    cy.get(':nth-child(2) > [href="https://wa.me/5511933153607"]').click();
    // cy.url().should('include', '/5511933153607')
  });
  it("Deve validar Links Footer - Fale Conosco", () => {
    cy.get(':nth-child(4) > :nth-child(1) > [href="/fale-conosco"]').click();
    cy.url().should("include", "/fale-conosco");
  });
});
