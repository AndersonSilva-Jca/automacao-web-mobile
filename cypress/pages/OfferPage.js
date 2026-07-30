import loc from "../support/locators";

class OfferPage {
  selecionarPassagemIda() {
    cy.selecionarPassagemAleatoria1({ timeout: 90000 });
  }
}

export default new OfferPage();
