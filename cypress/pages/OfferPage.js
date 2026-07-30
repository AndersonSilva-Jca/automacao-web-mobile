import loc from "../support/locators";

class OfferPage {
  // UTP
  selecionarPassagemIda() {
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  }

  // OUTLET DE HOTÉIS
  odhSelecionarHospedagem() {
    cy.contains(loc.ODH_ASSERT_RESULT_HOSPEDAGENS).should("be.visible");
  }

  // OUTLET DE PASSAGENS

  odpSelecionarPassagemIda() {
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  }

  // CLUBE GIRO
  giroSelecionarPassagemIda() {
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  }

  // WEMOBI
  wemobiSelecionarPassagemIda() {
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  }
}

export default new OfferPage();
