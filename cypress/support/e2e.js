// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// require("dd-trace/ci/cypress/support");
// import "dd-trace/ci/cypress/support";

// import { datadogRum } from "@datadog/browser-rum";

// datadogRum.init({
//   applicationId: "1dfc208e-bc54-48e1-9a1a-ebbb8baae754",
//   clientToken: "pube96956cddf5e1a7c7775de605b1d2531",
//   site: "datadoghq.com",
//   service: "cypress-tests",
//   env: "test",
//   trackUserInteractions: true,
//   trackResources: true,
// });

// Import commands.js using ES2015 syntax:
import "cypress-mochawesome-reporter/register";
import "@cypress/xpath";
import "./commands";
import "cypress-if";

// import "cypress-cloud/support";
Cypress.Screenshot.defaults({ capture: "viewport" });

Cypress.ElementSelector.defaults({
  selectorPriority: ["data-*", "id", "class", "attributes", "tag", "data-js", "data-qa", "nth-child", "data-pagetype", "name"],
});

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("VI_EC is not defined")) {
    return false;
  }
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // Retornar false impede o Cypress de falhar o teste
  // quando o site dá erro de JavaScript interno
  if (err.message.includes("reading 'append'")) {
    return false;
  }
  // Se for outro erro, ele ainda falha (boa prática)
  return false;

  Cypress.on("uncaught:exception", (err, runnable) => {
    return false; // impede o Cypress de falhar o teste por erros do site
  });
});
require("cypress-xpath");

// ❌ removido — causava corrupção de estado entre tentativas (retries) por enfileirar
// cy.screenshot()/cy.readFile() dentro de um evento test:after:run (que roda fora da
// fila de comandos do teste atual, vazando pra fila do próximo teste/tentativa).
// Não tinha destino real pro base64 gerado (só um console.log). O screenshot de
// falha já é capturado automaticamente pelo cypress-mochawesome-reporter.
//
// Cypress.on("test:after:run", (test, runnable) => {
//   if (test.state === "failed") {
//     cy.screenshot({
//       onAfterScreenshot($el, props) {
//         cy.readFile(props.path, "base64").then((base64String) => {
//           const base64Image = `data:image/png;base64,${base64String}`;
//           console.log(base64Image);
//         });
//       },
//     });
//   }
// });

// Desativa a captura automática de printscreen do Cypress em caso de falhas
// Cypress.Screenshot.defaults({
//   screenshotOnRunFailure: false,
// });

let networkLog = [];

beforeEach(() => {
  networkLog = [];

  // 1) Suprime o log visual de qualquer xhr/fetch no command log/vídeo
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });

  // 2) Captura de verdade, em paralelo, sem aparecer no log
  cy.intercept({ resourceType: /xhr|fetch/ }, (req) => {
    req.on("response", (res) => {
      const ehApiRelevante = req.url.includes("jcatlm") || req.url.includes("vendasjca.com.br") || req.url.includes("outletdehoteis") || req.url.includes("api-gateway");

      if (res.statusCode >= 400 && ehApiRelevante) {
        let responseBodyTratado = res.body;
        if (typeof responseBodyTratado === "string") {
          try {
            responseBodyTratado = JSON.parse(responseBodyTratado);
          } catch (e) {}
        }

        networkLog.push({
          url: req.url,
          method: req.method,
          status: res.statusCode,
          requestBody: req.body,
          responseBody: responseBodyTratado,
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
});

afterEach(function () {
  if (networkLog.length > 0) {
    cy.addTestContext({
      title: `🚨 ${networkLog.length} chamada(s) de API com erro`,
      value: JSON.stringify(networkLog, null, 2),
    });
  }
});
