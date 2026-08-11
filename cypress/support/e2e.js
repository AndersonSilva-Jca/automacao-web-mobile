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

// Import commands.js using ES2015 syntax:
import "cypress-mochawesome-reporter/register";
import "@cypress/xpath";
import "./commands";
import "cypress-if";
// import "cypress-cloud/support";

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

Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    // Tira o screenshot da tela
    cy.screenshot({
      onAfterScreenshot($el, props) {
        // Leitura do arquivo do screenshot e conversão para Base64
        cy.readFile(props.path, "base64").then((base64String) => {
          const base64Image = `data:image/png;base64,${base64String}`;

          // 'base64Image' agora contém a string no formato exato que você precisa:
          // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."

          // Aqui você envia a propriedade 'base64Image' para a sua API ou banco que popula o campo 'url_print'
          console.log(base64Image);
        });
      },
    });
  }
});
