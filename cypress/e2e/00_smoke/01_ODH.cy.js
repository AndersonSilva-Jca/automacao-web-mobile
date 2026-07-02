/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const odt = "https://www.outletdehoteis.com.br";

describe("Outlet de Hotéis", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de Hotéis - Busca de destinos, Hotéis em promoção hoje, Promoção em hotéis por destino", () => {
    cy.visit(odt);
    cy.contains("Minhas viagens1").should("be.visible");
    cy.contains("Carrinho").should("be.visible");
    cy.wait(2000);
    const cidades = ["Rio de Janeiro (e arredores)", "São Paulo (e arredores)", "Belo Horizonte (e arredores)", "Curitiba (e arredores)", "Salvador (e arredores)"];
    const indiceAleatorio = Math.floor(Math.random() * cidades.length);
    const cidadeSorteada = cidades[indiceAleatorio];
    cy.get(".h-full > .flex > .min-w-0 > .w-full").click().type(cidadeSorteada, { delay: 25 });
    cy.get(`[cmdk-item][data-value="${cidadeSorteada}"]`).first().click({ force: true });
    cy.log(`🏙️ Destino sorteado e selecionado para o teste: ${cidadeSorteada}`);
    cy.get(".text-sm > .text-muted-foreground").click();
    cy.selecionarPeriodoEstadia(3);
    cy.get(".p-2 > .whitespace-nowrap").click();
    cy.get(".absolute").should("be.visible");
    cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    cy.get(".cursor-pointer > .h-8").click();

    // Hotéis em promoção hoje
    cy.contains("Hotéis em promoção hoje").should("be.visible");
    cy.get(":nth-child(1) > .group > .p-4 > .justify-between > .inline-flex").click();
    cy.contains("Sobre o hotel").should("be.visible");
    cy.get(".cursor-pointer > .h-8").click();
    cy.get(":nth-child(2) > .group > .p-4 > .justify-between > .inline-flex").click();
    cy.contains("Sobre o hotel").should("be.visible");
    cy.get(".cursor-pointer > .h-8").click();
    cy.get(":nth-child(3) > .group > .p-4 > .justify-between > .inline-flex").click();
    cy.contains("Sobre o hotel").should("be.visible");
    cy.get(".cursor-pointer > .h-8").click();

    // Promoção em hotéis por destino
    // cy.contains("Promoção em hotéis por destino").should("be.visible");
    // cy.get('img[alt="Fernando de Noronha"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
    // cy.get('img[alt="Jericoacoara"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
    // cy.get('img[alt="Porto de Galinhas"]').click();
    // cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
    // cy.get(".cursor-pointer > .h-8").click();
  });
});
