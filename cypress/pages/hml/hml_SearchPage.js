import loc from "../../support/hml_locators";
class SearchPage {
  //------------------ UTP ------------------
  buscaOrigem() {
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
    cy.wait(1000);
    cy.get(loc.BUSCAS.DESTINO_IDA).click().clear().type(loc.SP_TIETE, { delay: 100 }).should("exist").invoke("show");
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
  odpBuscaOrigem() {
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
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Rodoviária Novo Rio (RJ)", { delay: 100 });
    // cy.contains(" Rio De Janeiro - Todos (RJ) ").click({ force: true });
    cy.contains(".location-title", " Rio de Janeiro - Rodoviária Novo Rio (RJ) ").should("be.visible").closest(".ui-menu-item-wrapper").click();
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
    cy.get(".logged-message").should("be.visible").log("Mensagem de usuário Logado");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)");
    // cy.get(".ui-autocomplete:visible").find(".ui-menu-item").eq(1).find(".ui-menu-item-wrapper").click();
    cy.get(loc.BUSCAS.DESTINO_IDA).should("be.visible").clear().focus().click().type("{downArrow}").type("São Paulo - Todos (SP)", { delay: 100 });
    // cy.get(".ui-menu-item .use-location-border ", { timeout: 10000 }).click().should("be.visible").invoke("show");
    // cy.get(loc.BUSCAS.DESTINO_IDA).click().click().clear().type("São Paulo - Todos (SP)", { delay: 150 });
    // cy.xpath(loc.WEMOBI_XPATH_SP).click({ force: true });
    cy.contains(".location-title", " São Paulo - Todos (SP) ").should("be.visible").closest(".ui-menu-item-wrapper").click();
  }

  wemobiBuscaDestino() {
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type("Rio De Janeiro - Todos (RJ)", { delay: 100 });
    cy.xpath(loc.WEMOBI_XPATH_RJ).click({ force: true });
  }

  wemobiDataIda() {
    cy.get(loc.BUSCAS.DATA_IDA).click();
    cy.selecionarDataIda(5);
  }

  wemobiConfirmarBusca() {
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should("be.visible").click();
  }
}

export default new SearchPage();
