/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const giro = "https://www.clubegiro.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar todos os Links Footer", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit(giro);
  });
  it("Deve validar Links Footer - Instagram", () => {
    cy.get('[src="/content/dam/nova-home-giro/Sharp.png"]').click();
  });

  it("Deve validar Links Footer - Facebook", () => {
    cy.get('[src="/content/dam/nova-home-giro/Sharp1.png"]').click();
  });

  it("Deve validar Links Footer - Vendas whatsapp", () => {
    cy.get('[href="https://wa.me/5511911920091?text="]').click();
  });
  it("Deve validar Links Footer - Fale Conosco", () => {
    cy.get(".footer-desktop-plus").should("be.visible").log("Footer");
  });
});
