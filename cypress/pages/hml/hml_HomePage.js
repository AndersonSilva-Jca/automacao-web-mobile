import loc from "../../support/hml_locators";
class HomePage {
  //------------------ OUTLET DE HOTEIS ------------------
  odhAssertHome() {
    cy.contains(loc.ODH_ASSERT_MINHAS_VIAGENS).should("be.visible");
    cy.contains(loc.ODH_ASSERT_CARRINHO).should("be.visible");
  }
  odhHome() {
    cy.get(loc.ODH_HOME).click();
  }
  odhPromoHoje() {
    cy.contains(loc.ODH_ASSERT_PROMO_HOJE).should("be.visible");
    cy.get(loc.ODH_PROMO_HOJE_1).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();
    cy.get(loc.ODH_PROMO_HOJE_2).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();
    cy.get(loc.ODH_PROMO_HOJE_3).click();
    cy.contains(loc.ODH_ASSERT_SOBREHOTEL).should("be.visible");
    cy.get(loc.ODH_HOME).click();
  }
}

export default new HomePage();
