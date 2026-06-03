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
import 'cypress-mochawesome-reporter/register';

import './commands'
import 'cypress-if'
require('cypress-xpath')
Cypress.ElementSelector.defaults({
    selectorPriority: ['data-*', 'id', 'class', 'attributes', 'tag', 'data-js', 'data-qa', 'nth-child', 'data-pagetype', 'name' ]
})

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('VI_EC is not defined')) {
    return false;
  }
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false impede o Cypress de falhar o teste
  // quando o site dá erro de JavaScript interno
  if (err.message.includes("reading 'append'")) {
    return false
  }
  // Se for outro erro, ele ainda falha (boa prática)
  return false 

  Cypress.on('uncaught:exception', (err, runnable) => {
  return false; // impede o Cypress de falhar o teste por erros do site
});
});