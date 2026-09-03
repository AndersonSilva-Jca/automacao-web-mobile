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

  it("Validar link O Programa - Prêmios", () => {
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
    cy.get('[href="https://www.clubegiro.com.br/beneficios"]').click();
    cy.url().should("contain", "/beneficios");
    cy.get(":nth-child(2) > .custom-padding > .container").should("be.visible");
    cy.get('[style="padding: 0rem 0 0rem 0 "] > :nth-child(1) > :nth-child(1) > .slick-tabs > .cmp-tabs > .freedom-cards-main > .freedom-cards-tab-container > .d-flex > .slick-list > .slick-track > .tab-cards').should("be.visible").log("Slide Rodoviário");
    cy.get("#slick-slide00").should("be.visible");
    cy.get("#slick-slide01").should("be.visible");
    cy.get("#slick-next-0").click();
    cy.get("#slick-slide02").should("be.visible");
    cy.get("#slick-slide03").should("be.visible");
    cy.wait(500);
    // cy.scrollTo("bottom", { duration: 1000 });
    cy.get("#slick-next-0").click();
    // cy.get("#slick-next-0").click();
    cy.get("#slick-slide04").should("be.visible");
    cy.get(":nth-child(4) > .cmp-tabs > .freedom-cards-main > .freedom-cards-tab-container > .d-flex > .slick-list > .slick-track > .tab-cards").should("be.visible").log("Slide Destaque");
    cy.get("#slick-slide10").should("be.visible");
    cy.get("#slick-slide11").should("be.visible");
    cy.wait(500);
    cy.get("#slick-next-1").click();
    cy.get("#slick-slide12").should("be.visible");
    cy.get("#slick-slide13").should("be.visible");
    cy.wait(500);
    cy.get("#slick-next-1").click();
    cy.get("#slick-slide14").should("be.visible");
    cy.get("#slick-slide15").should("be.visible");
    cy.wait(500);
    cy.get(":nth-child(5) > .cmp-tabs > .freedom-cards-main > .freedom-cards-tab-container > .d-flex > .slick-list > .slick-track > .tab-cards").should("be.visible").log("Slide Viagens");
    cy.get("#slick-slide20").should("be.visible");
    cy.get("#slick-slide21").should("be.visible");
    cy.get("#slick-next-2").click();
    cy.get("#slick-slide22").should("be.visible");
    cy.get("#slick-slide23").should("be.visible");
    cy.wait(500);
    cy.get("#slick-next-2").click();
    cy.get("#slick-slide24").should("be.visible");
    cy.get("#slick-slide25").should("be.visible");
    cy.wait(500);
    cy.get("#slick-next-2").click();
    cy.get("#slick-slide26").should("be.visible");
  });

  it("Validar link O Programa -  Dúvidas ", () => {
    cy.get(":nth-child(1) > .menu-item").click();
    cy.url().should("include", "/programa");
    cy.get('[href="https://www.clubegiro.com.br/canal-de-duvidas"]').click();
    cy.get('[href="#sobre"]').click();
    cy.get("#anchor12 > p").should("be.visible");
    cy.get('[href="#inscrição"]').click();
    cy.get("#inscrição > p").should("be.visible");
    cy.get('[href="#funcionalidade"]').click();
    cy.get("#funcionalidade > p").should("be.visible");
    cy.get('[href="#missoes"]').click();
    cy.get("#missoes > p").should("be.visible");
    cy.get('[href="#aceleradores"]').click();
    cy.get("#aceleradores > p").should("be.visible");
    cy.get('[href="#prêmios"]').click();
    cy.get("#prêmios > p").should("be.visible");
    cy.get('[href="#compradepassagens"]').click();
    cy.get("#compradepassagens > p").should("be.visible");
  });

  it("Validar Link - Informações de Viagem", () => {
    cy.get(":nth-child(3) > .menu-item").click();
    cy.get(".section-title").should("contain", "Informações para sua viagem").log("Página de Informações de Viagem carregada com sucesso");
    cy.get('[href="#salasvip"]').click();
    cy.get('#salasvip > [style="text-align: center;"] > [style="color: rgb(92,173,186);"]').should("be.visible");
    cy.get('[href="#reembolso"]').click();
    cy.get('#reembolso > [style="text-align: center;"] > [style="color: rgb(92,173,186);"]').should("be.visible");
    cy.get('[href="#remarcacao"]').click();
    cy.get(':nth-child(2) > [style="color: rgb(92,173,186);"]').should("be.visible");
    cy.get('[href="#reacomocacao"]').click();
    cy.get('#reacomodacao > [style="text-align: center;"] > [style="color: rgb(92,173,186);"]').should("be.visible");
    cy.get('[href="#gratuidade"]').click();
    cy.get('#gratuidade > [style="text-align: center;"] > [style="color: rgb(92,173,186);"]').should("be.visible");
  });

  it.only("Validar Link - Assinatura", () => {
    cy.get(":nth-child(4) > .menu-item").click();
    cy.url().should("include", "/giro-turbo-home");
    cy.get("#plano-verde").click();
    cy.get("#input-login").should("be.visible");
    cy.get("#input-password").should("be.visible");
  });
});
