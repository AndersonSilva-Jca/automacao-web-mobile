/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Wemobi", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(wemobi);
      cy.get(loc.WEMOBI_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.WEMOBI_BOTAO_ENTRAR).click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });

    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Rio-de-Janeiro---Todos-(RJ)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.fecharModalUpgradePoltrona();
    // cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    cy.get(loc.WEMOBI_BOTAO_RESERVAR_ASSENTO).click().log("Selecionando assento");
    cy.get(loc.WEMOBI_BOTAO_ESCOLHER_ASSENTO).click();
    cy.selecionarAssentoAleatorioWemobi();
    // cy.fecharModalUpgradePoltrona({ timeout: 90000 }).log("Fechando modal de upgrade de poltrona");
    cy.get(loc.WEMOBI_ABA_PAGAMENTOS).should("be.visible").log("Aba de pagamentos visível");
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.WEMOBI_ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  });
});
