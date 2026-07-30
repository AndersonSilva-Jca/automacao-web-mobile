import loc from "../support/locators";

class SearchPage {
  buscaOrigem() {
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_SP_TIETE).click({ force: true });
  }
  buscaDestino() {
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_RJ_TODOS).click({ force: true });
  }
  confirmarBusca() {
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }
  dataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(4);
  }
}

export default new SearchPage();
