const { defineConfig } = require("cypress");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
const axios = require("axios"); // Certifique-se de ter o axios instalado (npm install axios)
const { MailSlurp } = require("mailslurp-client");
require("dotenv").config();

require("dotenv").config();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports = defineConfig({
  // projectId: "yc5eka",
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/",
    charts: true,
    reportPageTitle: "Relatório de Testes - Viacao Cometa",
    overwrite: false,
    html: true,
    json: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  screenshotOnRunFailure: true,
  screenshotsFolder: "cypress/reports/screenshots",
  video: false,
  chromeWebSecurity: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    login1: process.env.LOGIN1,
    senha1: process.env.SENHA1,
    login: process.env.LOGIN,
    senha: process.env.SENHA,
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
    appMailPassword: process.env.APPMAIL_PASSWORD,
    gmailClientId: process.env.GMAIL_CLIENT_ID,
    gmailClientSecret: process.env.GMAIL_CLIENT_SECRET,
    gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN,
    mailslurpApiKey: process.env.MAILSLURP_API_KEY,
    mailSac: process.env.MAILSAC,
  },
  e2e: {
    baseUrl: "https://www.viacaocometa.com.br",
    scrollBehavior: "nearest", // Evita que o Cypress role a página automaticamente durante os testes
    screenshotsFolder: "cypress/reports/screenshots",
    defaultCommandTimeout: 40000, // Aumenta o tempo padrão de espera por elementos
    pageLoadTimeout: 120000, // Espera até 120s para a página carregar totalmente
    requestTimeout: 10000, // Espera até 15s por respostas de APIs (cy.request)
    responseTimeout: 15000, // Espera até 15s por respostas de interceptações
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      // implement node event listeners here
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--ignore-certificate-errors");
        }
        return launchOptions;
      });
      on("task", {
        async pegarCodigoMailsac(email) {
          // Extrai apenas a parte antes do @ para a API do Mailsac
          const username = email.split("@")[0];

          // Faz uma busca pública na caixa de entrada do Mailsac
          const url = `https://mailsac.com/api/public/dirty-messages/${username}`;
          const resposta = await axios.get(url);
          const mensagens = resposta.data;

          if (mensagens.length === 0) return null;

          // Pega o texto do e-mail mais recente
          const ultimoEmailTexto = mensagens[0].body || mensagens[0].snippet || "";

          // Captura os 6 dígitos do 2FA
          const match = ultimoEmailTexto.match(/\b(\d{6})\b/);
          return match ? match[1] : null;
        },
      });
    },
    allowCypressEnv: true,
    trashAssetsBeforeRuns: true, // Evita deletar vídeos e screenshots antigos, útil para análise pós-falha
  },
});
