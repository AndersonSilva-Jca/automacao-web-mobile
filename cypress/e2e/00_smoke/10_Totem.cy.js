/// <reference types="cypress" />

const totem = "https://totem.jcatlm.com.br/";

describe("Totem", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Totem - teste inicial", { defaultCommandTimeout: 7000 }, () => {
    cy.visit(totem);

    // Configuração inicial
    cy.get(".text-colors-black").should("be.visible");
    cy.get("#agencyId").should("be.visible").click({ force: true });
    cy.get("#agencyId").should("be.visible").click({ force: true });

    // Digitação da agência
    const agenciaDigits = ["1", "2", "8", "6", "9", "7"];
    agenciaDigits.forEach((digit) => {
      cy.contains("button", digit).click();
      cy.wait(200);
    });

    // Digitação do MAC Address otimizada para evitar gastar tempo de sessão
    cy.get("#macAddress").click({ force: true }).clear().type("241c04780308", { delay: 50 });
    cy.get("#macAddress").click({ force: true }).clear().type("241c04780307", { delay: 50 });

    cy.get(".mt-4 > .rounded-lg").should("be.visible").click({ force: true });
    cy.contains("Como podemos te ajudar?").should("be.visible");

    // Seleção de rota
    cy.get(".bg-primary > .flex-col > .justify-between > .flex").should("be.visible").click();
    cy.get(".text-colors-black-light").should("be.visible");
    cy.get(":nth-child(3) > .bg-primary").click();

    // Origem e Destino
    cy.get(".rounded").clear().type("São Paulo (Rod. Tietê)", { delay: 50 });
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    cy.get(".text-colors-black-light").should("be.visible");
    cy.get(".relative > .rounded").should("be.visible").type("Rio de Janeiro (Novo Rio)", { delay: 50 });
    cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    // Passageiros e Busca
    cy.get(".max-w-screen-lg > .items-center > .text-primary").should("be.visible");
    cy.get(".gap-4 > .border").should("be.visible");
    cy.get(".gap-4 > :nth-child(2) > .text-xl").click();
    cy.get(".gap-4 > .bg-primary").should("be.visible").click();

    // Seleção de Viagem
    cy.contains("button", "assentos disponíveis", { timeout: 7000 }).should("be.visible").click();
    cy.get(":nth-child(3) > .bg-primary").click();

    // Formulário de Identificação
    cy.get("#document").type("38485984854", { delay: 50 });
    cy.get("#name").click({ force: true });

    // Digitação do nome no teclado virtual
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

    // 🛑 CHECAGEM ANTI-TIMEOUT/SESSÃO EXPIRADA ANTES DE BUSCAR OS ASSENTOS
    cy.url()
      .should("not.eq", totem, { timeout: 1000 })
      .then(() => {
        cy.log("✅ Validação de URL OK: Sessão do Totem ativa.");
      });

    // Seleção do Assento (Timeout ágil de 6s)
    cy.selecionarAssentoTotem();

    // Avançar para Resumo
    cy.get(".bg-primary", { timeout: 6000 }).click();
    cy.get(".text-colors-black-light").should("be.visible").and("contain", "Resumo da sua compra");
    cy.get(".bg-primary").should("be.visible").click();
    cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();

    // Tela de Pagamento e Extrato
    cy.get(".text-colors-black-light").should("be.visible").and("contain", "Selecione sua forma de pagamento");
    cy.get('[data-disabled="false"]').should("be.visible");
    cy.get(".text-xl").should("be.visible").and("contain", "Extrato de compra").click();

    // Validações dos itens do extrato
    cy.get(":nth-child(2) > .bg-white > .flex-col > :nth-child(1) > :nth-child(1)").should("be.visible");
    cy.get(".bg-white > .flex-col > :nth-child(2) > :nth-child(1)").should("be.visible");
    cy.get(".bg-white > .flex-col > :nth-child(3) > :nth-child(1)").should("be.visible");

    // Cancelamento da compra
    cy.get(".max-w-screen-lg > .gap-4 > .text-primary").should("be.visible").click();
    cy.get(".mr-4").should("be.visible").click();
    cy.get(".mr-4").should("be.visible").click();
    cy.get(".text-colors-black").should("be.visible");
  });
});
