/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../support/locators.js";
const cometa = "https://www.viacaocometa.com.br";
const viacao1001 = "https://www.autoviacao1001.com.br";
const catarinense = "https://www.catarinense.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";
const expressoSul = "https://www.expressodosul.com.br/";
const rapidoRibeirao = "https://www.rapidoribeiraopreto.com.br/";
const odp = "https://www.outletdepassagens.com.br";
const odt = "https://www.outletdehoteis.com.br";
const giro = "https://www.clubegiro.com.br";
const wemobi = "https://www.wemobi.me";

describe("Validar link informações de viagens", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(viacao1001);
  });
  it("Validar link informações de Viagem - Bagagem", () => {
    cy.get(loc.LINK_INFO_VIAGEM).click();
    cy.url().should("include", loc.URL_INFO_VIAGEM);
    cy.get(loc.LINK_BAGAGEM).click();
    cy.get(loc.ASSERT_BAGAGEM_DE_MAO).should("contain", "Bagagem de mão");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_BAGAGEM_DESPACHADA).click();
    cy.get(loc.ASSERT_BAGAGEM_DESPACHADA).should("contain", "Bagagem despachada no bagageiro");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_BAGAGEM_PROIBIDA).click();
    cy.get(loc.ASSERT_BAGAGEM_PROIBIDA).should("contain", "Bagagem proibida");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_BAGAGENS_ESPECIAIS_ESPORTIVAS).click();
    cy.get(loc.ASSERT_BAGAGENS_ESPECIAIS_ESPORTIVAS).should("contain", "Bagagens especiais e esportivas");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_BAGAGENS_EXTRAVIADAS_DANIFICADAS).click();
    cy.get(loc.ASSERT_BAGAGENS_EXTRAVIADAS_DANIFICADAS).should("contain", "Bagagens extraviadas ou danificadas");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_OBJETOS_ESQUECIDOS_VEICULO).click();
    cy.get(loc.ASSERT_OBJETOS_ESQUECIDOS_VEICULO).should("contain", "Objetos esquecidos no interior do veículo");
    cy.scrollTo("top");
    cy.get(loc.LINK_COBRANCA_EXCESSO_BAGAGEM).click();
    cy.get(loc.ASSERT_COBRANCA_EXCESSO_BAGAGEM).should("contain", "Cobrança por excesso de bagagem");
  });

  it("Validar link informações de Viagem - Informações para embarque", () => {
    cy.get(loc.LINK_INFO_VIAGEM).click();
    cy.url().should("include", loc.URL_INFO_VIAGEM);
    cy.get(loc.LINK_EMBARQUE).click();
    cy.get(loc.LINK_DOCUMENTACAO_EMBARQUE).click();
    cy.get(loc.ASSERT_DOCUMENTACAO_EMBARQUE).should("contain", "Documentação para embarque");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_EMBARQUE_MENORES).click();
    cy.get(loc.ASSERT_EMBARQUE_MENORES).should("contain", "Embarque para Menores");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_HORARIO_EMBARQUE).click();
    cy.get(loc.ASSERT_HORARIO_EMBARQUE).should("contain", "Horário de embarque");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_TRANSPORTE_ANIMAIS).click();
    cy.get(loc.ASSERT_TRANSPORTE_ANIMAIS).should("contain", "Transporte de Animais");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_SEGURO_FACULTATIVO).click();
    cy.get(loc.ASSERT_SEGURO_FACULTATIVO).should("contain", "Seguro Facultativo");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_ALTERACOES_HORARIO).click();
    cy.get(loc.ASSERT_ALTERACOES_HORARIO).should("contain", "Alterações de Horários e Frequências");
    cy.scrollTo("top", { timeout: 1000 });
  });

  it("Validar link informações de Viagem - Compra, remarcação e reembolso", () => {
    cy.get(loc.LINK_INFO_VIAGEM).click();
    cy.url().should("include", loc.URL_INFO_VIAGEM);
    cy.get(loc.LINK_COMPRA_REMARCACAO).click();
    cy.get(loc.LINK_FORMAS_PAGAMENTO).click();
    cy.get(loc.ASSERT_FORMAS_PAGAMENTO).should("contain", "Formas de Pagamento");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_REMARCACAO_TROCA).click();
    cy.get(loc.ASSERT_REMARCACAO_TROCA).should("contain", "Remarcação e Troca");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_CANCELAMENTO_REEMBOLSO).click();
    cy.get(loc.ASSERT_CANCELAMENTO_REEMBOLSO).should("contain", "Cancelamento e Reembolso");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_REACOMODACAO).click();
    cy.get(loc.ASSERT_REACOMODACAO).should("contain", "Reacomodações");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_TAXAS).click();
    cy.get(loc.ASSERT_TAXAS).should("contain", "Taxas de serviços");
    cy.scrollTo("top", { timeout: 1000 });
  });

  it("Validar link informações de Viagem - Nossos serviços", () => {
    cy.get(loc.LINK_INFO_VIAGEM).click();
    cy.url().should("include", loc.URL_INFO_VIAGEM);
    cy.get(loc.LINK_NOSSOS_SERVICOS).click();
    cy.get(loc.LINK_NOSSOS_ONIBUS).click();
    cy.get(loc.ASSERT_NOSSOS_ONIBUS).should("contain", "Conheça Nossos Ônibus");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_SALAS_VIPS).click();
    cy.get(loc.ASSERT_SALAS_VIPS).should("contain", "SALAS VIPS");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_SALAS_NETS).click();
    cy.get(loc.ASSERT_SALAS_NETS).should("contain", "SALAS NETS");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_CLUBE_GIRO).click();
    cy.get(loc.ASSERT_CLUBE_GIRO).should("contain", "CLUBE GIRO");
  });

  it("Validar link informações de Viagem - Descontos e Gratuidades", () => {
    cy.get(loc.LINK_INFO_VIAGEM).click();
    cy.url().should("include", loc.URL_INFO_VIAGEM);
    cy.get(loc.LINK_DESCONTOS_GRATUIDADES).click();
    cy.get(loc.LINK_ESTUDANTE).click();
    cy.get(loc.ASSERT_ESTUDANTE).should("contain", "Estudante e Professor");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_PCD).click();
    cy.get(loc.ASSERT_PCD).should("contain", "Pessoa com deficiência");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_IDOSO).click();
    cy.get(loc.ASSERT_IDOSO).should("contain", "Idoso");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(loc.LINK_ID_JOVEM).click();
    cy.get(loc.ASSERT_ID_JOVEM).should("contain", "ID Jovem");
  });

  it("Deve Validar link fale conosco e preencher o formulário de contato", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(2) > .focusable").click();
    cy.url({ timeout: 2000 }).should("include", "/fale-conosco");
    // cy.get('#input-name').type('Teste Automação ODP')
    // cy.get('#input-doc').type('38485984854', { log: false })
    // cy.get('#input-email').type('teste.robo@odp.com.br')
    // cy.get('#input-ddd').type('11')
    // cy.get('#input-phone').type('99999-9999', { log: false })
    // cy.get('#btn-contact-us').should('not.be.disabled').click()
    // cy.get('.container-form-protocol-contact-us > .title-form > .aem-Grid > .text > .cmp-text > p').should('contain', 'Faça sua requisição')
    // cy.get(':nth-child(1) > :nth-child(1) > .field > .input-container > .select-custom > .select-selected').click()
    // cy.get(':nth-child(1) > :nth-child(1) > .field > .input-container > .select-custom > .select-items > :nth-child(4) > [href="javascript:void(0)"]').click()
    // cy.get(':nth-child(2) > .field > .input-container > .select-custom > .select-selected').click()
    // cy.get(':nth-child(2) > .field > .input-container > .select-custom > .select-items > :nth-child(2) > [href="javascript:void(0)"]').click()
    // cy.get(':nth-child(3) > .input-container > .field > .select-custom > .select-selected').click()
    // cy.get('.field > .select-custom > .select-items > :nth-child(2) > [href="javascript:void(0)"]').click()
    // cy.get('#input-local').type('Sao Paulo')
    // cy.contains('SAO PAULO ROD TIETE(SP)').click()
    // cy.get('#has-bought').click({ force: true })
    // cy.get('#input-date-buy').click()
    // cy.selecionarDataCompra(1)
    // cy.get('#input-date-trip').click()
    // cy.selecionarDataViagem(6)
    // cy.get('#input-origin').type('AGUAS DA PRATA(SP)')
    // cy.contains('AGUAS DA PRATA(SP)').click({ force: true })
    // cy.get('#input-dest').type('AGUAS DA PRATA - M. DIVISORIO(SP)')
    // cy.contains('AGUAS DA PRATA - M. DIVISORIO(SP)').click({ force: true })
    // cy.get('#description').type('Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit ame.')
    // cy.get('[for="protocol-file"] > .cmp-text > [style="text-align: left;"]').click()
    // cy.get('[data-js="protocol-file"]').selectFile('cypress/fixtures/documento.pdf', { force: true })
    // Não finalizar a solicitação para evitar requisições reais
    // cy.get('#submit-protocol').click()
  });
  it("Deve redirecionar para a página de gratuidade", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(3) > .focusable").invoke("removeAttr", "target").click();
    cy.url().should("include", "https://vendas.jcaholding.com.br/"); //erro
  });
  it("Deve redirecionar para a página de nossos destinos", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(4) > .focusable").click();
    cy.url().should("include", "/nossos-destinos");
  });

  it("Deve redirecionar para a página de pontos de venda", () => {
    cy.get(".header-nav-container > :nth-child(1) > :nth-child(5) > .focusable").click();
    cy.url().should("include", "/pontos-de-venda");
  });

  it("Deve redirecionar para o site Clube Giro com sucesso", () => {
    cy.get(":nth-child(1) > :nth-child(6) > .focusable").click();
    cy.url().should("include", "/clubegiro");
    //   cy.get('a[href="https://www.clubegiro.com.br"]').click()
    //   cy.url().should('include', 'clubegiro.com.br')
  });
});
