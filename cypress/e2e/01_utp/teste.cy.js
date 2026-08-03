// import loc from "../../support/locators";
// const { faker } = require('@faker-js/faker');3
// const credenciais = require("../../../cypress.env.json"); // Ajuste a quantidade de "../" para chegar até à raiz se necessário
// 15/05/2026 - incio com github actions
// const giro = "www.clubegiro.com.br";

// describe("Digital - Fazer busca de destinos, selecionar datas, compra de passagens, selecionar assentos ", () => {
//   beforeEach(() => {
//     cy.clearCookies();
//     cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
//   });
// });
// it.only("Clube Giro - Deve fazer busca de destinos IDA com 1 passageiro", () => {
//   Cypress.on("uncaught:exception", (err, runnable) => {
//     return false;
//   });

//   // Captura os dados de ambiente mapeados na configuração
//   const login = Cypress.env("login");
//   const senha = Cypress.env("senha");
//   const mailUser = Cypress.env("mailUsername");
//   const appMailPassword = Cypress.env("appMailPassword", { log: false });

//   cy.visit(giro);
//   cy.get(loc.HEADER_BOTAO_LOGIN).click();
//   cy.get(loc.USUARIO).type(login);
//   cy.get(loc.SENHA).type(senha, { log: false });
//   cy.get(loc.BOTAO_LOGIN).click();

//   // Pequena pausa para o modal ser renderizado na tela
//   cy.wait(4000);

//   cy.get("body").then(($body) => {
//     // Verifica se o formulário do 2FA apareceu
//     if ($body.find("form.form-twofa").length > 0 || $body.find("[data-js='modal-twofa-form']").length > 0) {
//       cy.log("🔒 Modal de Segundo Fator interceptado! Aguardando o disparo do e-mail...");

//       cy.task(
//         "buscarCodigo2FA",
//         {
//           user: "anderson.ssantos@jcatlm.com.br",
//           password: appMailPassword,
//         },
//         { timeout: 60000 },
//       ).then((codigo) => {
//         // Aumentamos o timeout da task no Cypress para 60s para dar margem

//         if (!codigo) {
//           throw new Error("❌ Falha crítica: O e-mail com o código de 6 dígitos não foi localizado.");
//         }

//         cy.log(`✅ Código MFA recuperado com sucesso: ${codigo}`);
//         // Aqui você digita o código no input da tela...

//         // Clica no input correto baseado no HTML inspecionado e digita o token inteiro
//         cy.get('input[data-js="modal-input-password-twofa"]').focus().clear().type(codigo, { delay: 100 });

//         // Clica no botão de confirmar mapeado por você
//         cy.get(".button-twofa").should("be.visible").click();
//       });
//     } else {
//       cy.log("✅ Entrada direta permitida. Sem bloqueio de MFA neste ciclo.");
//     }
//   });

//   // Aguarda o login concluir com sucesso antes de prosseguir com a busca
//   cy.get(loc.MENSAGEM_LOGADO, { timeout: 15000 }).should("contain", "Olá");

//   cy.get(loc.BUSCAS.DESTINO_IDA).click().type(" Campos Dos Goytacazes - Shopping Estrada (RJ) ", { delay: 100 });
//   cy.contains(" Campos Dos Goytacazes - Shopping Estrada (RJ) ").click({ force: true });
//   cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Macaé - Terminal Rodoviário (RJ) ", { delay: 100 });
//   cy.contains(" Macaé - Terminal Rodoviário (RJ) ").click({ force: true });
//   cy.get(loc.BUSCAS.DATA_IDA).click();
//   cy.get(loc.LOADER).should("not.exist");
//   cy.selecionarDataIda(5);
//   cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
//   cy.selecionarPassagemAleatoria1({ timeout: 90000 });
//   cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
//   cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
//   cy.selecionarAssentoAleatorio({ timeout: 90000 });
//   cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
// });

// import loc from "../../support/locators";
// const giro = "www.clubegiro.com.br";

// describe("Digital - Fazer busca de destinos, selecionar datas, compra de passagens, selecionar assentos ", () => {
//   beforeEach(() => {
//     cy.clearCookies();
//     cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
//   });

//   // ✅ CORREÇÃO: O 'it' agora está dentro do bloco 'describe'
//   it("Clube Giro - Checkout", () => {
//     Cypress.on("uncaught:exception", (err, runnable) => {
//       return false;
//     });

//     // Captura os dados mapeados no cypress.config.js
//     const login = Cypress.env("login");
//     const senha = Cypress.env("senha");
//     const mailUser = Cypress.env("mailUsername");
//     const appMailPassword = Cypress.env("appMailPassword");

//     cy.visit(giro);
//     cy.get(loc.HEADER_BOTAO_LOGIN).click();
//     cy.get(loc.USUARIO).type(login);
//     cy.get(loc.SENHA).type(senha, { log: false });
//     cy.get(loc.BOTAO_LOGIN).click();

//     cy.wait(4000);

//     cy.get("body").then(($body) => {
//       if ($body.find("form.form-twofa").length > 0 || $body.find("[data-js='modal-twofa-form']").length > 0) {
//         cy.log("🔒 Modal de Segundo Fator interceptado! Aguardando o disparo do e-mail...");

//         // ✅ CORREÇÃO: Passando as propriedades dinâmicas e com os nomes idênticos aos da Task
//         cy.task(
//           "buscarCodigo2FA",
//           {
//             email: mailUser || "anderson.ssantos@jcatlm.com.br", // Usa a env ou o fallback
//             senha: `${(appMailPassword, { log: false })}`, // Usa a senha do app para autenticação, com log desativado
//           },
//           { timeout: 60000 },
//         ).then((codigo) => {
//           if (!codigo) {
//             throw new Error("❌ Falha crítica: O e-mail com o código de 6 dígitos não foi localizado.");
//           }

