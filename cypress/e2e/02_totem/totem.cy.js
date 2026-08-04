/// <reference types="cypress" />

const totem = "https://totem.jcatlm.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Totem", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Totem", () => {
    cy.visit(totem);
    cy.get(".text-colors-black").should("be.visible");
    cy.get("#agencyId").should("be.visible").click({ force: true });
    cy.get("#agencyId").should("be.visible").click({ force: true });
    cy.contains("button", "1").click();
    cy.contains("button", "8").click();
    cy.contains("button", "6").click();
    cy.contains("button", "9").click();
    cy.contains("button", "7").click();
    cy.get("#macAddress").click().type("241c04780308", { delay: 100 });
    cy.get(".mt-4 > .rounded-lg").should("be.visible").click();
    cy.get(".bg-primary").should("be.visible");
    cy.get(".undefined").should("be.visible");
    cy.get(".bg-primary").click();
    // cy.get(":nth-child(3) > .bg-primary").click();
    cy.get(".text-colors-black-light").should("be.visible");
    cy.get(":nth-child(3) > .bg-primary").click();
    cy.get(".rounded").clear().type("São Paulo (Rod. Tietê)");
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
    cy.get(".text-colors-black-light").should("be.visible", "contains", "Qual o destino da sua viagem?");
    cy.get(".relative > .rounded").should("be.visible").type("Rio de Janeiro (Novo Rio)");
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
    cy.get(".text-colors-black-light").should("be.visible", "contains", "Quantos passageiros serão?");
    cy.get(".gap-4 > :nth-child(2) > .text-xl").should("be.visible").click();
    cy.get(".gap-4 > .bg-primary").should("be.visible").click();
    cy.get('.h-full > [data-disabled="false"]').should("be.visible").click();
    cy.get(":nth-child(3) > .rounded-lg > :nth-child(2) > .data-\[alert\=true\]\:text-secondary-200").should("be.visible").click();
  });
});
