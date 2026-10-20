/// <reference types="cypress" />

const totem = "https://totemhml.jcatlm.com.br/";

import loc from "../../support/locators";

describe("Totem", () => {
  beforeEach(() => {
    cy.clearCookies();
    // cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Totem - teste inicial", { defaultCommandTimeout: 25000 }, () => {
    cy.visit(totem);

    // Configuração inicial
    cy.get(loc.TOTEM_ASSERT_INICIAL).should("be.visible");
    cy.get("#agencyId").should("be.visible").click({ force: true });
    cy.get("#agencyId").should("be.visible").click({ force: true });

    const agenciaDigits = ["1", "2", "8", "6", "9", "7"];
    agenciaDigits.forEach((digit) => {
      cy.contains("button", digit).click({ force: true });
      cy.wait(200);
    });

    cy.get(loc.TOTEM_MACADDRESS).click({ force: true }).clear().type("241c04780308", { delay: 50 });

    cy.get(loc.TOTEM_CONFIRMAR).should("be.visible").click({ force: true });
    cy.contains(loc.TOTEM_ASSERT_HELP).should("be.visible");

    cy.get(".bg-primary > .flex-col > .justify-between > .flex").should("be.visible").click();
    cy.get(".text-colors-black-light").should("be.visible");
    cy.get(":nth-child(3) > .bg-primary").click();

    cy.get(".rounded").clear().type("São Paulo (Rod. Tietê)", { delay: 50 });
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    cy.get(".text-colors-black-light").should("be.visible");
    cy.get(".relative > .rounded").should("be.visible").type("Rio de Janeiro (Novo Rio)", { delay: 50 });
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    cy.get(".text-colors-black-light").should("be.visible").log("Quantos Passageiros serão?");
    cy.get(".gap-4 > .border").should("be.visible");
    cy.get(".gap-4 > :nth-child(2) > .text-xl").click();
    cy.get(".gap-4 > .bg-primary").should("be.visible").click();
    cy.get(".whitespace-nowrap").should("be.visible").click();
    cy.get("button.react-calendar__tile")
      .not("[disabled]")
      .not(".react-calendar__tile--now")
      .then(($diasDisponiveis) => {
        const quantidadeDeDias = $diasDisponiveis.length;

        const indiceSorteado = Math.floor(Math.random() * quantidadeDeDias);

        cy.wait(1000);
        cy.wrap($diasDisponiveis).eq(indiceSorteado).click();
      });

    cy.wait(1000);

    cy.get('div[data-selected="false"][data-disabled="false"]').then(($quantidadeDePassagens) => {
      const passagensDisponiveis = $quantidadeDePassagens.length;
      const sorteio = Math.floor(Math.random() * passagensDisponiveis);
      cy.wrap($quantidadeDePassagens).eq(sorteio).click();
    });

    cy.contains("button", "assentos disponíveis", { timeout: 7000 }).should("be.visible").click();
    cy.get(":nth-child(3) > .bg-primary").click();

    cy.get("#document").type("38485984854", { delay: 50 });
    cy.get("#name").click({ force: true });

    const nomeTeclado = ["a", "n", "d", "e", "r", "s", "o", "n", "Espaço", "s", "i", "l", "v", "a"];
    nomeTeclado.forEach((char) => {
      const regexChar = new RegExp(`^${char}$`, "i");
      cy.contains("button", regexChar).click();
    });

    cy.get("#birthday").type("14111987", { delay: 50 });
    cy.contains("button", /^Confirmar$/i).click({ force: true });
    cy.contains("button", /^x$/i).click({ force: true });

    cy.get(":nth-child(3) > .bg-primary").click();
    cy.get("#phone").type("11999999999", { delay: 50 });
    cy.contains("button", /^Confirmar$/i).click({ force: true });
    cy.contains("button", /^x$/i).click({ force: true });
    cy.get(":nth-child(3) > .bg-primary").click();

    cy.url()
      .should("not.eq", totem, { timeout: 1000 })
      .then(() => {
        cy.log("✅ Validação de URL OK: Sessão do Totem ativa.");
      });

    cy.selecionarAssentoTotem();

    cy.get(".bg-primary", { timeout: 6000 }).click();
    cy.get(".text-colors-black-light").should("be.visible").and("contain", "Resumo da sua compra");
    cy.get(".bg-primary").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    cy.get(".text-colors-black-light").should("be.visible").and("contain", "Selecione sua forma de pagamento");
    cy.get('[data-disabled="false"]').should("be.visible");
    cy.get(".text-xl").should("be.visible").and("contain", "Extrato de compra").click();

    cy.get(":nth-child(2) > .bg-white > .flex-col > :nth-child(1) > :nth-child(1)").should("be.visible");
    cy.get(".bg-white > .flex-col > :nth-child(2) > :nth-child(1)").should("be.visible");
    cy.get(".bg-white > .flex-col > :nth-child(3) > :nth-child(1)").should("be.visible");

    // Cancelamento da compra
    // cy.get(".max-w-screen-lg > .gap-4 > .text-primary").should("be.visible").click();
    // cy.get(".mr-4").should("be.visible").click();
    // cy.get(".mr-4").should("be.visible").click();
    // cy.get(".text-colors-black").should("be.visible");
  });
});
