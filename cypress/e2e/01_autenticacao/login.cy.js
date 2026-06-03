/// <reference types='cypress' />

const { faker } = require('@faker-js/faker');
import loc from '../../support/locators'

describe('Login', () => {
  beforeEach(() => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.env(['login1', 'senha1']).then((env) => {
      cy.visit('/');
      cy.get(loc.HEADER_BOTAO_LOGIN).click()
      cy.get(loc.USUARIO).type(env.login1)
      cy.get(loc.SENHA).type(env.senha1, { log: false })
      cy.get(loc.BOTAO_LOGIN).click({ force: true })
      cy.get(loc.MENSAGEM_LOGADO).if('not.be.visible').get('.normal').should('contain', 'O email ou senha inseridos não constam em nosso cadastro').else().log('Login realizado com sucesso').should('contain', 'Olá')
    })

  });
  it('Deve fazer login com sucesso', () => {
    cy.get(loc.MENSAGEM_LOGADO).should('be.visible')
  });

  // it('Deve preencher endereço do perfil', () => {
  //   cy.get(loc.MENSAGEM_LOGADO).click()
  //   cy.get('a[data-pagetype="edit-profile-page"]:visible').click()
  //   cy.get('.title-address-info > p').should('contain', 'Informações opcionais')
  // });;

  // it('Minhas Viagens - Validar mensagem: Não encontramos nenhuma viagem futura em sua conta.', () => {
  //   cy.get(loc.MENSAGEM_LOGADO).click()
  //   cy.get('a[href="https://www.viacaocometa.com.br/minhas-compras"]:visible').click()
  //   cy.get('.next-trips > :nth-child(1) > :nth-child(1) > .account-info > p').should('contain', 'Não encontramos nenhuma viagem futura em sua conta.')
  // });

  // it('Minhas Viagens - Validar mensagem: Não encontramos nenhuma viagem passada em sua conta.', () => {
  //   cy.get(loc.MENSAGEM_LOGADO).click()
  //   cy.get('a[href="https://www.viacaocometa.com.br/minhas-compras"]:visible').click()
  //   cy.get('#button-tab-trip-edit > .cmp-text > p > [style="color: rgb(255,0,150);"]').click()
  //   cy.get('.previous-trips > .row > :nth-child(1) > .account-info > p').should('contain', 'Não encontramos nenhuma viagem passada em sua conta.')
  // })

}); 