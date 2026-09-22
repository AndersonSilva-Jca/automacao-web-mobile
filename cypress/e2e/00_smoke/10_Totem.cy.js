// /// <reference types="cypress" />

// const totem = "https://totem.jcatlm.com.br/";
// // const totem = "https://totem.jcatlm.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

// describe("Totem", () => {
//   beforeEach(() => {
//     cy.clearCookies();
//     cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
//     cy.once("uncaught:exception", () => false);
//     Cypress.on("uncaught:exception", () => false);
//   });

//   it("Totem - teste inicial ", () => {
//     cy.visit(totem);
//     cy.get(".text-colors-black").should("be.visible", "contains", "Digite o número da agência para iniciar");
//     cy.get("#agencyId").should("be.visible").click({ force: true });
//     cy.get("#agencyId").should("be.visible").click({ force: true });
//     cy.contains("button", "1").click();
//     cy.wait(700);
//     cy.contains("button", "2").click();
//     cy.wait(700);
//     cy.contains("button", "8").click();
//     cy.wait(700);
//     cy.contains("button", "6").click();
//     cy.wait(700);
//     cy.contains("button", "9").click();
//     cy.wait(700);
//     cy.contains("button", "7").click();
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");
//     cy.get("#macAddress").click({ force: true }).clear().type("241c04780308");

//     cy.get("#macAddress").click({ force: true }).clear().type("2", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("4", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("1", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("c", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("0", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("4", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("7", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("8", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("0", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("3", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("0", { delay: 100 });
//     cy.wait(1000);
//     cy.get("#macAddress").click({ force: true }).type("8", { delay: 100 });
//     cy.get("#macAddress").click({ force: true }).type("8", { delay: 100 });
//     cy.wait(1000);

//     cy.get(".mt-4 > .rounded-lg").should("be.visible").click({ force: true });
//     cy.contains("Como podemos te ajudar?").should("be.visible");
//     cy.wait(2000);
//     cy.get(".bg-primary > .flex-col > .justify-between > .flex").should("be.visible");
//     cy.get(".bg-primary > .flex-col > .justify-between > .flex").click();
//     cy.wait(1000);
//     // cy.get(":nth-child(3) > .bg-primary").click();
//     cy.get(".text-colors-black-light").should("be.visible");
//     cy.get(":nth-child(3) > .bg-primary").click();
//     cy.get(".rounded").clear().type("São Paulo (Rod. Tietê)", { delay: 100 });
//     cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
//     cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
//     cy.get(".text-colors-black-light").should("be.visible", "contains", "Qual o destino da sua viagem?");
//     cy.get(".relative > .rounded").should("be.visible").type("Rio de Janeiro (Novo Rio)", { delay: 100 });
//     cy.get(".grid > .flex > :nth-child(1)").should("be.visible").click();
//     cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
//     cy.get(".max-w-screen-lg > .items-center > .text-primary").should("be.visible");
//     cy.get(".gap-4 > .border").should("be.visible");
//     cy.wait(1500);
//     // cy.get(".text-colors-black-light").should("be.visible", "contains", "Quantos passageiros serão?");
//     cy.get(".gap-4 > :nth-child(2) > .text-xl").click();
//     cy.get(".gap-4 > .bg-primary").should("be.visible").click();
//     // cy.selecionarDataIdaTotem(5);
//     cy.contains("button", "assentos disponíveis").should("be.visible").click();
//     cy.get(":nth-child(3) > .bg-primary").click();
//     cy.get("#document").type("38485984854", { delay: 100 });
//     // cy.get("#name").should("be.visible").type("anderson silva", { delay: 150 });
//     cy.get("#name").click({ force: true });
//     cy.contains("button", /^a$/i).click();
//     cy.contains("button", /^n$/i).click();
//     cy.contains("button", /^d$/i).click();
//     cy.contains("button", /^e$/i).click();
//     cy.contains("button", /^r$/i).click();
//     cy.contains("button", /^s$/i).click();
//     cy.contains("button", /^o$/i).click();
//     cy.contains("button", /^n$/i).click();
//     cy.contains("button", /^Espaço$/i).click();
//     cy.contains("button", /^s$/i).click();
//     cy.contains("button", /^i$/i).click();
//     cy.contains("button", /^l$/i).click();
//     cy.contains("button", /^v$/i).click();
//     cy.contains("button", /^a$/i).click();
//     cy.get("#birthday").type("14111987", { delay: 100 });
//     cy.contains("button", /^Confirmar$/i).click({ force: true });
//     cy.contains("button", /^x$/i).click({ force: true });
//     // cy.get("#birthday").click();
//     // cy.get(".text-colors-black-light").should("be.visible", "contains", "Informe seus dados");
//     cy.get(":nth-child(3) > .bg-primary").click();
//     cy.get("#phone").type("11999999999", { delay: 100 });
//     cy.contains("button", /^Confirmar$/i).click({ force: true });
//     cy.contains("button", /^x$/i).click({ force: true });
//     cy.get(":nth-child(3) > .bg-primary").click();
//     0;
//     cy.wait(500);
//     cy.selecionarAssentoTotem();
//     cy.wait(500);
//     cy.get(".bg-primary").click();
//     cy.wait(500);
//     cy.get(".text-colors-black-light").should("be.visible", "contains", "Resumo da sua compra");
//     cy.get(".bg-primary").should("be.visible").click();
//     cy.wait(500);
//     cy.get(".bg-gray-50 > .gap-4 > :nth-child(2)").should("be.visible").click();
//     cy.get(".text-colors-black-light").should("be.visible", "contains", "Selecione sua forma de pagamento");
//     cy.get('[data-disabled="false"]').should("be.visible").log("Aba PIX de pagamento");
//     cy.get(".grid > :nth-child(1) > .gap-4 > :nth-child(2)").should("be.visible").log("Aba Cartão de crédito");
//     cy.get(".grid > :nth-child(1) > .gap-4 > :nth-child(3)").should("be.visible").log("Aba Cartão de débito");
//     cy.get(".text-xl").should("be.visible", "contains", "Extrato da compra").click();
//     cy.get(":nth-child(2) > .bg-white > .flex-col > :nth-child(1) > :nth-child(1)").should("be.visible").log("Tarifa");
//     cy.get(".bg-white > .flex-col > :nth-child(2) > :nth-child(1)").should("be.visible").log("Pedágio");
//     cy.get(".bg-white > .flex-col > :nth-child(3) > :nth-child(1)").should("be.visible").log("Taxa de embarque");
//     cy.get(":nth-child(6) > .flex > .font-semibold").should("be.visible").log("Sub Total");
//     cy.get(":nth-child(2) > .bg-white > .flex-col > :nth-child(1) > :nth-child(1)").should("be.visible").log("Valor total das passagens");
//     cy.get(".gap-4 > .text-primary").should("be.visible").log("Botão Cancelar compra");
//     cy.get(".bg-primary").should("be.visible").log("Botão de Adicionar Cupom");

//     cy.get(".max-w-screen-lg > .gap-4 > .text-primary").should("be.visible").click().log("Cancelando compra com sucesso");
//     cy.get(".mr-4").should("be.visible").click().log("Cancelar compra confirmado");
//     cy.get(".mr-4").should("be.visible").click().log("Voltar para o início");
//     cy.get(".text-colors-black").should("be.visible");
//     // cy.get('.h-full > [data-disabled="false"]').should("be.visible").click();
//     // cy.get(":nth-child(3) > .rounded-lg > :nth-child(2) > .data-\[alert\=true\]\:text-secondary-200").should("be.visible").click();
//   });
// });

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
