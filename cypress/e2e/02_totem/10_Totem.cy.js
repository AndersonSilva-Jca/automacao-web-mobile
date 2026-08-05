/// <reference types="cypress" />

const totem = "https://totem.jcatlm.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Totem", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Totem - teste inicial ", () => {
    cy.visit(totem);
    cy.get(".text-colors-black").should("be.visible", "contains", "Digite o número da agência para iniciar");
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
    cy.selecionarDataIdaTotem();
    cy.contains("button", "assentos disponíveis").should("be.visible").click();
    cy.get(":nth-child(3) > .bg-primary").click();
    cy.get("#document").type("38485984854", { delay: 100 });
    // cy.get("#name").should("be.visible").type("anderson silva", { delay: 150 });
    cy.get("#name").click({ force: true });
    cy.contains("button", /^a$/i).click();
    cy.contains("button", /^n$/i).click();
    cy.contains("button", /^d$/i).click();
    cy.contains("button", /^e$/i).click();
    cy.contains("button", /^r$/i).click();
    cy.contains("button", /^s$/i).click();
    cy.contains("button", /^o$/i).click();
    cy.contains("button", /^n$/i).click();
    cy.contains("button", /^Espaço$/i).click();
    cy.contains("button", /^s$/i).click();
    cy.contains("button", /^i$/i).click();
    cy.contains("button", /^l$/i).click();
    cy.contains("button", /^v$/i).click();
    cy.contains("button", /^a$/i).click();

    cy.get("#birthday").type("14111987", { delay: 100 });
    cy.contains("button", /^Confirmar$/i).click({ force: true });
    cy.contains("button", /^x$/i).click({ force: true });
    // cy.get("#birthday").click();
    // cy.get(".text-colors-black-light").should("be.visible", "contains", "Informe seus dados");
    cy.get(":nth-child(3) > .bg-primary").click();
    cy.get("#phone").type("11999999999", { delay: 100 });
    cy.contains("button", /^Confirmar$/i).click({ force: true });
    cy.contains("button", /^x$/i).click({ force: true });
    cy.get(":nth-child(3) > .bg-primary").click();
    cy.selecionarAssentoTotem();
    cy.get(".bg-primary").click();
    cy.get(".text-colors-black-light").should("be.visible", "contains", "Resumo da sua compra");
    cy.get(".bg-primary").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
    cy.get(".text-colors-black-light").should("be.visible", "contains", "Selecione sua forma de pagamento");
    // cy.get(".grid > :nth-child(2) > .bg-white").should("be.visible", "contains", "Extrato da compra").click();
    cy.get(".gap-4 > .text-primary").should("be.visible").click().log("Cancelar compra");
    cy.get(".mr-4").should("be.visible").click().log("Cancelando compra com sucesso");
    cy.get(".mr-4").should("be.visible").click().log("Voltar para o início");
    // cy.get('.h-full > [data-disabled="false"]').should("be.visible").click();
    // cy.get(":nth-child(3) > .rounded-lg > :nth-child(2) > .data-\[alert\=true\]\:text-secondary-200").should("be.visible").click();
  });
});
