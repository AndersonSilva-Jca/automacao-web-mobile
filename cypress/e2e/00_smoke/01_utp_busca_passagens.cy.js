/// <reference types='cypress' />

// 07/maio/2026 - incio com github actions utp
import loc from '../../support/locators.js'
const cometa = 'https://www.viacaocometa.com.br'
const viacao1001 = 'https://www.autoviacao1001.com.br'
const catarinense = 'https://www.catarinense.com.br/'
const expressoSul = 'https://www.expressodosul.com.br/'
const rapidoRibeirao = 'https://www.rapidoribeiraopreto.com.br/'

describe('UTP - Fazer busca de destinos, selecionar datas, compra de passagens, selecionar assentos', () => {

  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
  });

  it('Viação Cometa - Deve fazer busca de destinos IDA com 1 passageiro', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(cometa);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.selecionarDataIda(2)
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should('be.visible').click()
    cy.wait(5000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.wait(2000)
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').click()
    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get('[alt="loader"]').should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })

  it('Viação Cometa - Deve fazer busca de destinos IDA com 2 passageiros e 1 criança sem assento', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(cometa);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS).should('exist').invoke('show').click()
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).should('exist').invoke('show').click()
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.selecionarDataIda(1)
    cy.get(loc.BUSCAS.BOTAO_PASSAGEIROS).click()
    cy.get(loc.BUSCAS.BOTAO_ADICIONAR_PASSAGEIRO_CRIANCA).click()
    cy.get(loc.BUSCAS.BOTAO_FECHAR_QUANTIDADE_PASSAGEIROS).click()
    cy.get(loc.BUSCAS.BOTAO_BUSCAR).click()
    cy.contains('IDA', { timeout: 90000 }).should('be.visible');
    cy.wait(5000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.NOME_PASSAGEIRO_2).click({ force: true })
    cy.contains('Teste Menor de Idade ODP').scrollIntoView().should('be.visible').click({ force: true })
    cy.get('#passenger-block-2 > .container > .mb-3 > .pl-lg-4 > .field > .select-custom > .select-selected').click()
    cy.get('#passenger-block-2 > .container > .mb-3 > .pl-lg-4 > .field > .select-custom > .select-items > :nth-child(4) > [href="javascript:void(0)"]').click()
    cy.get(loc.CLICK_PASSAGEIROS).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.wait(5000)
    cy.selecionarAssentoAleatorio('IDA', { timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR, { timeout: 90000 }).should('be.visible').click()
    // cy.url().should('include', '/pagamento')
    // cy.get('[alt="loader"]').should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    //  Não finalizar a compra para evitar transações reais
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })

  it('1001 - Deve fazer busca de destinos IDA com 1 passageiro', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(viacao1001);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS,).click({ force: true })
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().clear().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.get(loc.LOADER).should('not.exist')
    cy.selecionarDataIda(2)
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should('be.visible').click()
    cy.wait(5000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.wait(2000)
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').click()
    // cy.get('[alt="loader"]').should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })

  it('Catarinense - Deve fazer busca de destinos IDA com 1 passageiro', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(catarinense);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.get(loc.LOADER).should('not.exist')
    cy.selecionarDataIda(2)
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should('be.visible').click()
    cy.wait(5000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.wait(2000)
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.wait(1000)
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').click()
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })

  it('Expresso Sul - Deve fazer busca de destinos IDA com 1 passageiro', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(expressoSul);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.get(loc.LOADER).should('not.exist')
    cy.selecionarDataIda(2)
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should('be.visible').click()
    cy.wait(1000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.wait(2000)
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').click()
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })
  it('Rapidão Ribeirão - Deve fazer busca de destinos IDA com 1 passageiro', () => {
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit(rapidoRibeirao);
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).should('contain', 'Olá')
    })
    cy.get(loc.BUSCAS.DESTINO_IDA).click().type(loc.SP_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.SP_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DESTINO_VOLTA).click().type(loc.RJ_TODOS, { delay: 100 }).should('exist').invoke('show')
    cy.contains(loc.RJ_TODOS).click({ force: true })
    cy.get(loc.BUSCAS.DATA_IDA).click()
    cy.get(loc.LOADER).should('not.exist')
    cy.selecionarDataIda(2)
    cy.get(loc.BUSCAS.BOTAO_BUSCAR, { timeout: 90000 }).should('be.visible').click()
    cy.wait(5000)
    cy.selecionarPassagemAleatoria1({ timeout: 90000 })
    cy.wait(2000)
    cy.get(loc.CHECK_PASSAGEIRO, { timeout: 90000 }).click({ force: true })
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').and('not.be.disabled').click();
    cy.contains('Escolha o seu assento', { timeout: 90000 }).should('be.visible');
    cy.wait(1000)
    cy.selecionarAssentoAleatorio({ timeout: 90000 });
    cy.get(loc.BOTAO_AVANCAR).should('be.visible').click()
    // cy.get(loc.LOADER).should('not.be.visible')
    // cy.url({ timeout: 90000 }).should('include', '/pagamento')
    // Não finalizar a compra para evitar transações reais
    // cy.get(loc.LOADER).should('not.exist')
    // cy.get('#tab-pix').click()
    // cy.get('.conditions-check', { timeout: 20000 }).click({ force: true })
    // cy.get('#payment-submit').should('be.visible').and('not.be.disabled').click();
  })

})