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

  //ODP

  odpSelecionarAssentoMarcado() {
    cy.get(loc.ODP_BOTAO_RESERVAR_ASSENTO).click().log("Selecionando assento");
    cy.get(loc.ODP_BOTAO_ESCOLHER_ASSENTO).click();
    cy.selecionarAssentoAleatorioODP();
  }

  // WEMOBI
  wemobiSelecionarAssentoMarcado() {
    cy.get(loc.WEMOBI_BOTAO_RESERVAR_ASSENTO).click().log("Selecionando assento");
    cy.get(loc.WEMOBI_BOTAO_ESCOLHER_ASSENTO).click();
    cy.selecionarAssentoAleatorioWemobi();
  }
  wemobiSelecionarAssentoAleatorio() {
    cy.get(loc.WEMOBI_BOTAO_RESERVAR_ASSENTO).click().log("Selecionando assento");
    cy.get('[data-value="random-seat"]').click();
    cy.get(".reservation-passenger-list > .reservation-passenger-item > .seat-tag").should("be.visible").log("Assento Aleatório selecionado com sucesso !");
    cy.get("#seat-reservation-v2-button-proceed").click({ force: true });
  }
}

export default new SeatMapPage();
