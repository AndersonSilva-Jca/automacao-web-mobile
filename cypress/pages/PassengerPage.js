import loc from "../support/locators";

class PassengerPage {
  // UTP
  selecionarPassageiro() {
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  }

  // OUTLET DE PASSAGENS
  odpSelecionarPassageiro() {
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.ODP_BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  }
  // CLUBE GIRO
  giroSelecionarPassageiro() {
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").and("not.be.disabled").click();
  }
  wemobiSelecionarPassageiro() {
    cy.fecharModalUpgradePoltrona();
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true });
    cy.get(loc.WEMOBI_AVANCAR_PASSAGEIRO).should("be.visible").and("not.be.disabled").click();
  }
}

export default new PassengerPage();
