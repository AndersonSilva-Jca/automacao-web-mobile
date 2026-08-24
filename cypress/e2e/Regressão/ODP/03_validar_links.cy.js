/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const odp = "https://www.outletdepassagens.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar todos os Links Footer", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(odp);
  });
  it("Deve validar Links Footer - Instagram", () => {
    cy.get('[alt="link externo - página do outlet de passagens no instagram"]').click();
  });

  it("Deve validar Links Footer - Facebook", () => {
    cy.get('[alt="link externo - página do outlet de passagens no facebook "]').click();
  });
  it("Deve validar Links Footer - Tiktok", () => {
    cy.get('[alt="link externo - página do outlet de passagens no tiktok"]').click();
    // cy.url().should('include', '/send?phone=5511972645808')
  });
  it("Deve validar Links Footer - ReclameAqui", () => {
    cy.get(".ra-widget-great").click().invoke("removeAttr", "target");
    // cy.url().should('include', '/5511933153607')
  });
});
