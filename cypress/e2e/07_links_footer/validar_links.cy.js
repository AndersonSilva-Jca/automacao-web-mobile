/// <reference types='cypress' />

describe('Validar todos os Links Footer', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/');
  });
  it('Deve validar Links Footer - Instagram', () => {
    cy.get('.social-networks-list > :nth-child(1) > [href="https://www.instagram.com/viacaocometa.oficial/?hl=pt-br"]').click()
  })
  
   it('Deve validar Links Footer - Facebook', () => {
    cy.get('a[href="https://www.facebook.com/ViacaoCometaOficial"]').click()
  })
    it('Deve validar Links Footer - Atendimento virtual whatsapp', () => {
    cy.get('[href="https://api.whatsapp.com/send?phone=5511972645808"] > b').click()
    // cy.url().should('include', '/send?phone=5511972645808')
  })
  it('Deve validar Links Footer - Vendas whatsapp', () => {
    cy.get(':nth-child(2) > [href="https://wa.me/5511933153607"]').click()
    // cy.url().should('include', '/5511933153607')
  })
 it('Deve validar Links Footer - Fale Conosco', () => {
    cy.get(':nth-child(4) > :nth-child(1) > [href="/fale-conosco"]').click()
    cy.url().should('include', '/fale-conosco')
  })
});