//           cy.log(`✅ Código MFA recuperado com sucesso: ${codigo}`);
//           cy.get('input[data-js="modal-input-password-twofa"]').focus().clear().type(codigo, { delay: 100 });
//           cy.get(".button-twofa").should("be.visible").click();
//         });
//       } else {
//         cy.log("✅ Entrada direta permitida. Sem bloqueio de MFA neste ciclo.");
//       }
//     });

//     // Aguarda o login concluir com sucesso antes de prosseguir com a busca
//     cy.get(loc.MENSAGEM_LOGADO, { timeout: 15000 }).should("contain", "Olá");

//     cy.get(loc.BUSCAS.DESTINO_IDA).click().type(" Campos Dos Goytacazes - Shopping Estrada (RJ) ", { delay: 100 });
//     cy.contains(" Campos Dos Goytacazes - Shopping Estrada (RJ) ").click({ force: true });
//     cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(" Macaé - Terminal Rodoviário (RJ) ", { delay: 100 });
//     cy.contains(" Macaé - Terminal Rodoviário (RJ) ").click({ force: true });
//     cy.get(loc.BUSCAS.DATA_IDA).click();
//     cy.get(loc.LOADER).should("not.exist");
//     cy.selecionarDataIda(5);
//     cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
//     cy.selecionarPassagemAleatoria1({ timeout: 90000 });
//     cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
//     cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
//     cy.selecionarAssentoAleatorio({ timeout: 90000 });
//     cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
//   });
// }); // ✅ O describe agora fecha corretamente aqui no fim do arquivo!

// // it("Viação Cometa - Deve fazer busca de destinos IDA com 2 passageiros e 1 criança sem assento", () => {
// //   cy.env(["login", "senha"]).then((env) => {
// //     cy.visit(cometa);
// //     cy.get(loc.HEADER_BOTAO_LOGIN).click();
// //     cy.get(loc.USUARIO).type(env.login);
// //     cy.get(loc.SENHA).type(env.senha, { log: false });
// //     cy.get(loc.BOTAO_LOGIN).click({ force: true });
// //     cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
// //   });
// //   cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should("exist").invoke("show");
// //   cy.contains(loc.SP_TODOS).should("exist").invoke("show").click();
// //   cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
// //   cy.contains(loc.RJ_TODOS).should("exist").invoke("show").click();
// //   cy.get(loc.BUSCAS.DATA_IDA).click();
// //   cy.selecionarDataIda(1);
// //   cy.get(loc.BUSCAS.BOTAO_PASSAGEIROS).click();
// //   cy.get(loc.BUSCAS.BOTAO_ADICIONAR_PASSAGEIRO_CRIANCA).click();
// //   cy.get(loc.BUSCAS.BOTAO_FECHAR_QUANTIDADE_PASSAGEIROS).click();
// //   cy.get(loc.BUSCAS.BOTAO_BUSCAR).click();
// //   cy.contains("IDA", { timeout: 90000 }).should("be.visible");
// //   cy.wait(5000);
// //   cy.selecionarPassagemAleatoria1({ timeout: 90000 });
// //   cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
// //   cy.get(loc.NOME_PASSAGEIRO_2).click({ force: true });
// //   cy.contains("Teste Menor de Idade ODP").scrollIntoView().should("be.visible").click({ force: true });
// //   cy.get("#passenger-block-2 > .container > .mb-3 > .pl-lg-4 > .field > .select-custom > .select-selected").click();
// //   cy.get('#passenger-block-2 > .container > .mb-3 > .pl-lg-4 > .field > .select-custom > .select-items > :nth-child(4) > [href="javascript:void(0)"]').click();
// //   cy.get(loc.CLICK_PASSAGEIROS).click({ force: true });
// //   cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
// //   cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
// //   cy.wait(5000);
// //   cy.selecionarAssentoAleatorio("IDA", { timeout: 90000 });
// //   cy.get(loc.BOTAO_AVANCAR, { timeout: 90000 }).should("be.visible").click();
// //   // cy.url().should('include', '/pagamento')
// //   // cy.get('[alt="loader"]').should('not.exist')
// //   // cy.get('#tab-pix').click()
// //   // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
// //   //  Não finalizar a compra para evitar transações reais
// //   // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
// // });

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

  it("Outlet de Hotéis - Busca de destinos, selecionar datas", () => {
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
    });
  });

  it("Giro - Deve fazer login, busca de destinos, selecionar datas, compra de passagens, selecionar assentos", () => {
    // const login = Cypress.env("login2");
    // const senha = Cypress.env("senha2");

    // cy.visit(giro);
    // cy.get(loc.HEADER_BOTAO_LOGIN, { timeout: 90000 }).click();
    // cy.get(loc.USUARIO, { timeout: 90000 }).type(login);
    // cy.get(loc.SENHA, { timeout: 90000 }).type(senha, { log: false });
    // cy.get(loc.BOTAO_LOGIN, { timeout: 90000 }).click();
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
      // Identifica se o modal está ativo
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
      cy.get("#button-header-login").click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get("#button-login-confirm").click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get("#input-departure").click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
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
    cy.get('[data-value="random-seat"]').click();
    cy.fecharModalUpgradePoltrona({ timeout: 90000 });
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
