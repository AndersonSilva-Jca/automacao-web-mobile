import loc from "../support/locators";

class CheckoutPage {
  validarCupom() {}
  resumoDaCompra() {
    cy.get(loc.ASSERT_SUBTOTAL).should("contain", "Subtotal dos assentos").log("Subtotal dos assentos");
    cy.get(loc.ASSERT_TAXASERVICO).should("exist").log("Taxa de serviço");
    cy.get(loc.ASSERT_VALORTOTAL).should("contain", "Valor total").log("Valor total das passagens");
  }
}

export default new CheckoutPage();
