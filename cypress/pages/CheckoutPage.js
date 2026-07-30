import loc from "../support/locators";

class CheckoutPage {
  // UTP
  validarCupom() {}
  resumoDaCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("exist").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  }
  // OUTLET DE PASSAGENS
  odpResumoDaCompra() {
    cy.get(loc.ODP_ABA_PAGAMENTOS).should("be.visible").log("Aba de pagamentos visível");
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.ODP_ASSERT_VALORTOTAL).should("contain", "Valor Outlet").log("Valor total das passagens Outlet");
  }

  // CLUBE GIRO
  giroResumoCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("contain", "Taxa de serviço").log("Taxa de serviço");
    cy.get(loc.GIRO_ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  }
}

export default new CheckoutPage();
