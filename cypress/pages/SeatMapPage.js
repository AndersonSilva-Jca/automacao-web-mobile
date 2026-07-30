import loc from "../support/locators";

class SeatMapPage {
  // UTP
  selecionarAssento() {
    cy.contains("Escolha o seu assento", { timeout: 90000 }).should("be.visible");
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
  }

  // CLUBE GIRO
  giroSelecionarAssento() {
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
  }
}

export default new SeatMapPage();
