import loc from "../support/locators";

class CheckoutPage {
  validarCupom() {}
  //------------------ UTP ------------------
  resumoDaCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("exist").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
    // cy.get('.payment-selector-wrapper').should('be.visible').log('Aba de Pagamentos')
    // cy.get('[data-js="tab-nupay"]').should('be.visible').log('Aba da NuPay')
    // cy.get('[data-js="tab-card"]').should("be.visible").log("Aba do Cartão de Crédito");
    // cy.get("#tab-pix").should("be.visible").log("Aba do PIX");
    // cy.get('[data-js="tab-conta-giro"]').should("be.visible").log("Aba da Conta Giro");
  }

  resumoDaCompraCupom() {
    // cy.get("#discount-code").type("MADRUGADA");
    // cy.get("#button-apply-discount").click({ force: true }).log("Cupom Aplicado");
    // cy.get(".warning > p").should("be.visible").log("Desconto aplicado com sucesso !");
    // cy.get('[style=""] > .title-value > .title > .cmp-text > p').should("be.visible").log("Desconto visivel no resumo da compra");
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("exist").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
    // cy.get("#tab-card").should("be.visible").log("Aba do Cartão de Crédito");
    // cy.get("#tab-pix").should("be.visible").log("Aba do PIX");
    // cy.get("#tab-conta-giro").should("be.visible").log("Aba da Conta Giro");
  }

  //------------------ OUTLET DE PASSAGENS ------------------
  odpResumoDaCompra() {
    cy.get(loc.ODP_ABA_PAGAMENTOS).should("be.visible").log("Aba de pagamentos visível");
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(".is-selected").should("be.visible").log("Aba do Cartões de Crédito");
    cy.get('[data-js="tab-nupay"]').should("be.visible").log("Aba da NuPay");
    cy.get('[data-js="tab-pix"]').should("be.visible").log("Aba do PIX");
  }

  //------------------ CLUBE GIRO ------------------
  giroResumoCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.GIRO_ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
    cy.get(".payment-selector-wrapper").should("be.visible").log("Aba de Pagamentos");
    cy.get(".payment-selector__grid > .active").should("be.visible").log("Aba do PIX");
    cy.get('[data-js="tab-card"]').should("be.visible").log("Aba do Cartão de Crédito");
    cy.get('[data-js="tab-conta-giro"]').should("be.visible").log("Aba da Conta Giro");
  }

  //------------------ WEMOBI ------------------
  wemobiResumoCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.WEMOBI_ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
    cy.get('[data-js="tab-card"]').should("be.visible").log("Aba do Cartão de Crédito");
    cy.get(".payment-selector__grid > .active").should("be.visible").log("Aba do PIX");
    cy.get('[data-js="tab-nupay"]').should("be.visible").log("Aba da NuPay");
  }
}

export default new CheckoutPage();
