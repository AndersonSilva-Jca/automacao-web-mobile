import loc from "../support/locators";

class PassengerPage {
  selecionarPassageiro() {
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  }
}

export default new PassengerPage();
