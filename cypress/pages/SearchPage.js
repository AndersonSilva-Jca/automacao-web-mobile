import loc from "../support/locators";

class SearchPage {
  //------------------ UTP ------------------
  buscaOrigem() {
    cy.get(loc.BUSCAS.ORIGEM).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_SP_TIETE).click({ force: true });
  }

  buscaTopRotasCometa() {
    cy.selecionarTopRotaCometa();
  }

  buscaTopRotasCometa() {
    cy.selecionarTopRotaCometa();
  }

  buscaTopRotasRapidoRibeirao() {
    cy.selecionarTopRotasRapidoRibeirao();
  }

  buscaTopRotas1001() {
    cy.selecionarTopRotas1001();
  }

  buscaOrigemExpressoSul() {
    cy.selecionarTopRotasExpressoSul();
  }

  buscaDestinoRR() {
    cy.get(loc.BUSCAS.DESTINO).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_SP_TIETE).filter(":visible").first().click({ force: true });
  }

  buscaDestino() {
    cy.get(loc.BUSCAS.ORIGEM).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_SP_TIETE).click({ force: true });
  }

  buscaTopRotasCatarinense() {
    cy.selecionarTopRotasCatarinense();
  }

  buscaDestinoCometa() {
    cy.get(loc.BUSCAS.DESTINO).click().type("Curitiba - PR", { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_Curitiba_PR).click({ force: true });
  }

  buscaDestino1001() {
    cy.get(loc.BUSCAS.DESTINO).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.xpath(loc.XPATH_SP_TIETE).click({ force: true });
  }

  buscaDestinoExpressoSul() {
    cy.get(loc.BUSCAS.DESTINO).click().type("Florianópolis (SC)", { delay: 100 }).should("exist").invoke("show");
    cy.get('a[id="Florianópolis-(SC)"]', { timeout: 10000 }).filter(":visible").first().click({ force: true });
  }

  confirmarBusca() {
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }

  dataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda();
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
    cy.get('[data-js="search-agency-flow"]').should("be.visible").eq(0).click({ force: true });
    cy.selecionarTopRotaODP();
  }

  odpBuscaOrigemMelhorPreco() {
    cy.wait(15000);
    cy.selecionarTopRotaODP();
  }

  odpBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
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
  giroBuscaTopRotasGiro() {
    cy.selecionarTopRotasGiro();
  }

  giroBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
  }

  giroDataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
    cy.fecharModalGiro();
  }

  giroConfirmarBusca() {
    cy.fecharModalGiro();
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }

  //------------------ WEMOBI ------------------
  wemobiBuscaRotasExp() {
    cy.selecionarTopRotaWemobiExp();
  }

  wemobiBuscaRotas() {
    cy.selecionarTopRotaWemobi();
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
