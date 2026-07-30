/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const odt = "https://www.outletdehoteis.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Outlet de Hotéis", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de Hotéis - Busca de destinos, Hotéis em promoção hoje, Promoção em hotéis por destino", () => {
    cy.visit(odt);
    cy.contains(loc.ODH_ASSERT_MINHAS_VIAGENS).should("be.visible");
    cy.contains(loc.ODH_ASSERT_CARRINHO).should("be.visible");
    cy.wait(2000);
    const cidades = ["Rio de Janeiro (e arredores)", "São Paulo (e arredores)", "Belo Horizonte (e arredores)", "Curitiba (e arredores)", "Salvador (e arredores)"];
    const indiceAleatorio = Math.floor(Math.random() * cidades.length);
    const cidadeSorteada = cidades[indiceAleatorio];
    cy.get(loc.ODH_INPUT_DESTINO).click().type(cidadeSorteada, { delay: 25 });
    cy.get(`[cmdk-item][data-value="${cidadeSorteada}"]`).first().click({ force: true });
    cy.log(`🏙️ Destino sorteado e selecionado para o teste: ${cidadeSorteada}`);
    cy.get(loc.ODH_CHECKIN).click();
    cy.selecionarPeriodoEstadia(3);
    cy.get(loc.ODH_BOTAO_PROCURAR).click();
    cy.get(loc.ODH_LOADER_BUSCA).should("be.visible");
    cy.contains(loc.ODH_ASSERT_RESULT_HOSPEDAGENS).should("be.visible");
    cy.get(loc.ODH_HOME).click();

    // Hotéis em promoção hoje
    cy.contains(loc.ODH_ASSERT_PROMO_HOJE).should("be.visible");
    cy.get(loc.ODH_PROMO_HOJE_1).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();
    cy.get(loc.ODH_PROMO_HOJE_2).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();
    cy.get(loc.ODH_PROMO_HOJE_3).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();

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
