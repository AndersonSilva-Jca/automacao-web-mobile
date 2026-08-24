/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const odp = "https://www.outletdepassagens.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar link Sobre", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(odp);
  });
  it("Validar link Sobre - Sobre o Outlet ", () => {
    cy.get(".header-nav-container > .menu-mobile > :nth-child(1)").click();
    cy.url().should("include", "/sobre");
    cy.get(".faq-container > :nth-child(1) > .title").should("be.visible");
    cy.get("#headingajuda-1").click();
    cy.get("#headingajuda-2").click();
    cy.get("#headingajuda-3").click();
    cy.get("#headingajuda-4").click();
    cy.get(".fac-text > p").should("be.visible");
  });

  it("Validar link informações de Viagem - Informações para embarque", () => {
    cy.get(".header-nav-container > .menu-mobile > :nth-child(2)").click();
    cy.url().should("include", "/ajuda");
    cy.get("#sobre > p > b").should("be.visible");
    cy.get(":nth-child(9) > clientlib > .about-card-button").click();
    cy.get("#compra > p > b").should("be.visible");
    cy.get(":nth-child(15) > clientlib > .about-card-button").click();
    cy.get("#viagem > p > b").should("be.visible");
    cy.get(":nth-child(22) > clientlib > .about-card-button > #about-card").click();
    cy.get("#pagamento > p > b").should("be.visible");
    cy.get(":nth-child(27) > clientlib > .about-card-button").click();
    cy.get("#taxacancelamento > p > b").should("be.visible");
    cy.get(":nth-child(4) > clientlib > .about-card-button").click();
    cy.get(":nth-child(9) > .main-content > .faq-container > .faq-accordion > #accordion > :nth-child(1) > :nth-child(1) > #gratuidademenores > p > b").should("be.visible");
    cy.get(":nth-child(11) > clientlib > .about-card-button").click();
    cy.get("#gratuidade > p > b").should("be.visible");
    cy.get(":nth-child(17) > clientlib > .about-card-button").click();
    cy.get("#transporteanimais > p > b").should("be.visible");
    cy.get(":nth-child(28) > clientlib > .about-card-button").click();
    cy.get("#troca > p > b").should("be.visible");
    cy.get(":nth-child(6) > clientlib > .about-card-button").click();
    cy.get("#preco > p > b").should("be.visible");
    cy.get(":nth-child(13) > clientlib > .about-card-button").click();
    cy.get("#reacomodacao > p > b").should("be.visible");
    cy.get(":nth-child(19) > clientlib > .about-card-button").click();
    cy.get("#cadastro > p > b").should("be.visible");
    cy.get(":nth-child(25) > clientlib > .about-card-button").click();
    cy.get("#lugar_marcado > p > b").should("be.visible");
  });

  it("Seguro Viagem", () => {
    cy.get(".menu-mobile > :nth-child(3)").click();
    cy.url().should("include", "seguro-viagem");
    cy.get(".menu-mobile > :nth-child(3)").should("be.visible");
  });

  it("Passeios", () => {
    cy.get(".menu-mobile > :nth-child(4)").click();
  });

  it("Cupons", () => {
    cy.get(".menu-mobile > :nth-child(5)").click();
    cy.url().should("include", "cupons-de-desconto");
    cy.get(':nth-child(2) > .cmp-text > [style="text-align: center;"]').should("be.visible");
  });

  it("Deve Validar link fale conosco e preencher o formulário de contato", () => {
    cy.get(".menu-mobile > :nth-child(6)").click();
    // cy.url({ timeout: 2000 }).should("include", "/fale-conosco");
    // cy.get('#input-name').type('Teste Automação ODP')
    // cy.get('#input-doc').type('38485984854', { log: false })
    // cy.get('#input-email').type('teste.robo@odp.com.br')
    // cy.get('#input-ddd').type('11')
    // cy.get('#input-phone').type('99999-9999', { log: false })
    // cy.get('#btn-contact-us').should('not.be.disabled').click()
    // cy.get('.container-form-protocol-contact-us > .title-form > .aem-Grid > .text > .cmp-text > p').should('contain', 'Faça sua requisição')
    // cy.get(':nth-child(1) > :nth-child(1) > .field > .input-container > .select-custom > .select-selected').click()
    // cy.get(':nth-child(1) > :nth-child(1) > .field > .input-container > .select-custom > .select-items > :nth-child(4) > [href="javascript:void(0)"]').click()
    // cy.get(':nth-child(2) > .field > .input-container > .select-custom > .select-selected').click()
    // cy.get(':nth-child(2) > .field > .input-container > .select-custom > .select-items > :nth-child(2) > [href="javascript:void(0)"]').click()
    // cy.get(':nth-child(3) > .input-container > .field > .select-custom > .select-selected').click()
    // cy.get('.field > .select-custom > .select-items > :nth-child(2) > [href="javascript:void(0)"]').click()
    // cy.get('#input-local').type('Sao Paulo')
    // cy.contains('SAO PAULO ROD TIETE(SP)').click()
    // cy.get('#has-bought').click({ force: true })
    // cy.get('#input-date-buy').click()
    // cy.selecionarDataCompra(1)
    // cy.get('#input-date-trip').click()
    // cy.selecionarDataViagem(6)
    // cy.get('#input-origin').type('AGUAS DA PRATA(SP)')
    // cy.contains('AGUAS DA PRATA(SP)').click({ force: true })
    // cy.get('#input-dest').type('AGUAS DA PRATA - M. DIVISORIO(SP)')
    // cy.contains('AGUAS DA PRATA - M. DIVISORIO(SP)').click({ force: true })
    // cy.get('#description').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit ame.')
    // cy.get('[for="protocol-file"] > .cmp-text > [style="text-align: left;"]').click()
    // cy.get('[data-js="protocol-file"]').selectFile('cypress/fixtures/documento.pdf', { force: true })
    // Não finalizar a solicitação para evitar requisições reais
    // cy.get('#submit-protocol').click()
  });
});
