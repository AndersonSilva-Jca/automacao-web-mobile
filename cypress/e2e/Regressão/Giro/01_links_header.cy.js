/// <reference types='cypress' />

const { faker } = require("@faker-js/faker");

import loc from "../../../support/locators";

const giro = "https://www.clubegiro.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

describe("Validar links do header", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit(giro);
  });
  it("Validar link O Programa - Sobre o Clube", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
    cy.get('[href="https://www.clubegiro.com.br/programa/sobre-o-clube"]').click();
    cy.get('[style="color: rgb(30,88,98);"] > .title').should("contain", "Por dentro do clube");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get(".faq-container > :nth-child(1) > .title").should("be.visible");
    cy.get("#headingitem0").click();
    cy.get("#anchor88 > p").should("be.visible");
    cy.get("#headingitem1").click();
    cy.get("#anchor89 > p").should("be.visible");
    cy.get("#headingitem2").click();
    cy.get("#anchor90 > p").should("be.visible");
    cy.get("#headingitem3").click();
    cy.get("#anchor91 > p").should("be.visible");
  });

  it("Validar link O Programa - Missões", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
    cy.get('[href="https://www.clubegiro.com.br/programa/aceleradores"]').click();
    cy.get("b").should("contain", "As missões estão lançadas");
    cy.get('#anchor63 > p > [style="color: rgb(30,88,98);"] > .title').should("contain", "O que são as Missões?");
  });

  it.only("Validar link O Programa - Prêmios", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
    cy.get('[href="https://www.clubegiro.com.br/programa/premios"]').click();
    cy.get("#anchor73 > p").should("contain", "Vamos ao que interessa");
    cy.get("#anchor75 > p").should("contain", "Desconto em passagens");
    cy.scrollTo("top", { timeout: 1000 });
    cy.get("#anchor79 > p").should("be.visible");
    cy.get("#anchor81 > p").should("be.visible");
  });

  it("Validar link O Programa - Parceiros", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
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

  it("Validar link O Programa -  Dúvidas ", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
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
});
