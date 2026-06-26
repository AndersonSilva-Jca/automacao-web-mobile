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
    Cypress.on("uncaught:exception", () => false);
  });

  it("Outlet de Hotéis - Busca de destinos, Hotéis em promoção hoje, Promoção em hotéis por destino", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(odt);
      cy.contains("Minhas viagens").should("be.visible");
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
      cy.contains("Promoção em hotéis por destino").should("be.visible");
      cy.get('img[alt="Fernando de Noronha"]').click();
      cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
      cy.get(".cursor-pointer > .h-8").click();
      cy.get('img[alt="Jericoacoara"]').click();
      cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
      cy.get(".cursor-pointer > .h-8").click();
      cy.get('img[alt="Porto de Galinhas"]').click();
      cy.contains(/(resultados de hospedagens|Nenhum hotel encontrado)/i).should("be.visible");
      cy.get(".cursor-pointer > .h-8").click();
    });
  });

  it("Giro - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login2", "senha"]).then((env) => {
      cy.visit(giro);
      cy.get(loc.HEADER_BOTAO_LOGIN).should("be.visible").click();
      cy.get(".login-title").should("contain", "Faça seu login");
      cy.get(loc.USUARIO).should("be.visible").type("andynho1987@gmail.com", { delay: 150 });
      cy.get(loc.SENHA).should("be.visible").type(env.senha, { log: false }, { delay: 150 });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
      cy.wait(4000);
    });
    cy.get("body").then(($body) => {
      const temModal2FA = $body.find('input[data-js="modal-input-password-twofa"]:visible').length > 0;
      if (temModal2FA) {
        cy.log("🔐 Modal 2FA detectado e visível – buscando código no e-mail...");
        cy.task("buscarCodigo2FAGmail").then((codigo2FA) => {
          expect(codigo2FA).to.not.be.null;
          cy.get('input[data-js="modal-input-password-twofa"]').focus().clear({ force: true }).type(codigo2FA, { force: true, delay: 80 }); // force ignora visibility
          cy.get('button[data-js="modal-button-twofa"]').should("not.be.disabled").click();
        });
      } else {
        cy.log("✅ Login direto – Modal 2FA está oculto (display: none). Pulando etapa.");
      }
    });
    cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
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
  });

  it("Wemobi - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
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
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Rodoviária Novo Rio (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Rio-De-Janeiro---Rodoviária-Novo-Rio-(RJ)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get("#passenger-identification-proceed").should("be.visible").and("not.be.disabled").click();
    cy.get("#reservation-seat-0").click();
    cy.fecharModalUpgradePoltrona({ timeout: 90000 });
    cy.get('[data-value="random-seat"]').click();
    cy.get("#seat-reservation-v2-button-proceed").should("be.visible").and("not.be.disabled").click();
    cy.get(".payment-type-container > .col-12 > .active").should("be.visible");
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

    cy.wait(12000);
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Rio-De-Janeiro---Todos-(RJ)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(".btn-footer").should("be.visible").and("not.be.disabled").click();
    cy.get(".payment-type-container > .col-12 > .active").should("be.visible");
  });

  it("Viação Cometa - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    cy.env(["login1", "senha1"]).then((env) => {
      cy.visit(cometa);
      cy.get(loc.HEADER_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login1);
      cy.get(loc.SENHA).type(env.senha1, { log: false });
      cy.get(loc.BOTAO_LOGIN).click({ force: true });
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "TESTE");
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
