import loc from "../../support/hml_locators";
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
    cy.wait(2000);
    // cy.selecionarAssentoAleatorio({ timeout: 90000 });
    // cy.get(loc.BOTAO_AVANCAR).should("be.visible").click();
  }

  // WEMOBI
  wemobiSelecionarAssento() {
    cy.get(loc.WEMOBI_BOTAO_RESERVAR_ASSENTO).click().log("Selecionando assento");
    cy.get(loc.WEMOBI_BOTAO_ESCOLHER_ASSENTO).click();
    cy.selecionarAssentoAleatorioWemobi();
  }
}

export default new SeatMapPage();
