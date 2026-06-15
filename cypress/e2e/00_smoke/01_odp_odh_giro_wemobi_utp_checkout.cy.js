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

describe("ODH, ODP, Giro, Wemobi, UTP ", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
  });

  it("Outlet de Hotéis - Busca de destinos, selecionar datas", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(odt);
      cy.contains("Minhas viagens").should("be.visible");
      cy.contains("Carrinho").should("be.visible");
      cy.wait(2000);
      const cidades = ["Rio de Janeiro (e arredores)", "São Paulo (e arredores)", "Belo Horizonte (e arredores)", "Curitiba (e arredores)", "Salvador (e arredores)"];
      const indiceAleatorio = Math.floor(Math.random() * cidades.length);
      const cidadeSorteada = cidades[indiceAleatorio];
      cy.get(".h-full > .flex > .min-w-0 > .w-full").click().type(cidadeSorteada, { delay: 50 });
      cy.get(`[cmdk-item][data-value="${cidadeSorteada}"]`).first().click({ force: true });
      cy.log(`🏙️ Destino sorteado e selecionado para o teste: ${cidadeSorteada}`);
      cy.get(".text-sm > .text-muted-foreground").click();
      cy.selecionarPeriodoEstadia(3);
      cy.get(".p-2 > .whitespace-nowrap").click();
      cy.get(".absolute").should("be.visible");
      // cy.contains("Selecione a hospedagem ideal para sua viagem", { timeout: 30000 }).should("be.visible");
    });
  });

  it("Giro - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    const login = Cypress.env("login2");
    const senha = Cypress.env("senha2");

    cy.visit(giro);
    cy.get(loc.HEADER_BOTAO_LOGIN).click();
    cy.get(loc.USUARIO).type(login);
    cy.get(loc.SENHA).type(senha, { log: false });
    cy.get(loc.BOTAO_LOGIN).click();
    cy.wait(10000);
    cy.task("buscarCodigo2FAHotmail").then((codigo2FA) => {
      expect(codigo2FA).to.not.be.null;
      cy.get('input[data-js="modal-input-password-twofa"]').clear({ force: true }).type(codigo2FA, { force: true });
      cy.get('button[data-js="modal-button-twofa"]').should("not.be.disabled").click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    // cy.get(loc.BUSCAS.DESTINO_IDA).click().type(" Campos Dos Goytacazes - Shopping Estrada (RJ) ", { delay: 100 });
    // cy.contains(" Campos Dos Goytacazes - Shopping Estrada (RJ) ").click({ force: true });
    // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Macaé - Terminal Rodoviário (RJ) ", { delay: 100 });
    // cy.contains(" Macaé - Terminal Rodoviário (RJ) ").click({ force: true });
    // cy.get(loc.BUSCAS.DATA_IDA).click();
    // cy.get(loc.LOADER).should("not.exist");
    // cy.selecionarDataIda(5);
    // cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    // cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    // cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    // cy.selecionarAssentoAleatorio({ timeout: 90000 });
    // cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(wemobi);
      cy.get("#button-header-login").click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#button-login-confirm").click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    // cy.get("#input-departure").click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    // cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    // cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Rodoviária Novo Rio (RJ)", { delay: 100 });
    // cy.xpath('//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]').click({ force: true });
    // cy.get(loc.BUSCAS.DATA_IDA).click();
    // cy.selecionarDataIda(5);
    // cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    // cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    // cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
    // cy.get("#reservation-seat-0").click();
    // cy.get('[data-value="random-seat"]').click();
    // cy.fecharModalUpgradePoltrona({ timeout: 90000 });
    // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
  });

  it("Outlet de passagens - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(odp);
      cy.get(".logged-out-section > .btn-outlet").click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(".button-login").click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });

    //   cy.wait(12000);
    //   cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });

    //   cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    //   cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Rio De Janeiro - Rodoviária Novo Rio (RJ) ", { delay: 100 });
    //   cy.xpath('//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]').click({ force: true });
    //   cy.get(loc.BUSCAS.DATA_IDA).click();
    // cy.selecionarDataIda(5);
    // cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();

    // cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    // cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    // cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
    // cy.get("#reservation-seat-0").click();
    // cy.get('[data-value="random-seat"]').click();
    // cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
  });

  it("Viação Cometa - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login1", "senha1"]).then((env) => {
      cy.visit(cometa);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.SP_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.RJ_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(2);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.wait(5000);
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.wait(2000);
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get('[alt="loader"]').should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });

  it("1001 - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login1", "senha1"]).then((env) => {
      cy.visit(viacao1001);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.SP_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.RJ_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(2);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.wait(5000);
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.wait(2000);
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });

  it("Catarinense - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(catarinense);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.SP_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.RJ_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(2);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.wait(5000);
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.wait(2000);
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.wait(1000);
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });

  it("Expresso Sul - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login1", "senha1"]).then((env) => {
      cy.visit(expressoSul);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.SP_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.RJ_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(2);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.wait(1000);
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.wait(2000);
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });
  it("Rapidão Ribeirão - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(rapidoRibeirao);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.SP_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.contains(loc.RJ_TODOS).click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(2);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.wait(5000);
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.wait(2000);
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.wait(1000);
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  });
});
