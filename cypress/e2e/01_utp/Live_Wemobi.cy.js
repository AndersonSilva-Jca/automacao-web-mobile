/// <reference types="cypress" />
/// <reference types="@cypress/xpath" />
require("cypress-xpath");
import { parse } from "dotenv";
// 06/06/2026 - incio com github actions
import loc from "../../support/locators.js";
const wemobi = "https://www.wemobi.me/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Wemobi LIVE", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.once("uncaught:exception", () => false);
    Cypress.on("uncaught:exception", () => false);
  });

  it("Wemobi - Teste com o cupom WELIVE90", () => {
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
    cy.selecionarDataIda(11);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoriaNovo({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    // cy.get("#reservation-seat-0").click().log("Selecionando assento");
    cy.fecharModalUpgradePoltrona({ timeout: 90000 }).log("Fechando modal de upgrade de poltrona");

    cy.get(".payment-type-container > .col-12 > .active").should("be.visible").log("Aba de pagamentos visível");
    cy.get(":nth-child(5) > .price > .price-total-label")
      .invoke("text")
      .then((textoOriginal) => {
        const precoOriginal = converterTextoParaNumero(textoOriginal); // Vai ler R$ 104,28

        cy.get("#discount-code").type("WELIVE90");
        cy.get(".input-wrapper > .focusable").click();
        cy.get(".warning > p").should("contain", "DESCONTO APLICADO COM SUCESSO!");
        cy.get('[style=""] > .title-value > .title > .cmp-text > p').should("contain", "Desconto");

        // cy.get('[style=""] > .right > .price') // ⚠️ Troque pelo seletor da linha "Desconto" (onde aparece o valor reduzido)
        //   .invoke("text")
        //   .then((textoDesconto) => {
        //     const valorDescontoReal = converterTextoParaNumero(textoDesconto); // ex: 80.91

        //     // 🎯 A MATEMÁTICA PERFEITA:
        //     // O desconto impresso deve ser exatamente 90% do subtotal da passagem
        //     const valorDescontoEsperado = precoOriginal * 0.9; // 89.90 * 0.90 = 80.91

        //     // Compara o desconto da tela com o cálculo matemático
        //     expect(valorDescontoReal).to.be.closeTo(valorDescontoEsperado, 0.05);

        //     cy.log(`✅ Cupom de 90% validado na tarifa! Desconto aplicado: R$${valorDescontoReal}`);
        //   });
      });

    // cy.get(":nth-child(5) > .price > .price-total-label")
    //   .invoke("text")
    //   .then((textoOriginal) => {
    //     const precoOriginal = converterTextoParaNumero(textoOriginal);
    //     // const precoOroginalLimpo = textoOriginal.replace(/[^\d,.-]/g, "").replace(",", ".");
    //     // const precoOriginalNum = parseFloat(precoOroginalLimpo);
    //     cy.get("#discount-code").type("WELIVE90");
    //     cy.get(".input-wrapper > .focusable").click();
    //     cy.get(".warning > p").should("contain", "DESCONTO APLICADO COM SUCESSO!").log("Mensagem do desconto visível");
    //     cy.get('[style=""] > .title-value > .title > .cmp-text > p').should("contain", "Desconto").log("Valores do Desconto visível");
    //     cy.get(":nth-child(5) > .price > .price-total-label")
    //       .invoke("text")
    //       .then((textoFinal) => {
    //         const precoFinal = converterTextoParaNumero(textoFinal);

    //         const precoEsperado = precoOriginal * 0.1;

    //         expect(precoFinal).to.be.closeTo(precoEsperado, 0.02);

    //         // Log visual no painel do Cypress para você acompanhar na live
    //         cy.log(`Cálculo correto! De R$${precoOriginal} por R$${precoFinal}`);
    //         // const precoDescontoLimpo = textoDesconto.replace(/[^\d,.-]/g, "").replace(",", ".");
    //         // const precoDescontoNum = parseFloat(precoDescontoLimpo);
    //         // const valorEsperado = precoOriginalNum * 0.1;
    //         // expect(precoDescontoNum).to.be.closeTo(valorEsperado, 0.02);
    //         // cy.log(`Cálculo correto! De R$${precoOriginal} por R$${precoFinal}`);
    //       });
    //   });

    // cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    // cy.get(loc.WEMOBI_ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    // cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  });

  it("Wemobi - Teste com o cupom BUSCOLIVE90 ", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(wemobi);
      cy.get(loc.WEMOBI_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.WEMOBI_BOTAO_ENTRAR).click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("Cabo Frio - Terminal Rodoviário (RJ)", { delay: 100 });
    cy.xpath('//*[@id="Cabo-Frio---Terminal-Rodoviário-(RJ)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(8);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoriaBusCo({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    // cy.get("#reservation-seat-0").click().log("Selecionando assento");
    cy.fecharModalUpgradePoltrona({ timeout: 90000 }).log("Fechando modal de upgrade de poltrona");
    cy.get(".payment-type-container > .col-12 > .active").should("be.visible").log("Aba de pagamentos visível");
    cy.get(":nth-child(5) > .price > .price-total-label")
      .invoke("text")
      .then((textoOriginal) => {
        const precoOriginal = converterTextoParaNumero(textoOriginal); // Vai ler R$ 104,28

        cy.get("#discount-code").type("BUSCOLIVE90");
        cy.get(".input-wrapper > .focusable").click();
        cy.get(".warning > p").should("contain", "DESCONTO APLICADO COM SUCESSO!");
        cy.get('[style=""] > .title-value > .title > .cmp-text > p').should("contain", "Desconto");

        // cy.get('[style=""] > .right > .price') // ⚠️ Troque pelo seletor da linha "Desconto" (onde aparece o valor reduzido)
        //   .invoke("text")
        //   .then((textoDesconto) => {
        //     const valorDescontoReal = converterTextoParaNumero(textoDesconto); // ex: 80.91

        //     // 🎯 A MATEMÁTICA PERFEITA:
        //     // O desconto impresso deve ser exatamente 90% do subtotal da passagem
        //     const valorDescontoEsperado = precoOriginal * 0.9; // 89.90 * 0.90 = 80.91

        //     // Compara o desconto da tela com o cálculo matemático
        //     expect(valorDescontoReal).to.be.closeTo(valorDescontoEsperado, 0.05);

        //     cy.log(`✅ Cupom de 90% validado na tarifa! Desconto aplicado: R$${valorDescontoReal}`);
        //   });
      });
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.WEMOBI_ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  });

  it("Wemobi - Teste com o Cupom BUSCO2LIVE90", () => {
    cy.env(["login", "senha"]).then((env) => {
      cy.visit(wemobi);
      cy.get(loc.WEMOBI_BOTAO_LOGIN).click();
      cy.get(loc.USUARIO).type(env.login);
      cy.get(loc.SENHA).type(env.senha, { log: false });
      cy.get(loc.WEMOBI_BOTAO_ENTRAR).click();
      cy.get(loc.MENSAGEM_LOGADO).should("contain", "Olá");
    });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("Juiz De Fora - Terminal Rodoviário", { delay: 100 });
    cy.xpath('//*[@id="Juiz-De-Fora---Terminal-Rodoviário-(MG)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath('//*[@id="São-Paulo---Rodoviária-Tietê-(SP)"]/p[1]').click({ force: true });
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(8);
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
    cy.selecionarPassagemAleatoriaBusCo({ timeout: 90000 });
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
    // cy.get("#reservation-seat-0").click().log("Selecionando assento");
    cy.fecharModalUpgradePoltrona({ timeout: 90000 }).log("Fechando modal de upgrade de poltrona");
    cy.get(".payment-type-container > .col-12 > .active").should("be.visible").log("Aba de pagamentos visível");

    cy.get(":nth-child(5) > .price > .price-total-label")
      .invoke("text")
      .then((textoOriginal) => {
        const precoOriginal = converterTextoParaNumero(textoOriginal); // Vai ler R$ 104,28

        cy.get("#discount-code").type("BUSCO2LIVE90");
        cy.get(".input-wrapper > .focusable").click();
        cy.get(".warning > p").should("contain", "DESCONTO APLICADO COM SUCESSO!");
        cy.get('[style=""] > .title-value > .title > .cmp-text > p').should("contain", "Desconto");

        // cy.get('[style=""] > .right > .price') // ⚠️ Troque pelo seletor da linha "Desconto" (onde aparece o valor reduzido)
        //   .invoke("text")
        //   .then((textoDesconto) => {
        //     const valorDescontoReal = converterTextoParaNumero(textoDesconto); // ex: 80.91

        //     // 🎯 A MATEMÁTICA PERFEITA:
        //     // O desconto impresso deve ser exatamente 90% do subtotal da passagem
        //     const valorDescontoEsperado = precoOriginal * 0.9; // 89.90 * 0.90 = 80.91

        //     // Compara o desconto da tela com o cálculo matemático
        //     expect(valorDescontoReal).to.be.closeTo(valorDescontoEsperado, 0.05);

        //     cy.log(`✅ Cupom de 90% validado na tarifa! Desconto aplicado: R$${valorDescontoReal}`);
        //   });
      });
    // cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    // cy.get(loc.WEMOBI_ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    // cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  });
});

function converterTextoParaNumero(textoFormatado) {
  const textoLimpo = textoFormatado.replace(/[^\d,.-]/g, "").replace(",", ".");
  return parseFloat(textoLimpo);
}
