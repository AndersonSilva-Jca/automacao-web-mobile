/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar link informações de viagens", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(wemobi);
  });
  it("Validar link - Quem Somos", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(1)").click();
    cy.url().should("include", "/sobre-nos");
    cy.get('[style="color: rgb(174,129,255);"] > b').should("contain", "O melhor da vida pede passagem 🧡");
    cy.get(":nth-child(8) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .aem-GridColumn--phone--hide > .cmp-image > .cmp-image__image").should("be.visible");
    cy.get('[style="width:100%; height:100%;"]').should("be.visible");
    cy.get('[style="color: rgb(255,63,11);"] > b').should("be.visible");
    cy.get(":nth-child(1) > .aem-Grid > .button > clientlib > .about-card-button").should("be.visible");
    cy.get(":nth-child(15) > clientlib > .about-card-button").click();
  });

  it("Validar link - Ajuda", () => {
    cy.get("#header-nav-item-Ajuda").click();
    cy.get("[href='#achadoseperdidos']").click();
    cy.get("#achadoseperdidos > p").should("be.visible");
    cy.get("#btn-comp-Bagagem").click();
    cy.get('[href="#cancelamento"]').click();
    cy.get('[href="https://www.wemobi.me/informacao-de-viagem/categorias"]').should("be.visible");
    cy.get('[href="#descontonopix"]').click();
    cy.get('[href="#gratuidade"]').click();
    cy.get('[href="#locais"]').click();
    cy.get('[href="#orientacoes"]').click();
    cy.get('[href="#reacomodacao"]').click();
    cy.get('[href="#remarcacao"]').click();
    cy.get('[href="#transporte"]').click();
    cy.get('[href="https://www.wemobi.me/informacao-de-viagem/sosbus"]').should("be.visible");
    cy.get('[href="#cupom"]').click();
    cy.get('[href="#lugar_marcado"]').click();
  });

  it("Validar link - Blog", () => {
    cy.get("#header-nav-item-Blog").click();
    cy.get(".section-title > b").should("contain", "Blog da wemobi");
  });

  it("Validar link - Nossas Rotas", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(4)").click();
    cy.get(':nth-child(4) > .cmp-text > [style="color: rgb(255,115,0);text-align: center;"]').should("be.visible");
  });

  it("Validar link - Baixe o APP", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(5)").click();
    cy.get(".card-title > b").should("contain", "APP wemobi – Sua Passagem de Ônibus no Celular");
  });

  it("Deve Validar link - Cadastre-se", () => {
    cy.get("#header-nav-item-Cadastre-se").click();
    cy.get(".register-wrapper").should("be.visible");
  });
  it("Deve validar link - Cupons", () => {
    cy.get("#header-nav-item-Cupons").click();
    cy.get(".image.aem-GridColumn--phone--hide > #topo > #cmp-image-link > .cmp-image__image").should("be.visible");
    cy.get('[style="color: #FFFFFF !important; background-color: #FFFFFF; margin: 0px 0px 0px 0px "] > :nth-child(2)').should("be.visible");
  });
});
