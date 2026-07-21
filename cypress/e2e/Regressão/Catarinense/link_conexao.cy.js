/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../support/locators.js";
const cometa = "https://www.viacaocometa.com.br";
const viacao1001 = "https://www.autoviacao1001.com.br";
const catarinense = "https://www.catarinense.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";
const expressoSul = "https://www.expressodosul.com.br/";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/";
const odp = "https://www.outletdepassagens.com.br";
const odt = "https://www.outletdehoteis.com.br";
const giro = "https://www.clubegiro.com.br";
const wemobi = "https://www.wemobi.me";

describe("Validar link do clube giro", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit("/");
  });

  it("Deve validar o link do card de clube giro e redirecionar para a página do clube giro", () => {
    cy.get("#slick-slide20 > .carousel-cards-content-text > .aem-Grid > .button > clientlib > .about-card-button > .focusable").invoke("removeAttr", "target").click({ force: true });
    // cy.url().should('include', 'https://www.viacaocometa.com.br/clubegiro')
    // cy.env(['login', 'senha']).then((env) => {
    //   cy.get('#header-login-button').click()
    //   cy.get('#input-login').type(env.login)
    //   cy.get('#input-password').type(env.senha, { log: false })
    //   cy.get('#button-login').click()
    //   cy.get('.logged-message').should('contain', 'Olá')
    // cy.get(':nth-child(6) > .custom-padding > .container > :nth-child(1) > .aem-Grid > .button > clientlib > .about-card-button > .focusable').invoke('removeAttr', 'target').click({ force: true })
    //   cy.url().should('include', 'https://www.clubegiro.com.br/')
    // })
  });

  it("Deve validar o link do card de outlet de hotéis e redirecionar para a página do outlet de hotéis", () => {
    // cy.get('#slick-slide21 > .carousel-cards-content-text > .aem-Grid > .button > clientlib > .about-card-button > .focusable').invoke('removeAttr', 'target').click();
    // cy.url().should('include', 'www.outletdehoteis.com.br');
  });

  it("Deve validar o link do card de conexão com aeroportos e redirecionar para a página de conexão com aeroportos", () => {
    // cy.get('[data-tab="slick_tabs-content-carousel-1"]').click({ force: true });
    // cy.get('#slick-slide80 > .carousel-cards-content-text > .aem-Grid > .button > clientlib > .about-card-button > .focusable').click({ force: true });
    // cy.url().should('include', '/destinos/aeroporto')
  });

  it("Deve validar o link do card de conexão com o Porto de Santos e redirecionar para a página de conexão com o Porto de Santos", () => {
    // cy.get('[data-tab="slick_tabs-content-carousel-2"]').click({ force: true });
    // cy.get('#slick-slide90 > .carousel-cards-content-text > .aem-Grid > .button > clientlib > .about-card-button > .focusable').click({ force: true });
    // cy.url().should('include', '/destinos/porto-santos')
  });

  it("Deve validar o link do card de conexão com os ônibus e redirecionar para a página de contato", () => {
    cy.get("#headingitem0").click();
    cy.get("#headingitem1").click();
    cy.get("#headingitem2").click();
    cy.get("#headingitem3").click();
    cy.get('[style="color: rgb(255,0,150);"] > .focusable > span').click({ force: true });
    cy.url().should("include", "fale-conosco");
  });
});
