// 21/09/2026 - incio com github actions
/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />

require("cypress-xpath");

const opcaofretur = "https://opcaofretur.com.br/";
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSn5BGXTn1LeQJ9TS_VLZXNBnEP3N8jd6z7_kowjdmrAxCYscjBwkvefEnuyw8ujULg2VlpF9CjxCpE/pub?gid=1463281397&single=true&output=csv";

describe("Opção Fretur - Health Check", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("1. Valida se o servidor do site está ONLINE e respondendo (Status 200)", () => {
    // cy.visit(opcaofretur)
    cy.request({
      method: "GET",
      url: opcaofretur,
      failOnStatusCode: false,
      timeout: 10000,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.duration).to.be.below(5000); // Resposta em menos de 5 segundos
    });
  });

  it("2. Valida Elementos Críticos da UI", () => {
    cy.visit(opcaofretur);

    // Garante que o corpo do site carregou
    cy.get("body").should("be.visible");

    // Valida se o link do WhatsApp/Atendimento está presente no canto inferior direto
    cy.get(".ht_ctc_padding").should("exist");

    // Valida se o logo principal do site está visivel e funcional
    cy.get(".attachment-full").should("exist").click();

    // Valida se o botão principal de FAÇA UM ORÇAMENTO está visivel e funcional
    cy.get(".elementor-element-b34bbab > .elementor-widget-container > .elementor-button-wrapper > .elementor-button").first().should("be.visible").click();
    cy.get(".e-con-inner > .elementor-element > .elementor-widget-container > .elementor-heading-title").should("be.visible").log("Orçamento visivel");
  });

  // it("3. Valida se a base de dados (Planilha) está respondendo da página ORÇAMENTO (simula exatamente o comportamento do navegador de um cliente real)", () => {
  //   // https://opcaofretur.com.br/orcamento/
  //   cy.request({
  //     method: "GET",
  //     url: CSV_URL,
  //     headers: {
  //       referer: opcaofretur,
  //     },
  //     failOnStatusCode: false,
  //     timeout: 15000,
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     expect(response.body).to.be.a("string");
  //     expect(response.body.length).to.be.greaterThan(0);
  //   });
  // });
});
