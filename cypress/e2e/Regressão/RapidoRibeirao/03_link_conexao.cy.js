/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar link do clube giro", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(rapidoRibeirao);
  });

  it("Deve validar o link do card de clube giro e redirecionar para a página do clube giro", () => {
    cy.get("#slick-slide20 > .carousel-cards-content-text > .aem-Grid > .button > clientlib > .about-card-button > .focusable").invoke("removeAttr", "target").click({ force: true });
    cy.url().should("include", "https://www.rapidoribeiraopreto.com.br/clubegiro");
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

  it("Deve validar o link do card de conexão com os ônibus e redirecionar para a página de contato", () => {
    cy.get("#headingitem0").click();
    cy.get("#headingitem1").click();
    cy.get('.focusable > [style="color: rgb(16,152,247);"]').click({ force: true });
    cy.url().should("include", "/fale-conosco");
  });
});
