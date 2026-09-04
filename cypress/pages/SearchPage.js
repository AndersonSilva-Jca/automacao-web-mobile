import loc from "../support/locators";

class SearchPage {
  //------------------ UTP ------------------
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

  //------------------ OUTLET DE HOTEIS ------------------
  odhBuscaDestino() {
    const cidades = ["Rio de Janeiro (e arredores)", "São Paulo (e arredores)", "Belo Horizonte (e arredores)", "Curitiba (e arredores)", "Salvador (e arredores)"];
    const indiceAleatorio = Math.floor(Math.random() * cidades.length);
    const cidadeSorteada = cidades[indiceAleatorio];
    cy.get(loc.ODH_INPUT_DESTINO).click().type(cidadeSorteada, { delay: 25 });
    cy.get(`[cmdk-item][data-value="${cidadeSorteada}"]`).first().click({ force: true });
    cy.log(`🏙️ Destino sorteado e selecionado para o teste: ${cidadeSorteada}`);
  }

  odhCheckIn() {
    cy.get(loc.ODH_CHECKIN).click();
    cy.selecionarPeriodoEstadia(3);
  }

  odhConfirmarBusca() {
    cy.get(loc.ODH_BOTAO_PROCURAR).click();
  }

  odhLoaderBusca() {
    cy.get(loc.ODH_LOADER_BUSCA).should("be.visible");
  }

  //------------------ OUTLET DE PASSAGENS ------------------
  odpBuscaOrigemHoraMarcada() {
    cy.wait(15000);
    cy.get('[data-js="btn-select-flow-top-store"] > div.btn-select-flow > [data-js="search-agency-flow"]').should("be.visible").click();
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath(loc.ODP_XPATH_SP_TIETE).click({ force: true });
  }

  odpBuscaOrigemMelhorPreco() {
    cy.wait(15000);
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Rodoviária Tietê (SP)", { delay: 100 });
    cy.xpath(loc.ODP_XPATH_SP_TIETE).click({ force: true });
  }

  odpBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath(loc.ODP_XPATH_RJ_TODOS, { timeout: 10000 }).click({ force: true });
  }

  odpDataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
  }

  odpConfirmarBusca() {
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }

  //------------------ CLUBE GIRO ------------------
  giroBuscaOrigem() {
    cy.get(loc.BUSCAS.DESTINO_IDA).clear().click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Todos (SP)", { delay: 150 });
    cy.get(loc.BUSCAS.DESTINO_IDA).clear().click({ force: true });
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Todos (SP)", { delay: 100 });
    cy.contains("São Paulo - Todos (SP)").click({ force: true });
  }

  giroBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
  }

  giroDataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    // cy.get(loc.LOADER).should("not.exist");
    cy.selecionarDataIda(5);
    cy.fecharModalGiro();
  }

  giroConfirmarBusca() {
    cy.fecharModalGiro();
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }

  //------------------ WEMOBI ------------------
  wemobiBuscaOrigem() {
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type("São Paulo - Todos (SP)", { delay: 100 });
    cy.xpath(loc.WEMOBI_XPATH_SP).click({ force: true });
  }

  wemobiBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath(loc.WEMOBI_XPATH_RJ).click({ force: true });
  }

  wemobiDataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataWemobi();
  }

  wemobiConfirmarBusca() {
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }
}

export default new SearchPage();
