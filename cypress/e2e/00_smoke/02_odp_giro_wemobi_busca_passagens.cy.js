/// <reference types='cypress' />

import loc from "../../support/locators";
// const { faker } = require('@faker-js/faker');3
const credenciais = require("../../../cypress.env.json"); // Ajuste a quantidade de "../" para chegar até à raiz se necessário
// 15/05/2026 - incio com github actions
const odp = "www.outletdepassagens.com.br";
const giro = "www.clubegiro.com.br";
const wemobi = "www.wemobi.me";

describe("Digital - Fazer busca de destinos, selecionar datas, compra de passagens, selecionar assentos ", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
  });
});
it("Clube Giro - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  Cypress.on("uncaught:exception", (err, runnable) => {
    return false;
  });

  // Captura os dados de ambiente mapeados na configuração
  const login = Cypress.env("login");
  const senha = Cypress.env("senha");
  const mailUser = Cypress.env("mailUsername");
  const mailPass = Cypress.env("mailPassword");

  cy.visit(giro);
  cy.get(loc.HEADER_BOTAO_LOGIN).click();
  cy.get(loc.USUARIO).type(login);
  cy.get(loc.SENHA).type(senha, { log: false });
  cy.get(loc.BOTAO_LOGIN).click();

  // Pequena pausa para o modal ser renderizado na tela
  cy.wait(4000);

  cy.get("body").then(($body) => {
    // Verifica se o formulário do 2FA apareceu
    if ($body.find("form.form-twofa").length > 0 || $body.find("[data-js='modal-twofa-form']").length > 0) {
      cy.log("🔒 Modal de Segundo Fator interceptado! Aguardando o disparo do e-mail...");

      cy.task(
        "buscarCodigoMFA",
        {
          email: "anderson.ssantos@jcatlm.com.br",
          senha: "Jc@@2k27",
        },
        { timeout: 60000 },
      ).then((codigo) => {
        // Aumentamos o timeout da task no Cypress para 60s para dar margem

        if (!codigo) {
          throw new Error("❌ Falha crítica: O e-mail com o código de 6 dígitos não foi localizado.");
        }

        cy.log(`✅ Código MFA recuperado com sucesso: ${codigo}`);
        // Aqui você digita o código no input da tela...

        // Clica no input correto baseado no HTML inspecionado e digita o token inteiro
        cy.get('input[data-js="modal-input-password-twofa"]').focus().clear().type(codigo, { delay: 100 });

        // Clica no botão de confirmar mapeado por você
        cy.get(".button-twofa").should("be.visible").click();
      });
    } else {
      cy.log("✅ Entrada direta permitida. Sem bloqueio de MFA neste ciclo.");
    }
  });

  // Aguarda o login concluir com sucesso antes de prosseguir com a busca
  cy.get(loc.MENSAGEM_LOGADO, { timeout: 15000 }).should("contain", "Olá");

  cy.get(loc.BUSCAS.DESTINO_IDA).click().type(" Campos Dos Goytacazes - Shopping Estrada (RJ) ", { delay: 100 });
  cy.contains(" Campos Dos Goytacazes - Shopping Estrada (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Macaé - Terminal Rodoviário (RJ) ", { delay: 100 });
  cy.contains(" Macaé - Terminal Rodoviário (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DATA_IDA).click();
  cy.get(loc.LOADER).should("not.exist");
  cy.selecionarDataIda(5);
  cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  cy.selecionarAssentoAleatorio({ timeout: 90000 });
  cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
});

it.only("Wemobi - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  cy.env(["login", "senha"]).then((env) => {
    cy.visit(wemobi);
    cy.get("#button-header-login").click();
    cy.get(loc.USUARIO).type(env.login);
    cy.get(loc.SENHA).type(env.senha, { log: false });
    cy.get("#button-login-confirm").click();
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  });
  cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
  cy.contains(" São Paulo - Rodoviária Tietê (SP) ").click({ force: true });
  cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Rodoviária Novo Rio (RJ)", { delay: 100 });
  cy.contains(" Rio De Janeiro - Rodoviária Novo Rio (RJ) ").click({ force: true });
  cy.get(loc.BUSCAS.DATA_IDA).click();
  cy.selecionarDataIda(5);
  cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
  cy.get("#reservation-seat-0").click();
  cy.get('[data-value="random-seat"]').click();
  cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
});

it.only("Outlet de passagens - Deve fazer busca de destinos IDA com 1 passageiro", () => {
  cy.env(["login", "senha"]).then((env) => {
    cy.visit(odp);
    cy.get(".logged-out-section > .btn-outlet").click();
    cy.get(loc.USUARIO).type(env.login);
    cy.get(loc.SENHA).type(env.senha, { log: false });
    cy.get(".button-login").click();
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
  });
  // cy.wait(8000);
  // cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });

  // cy.get(".ui-menu-item").contains("São Paulo - Rodoviária Tietê (SP)").click({ force: true });

  // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro Rodoviária Novo Rio (RJ)", { delay: 100 });

  // cy.contains("Rio De Janeiro - Rodoviária Novo Rio (RJ)").click({ force: true });

  // cy.get(loc.BUSCAS.DATA_IDA).click();
  // cy.selecionarDataIda(5);
  // cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();

  // cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
  // cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
  // cy.get("#reservation-seat-0").click();
  // cy.get('[data-value="random-seat"]').click();
  // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
});
