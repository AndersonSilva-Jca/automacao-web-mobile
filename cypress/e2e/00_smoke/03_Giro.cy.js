/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const cometa = "https://www.viacaocometa.com.br";
const viacao1001 = "https://www.autoviacao1001.com.br";
const catarinense = "https://www.catarinense.com.br/";
const expressoSul = "https://www.expressodosul.com.br/";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/";
const odp = "https://www.outletdepassagens.com.br";
const odt = "https://www.outletdehoteis.com.br";
const giro = "https://www.clubegiro.com.br";
const wemobi = "https://www.wemobi.me";

describe("Clube Giro", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Giro - Deve fazer login, busca de destinos, selecionar datas, seleção de passagens, selecionar assentos", () => {
    cy.env(["login2", "senha"]).then((env) => {
      cy.visit(giro);
      cy.get(loc.GIRO_BOTAO_LOGIN).should("be.visible").click();
      cy.get(".login-title > p").should("contain", "Acesse o Giro");
      cy.get(loc.USUARIO).should("be.visible").type("andynho1987@gmail.com", { delay: 50 });
      cy.get(loc.SENHA).should("be.visible").type(env.senha, { log: false }, { delay: 100 });
      cy.get(loc.GIRO_BOTAO_ENTRAR).click({ force: true });
      cy.wait(4000);
    });
    cy.get("body").then(($body) => {
      const temModal2FA = $body.find('input[data-js="modal-input-password-twofa"]:visible').length > 0;
      if (temModal2FA) {
        cy.log("🔐 Modal 2FA detectado e visível – buscando código no e-mail...");
        cy.wait(5000);
        cy.task("buscarCodigo2FAGmail").then((codigo2FA) => {
          expect(codigo2FA).to.not.be.null;
          cy.get('input[data-js="modal-input-password-twofa"]').focus().clear({ force: true }).type(codigo2FA, { force: true, delay: 80 }); // force ignora visibility
          cy.get('button[data-js="modal-button-twofa"]').should("not.be.disabled").click();
        });
      } else {
        cy.log("✅ Login direto – Modal 2FA está oculto (display: none). Pulando etapa.");
      }
    });
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "ANDERSON");
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("São Paulo - Todos (SP)", { delay: 100 });
    cy.contains("São Paulo - Todos (SP)").click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(5);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.GIRO_ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  });
});
