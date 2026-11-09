// 21/09/2026 - incio com github actions
/// <reference types="cypress" />
// /// <reference types="@cypress/xpath" />

// require("cypress-xpath");

// import loc from "../../support/locators.js";
// import LoginPage from "../../pages/LoginPage";
// import SearchPage from "../../pages/SearchPage";
// import OfferPage from "../../pages/OfferPage";
// import PassengerPage from "../../pages/PassengerPage";
// import SeatMapPage from "../../pages/SeatMapPage";
// import CheckoutPage from "../../pages/CheckoutPage";

// require("cypress-xpath");
// const cometa = "https://www.viacaocometa.com.br/?utm_source=synthetic_test&utm_medium=internal&utm_campaign=operacao";

// const remarcacao = "https://api.jcatlm.com.br/SaleExchange/confirmsaleexchange";

describe("Fluxo Crítico de Cadastro - Produção", () => {
  it("Deve gerar o token de acesso e validar as etapas de verificação", () => {
    const cpfTeste = "89221728005";
    const emailTeste = "andersonsilvadev1@gmail.com";

    // 1. POST para obter o Token de Acesso (primeira etapa)
    cy.request({
      method: "POST",
      url: "https://api.jcatlm.com.br/oauth/v3/access-token",
      failOnStatusCode: false,
    }).then((authResponse) => {
      // Valida se o token foi gerado com sucesso (ex: 200)
      expect(authResponse.status).to.eq(200);
      console.log("Corpo da resposta do erro:", authResponse.body);
      // Extrai o token da resposta (ajuste a propriedade conforme o JSON real da sua API, ex: access_token ou token)
      const token = authResponse.body.access_token || authResponse.body.token;

      // 2. Testa a API de existência de CPF utilizando o Bearer Token gerado
      cy.request({
        method: "GET",
        url: `https://api.jcatlm.com.br/customer/v1/user/existcpf?cpf=${cpfTeste}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 404]);
        cy.log("Resposta ExistCPF:", response.body);
      });

      // 3. Testa a API de existência de E-mail
      cy.request({
        method: "GET",
        url: `https://api.jcatlm.com.br/customer/v1/user/existemail?email=${encodeURIComponent(emailTeste)}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 400, 404]);
        cy.log("Resposta ExistEmail:", response.body);
      });

      // 4. Simula a validação de dados do usuário (/validate-data)
      cy.request({
        method: "POST",
        url: "https://api.jcatlm.com.br/customer/v1/user/validate-data",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
        body: {
          cpf: cpfTeste,
          email: emailTeste,
        },
      }).then((response) => {
        cy.log("Resposta Validate-Data Status:", response.status);
      });
    });
  });
});
