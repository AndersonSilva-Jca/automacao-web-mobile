const { defineConfig } = require("cypress");

const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");
require("dotenv").config();
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
    login2: process.env.LOGIN2,
    senha2: process.env.SENHA2,
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
    hotmailAppPass: process.env.HOTMAIL_APP_PASS,
    hotmailMail: process.env.HOTMAIL_MAIL,
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
        async buscarCodigo2FAHotmail() {
          // Procura a senha dentro do config.env do Cypress
          const senhaRaw = config.env.hotmailAppPass || "";

          if (!senhaRaw) {
            throw new Error("❌ Erro: A variável 'hotmailAppPass' não foi definida no escopo do Cypress!");
          }

          const client = new ImapFlow({
            host: "outlook.office365.com",
            port: 993,
            secure: true,
            auth: {
              user: config.env.hotmailMail,
              pass: senhaRaw.replace(/\s/g, ""), // Limpa os espaços com segurança agora
            },
            logger: false,
          });

          await client.connect();
          let lock = await client.getMailLock("INBOX");
          let codigoSorteado = null;

          try {
            let generator = client.fetch({ last: 1 }, { source: true });
            for await (let message of generator) {
              let parsed = await simpleParser(message.source);
              const corpoTexto = parsed.text || parsed.html || "";
              const match = corpoTexto.match(/\b(\d{6})\b/);
              if (match) {
                codigoSorteado = match[1];
              }
            }
          } finally {
            lock.release();
          }

          await client.logout();
          return codigoSorteado;
        },
      });
    },
    allowCypressEnv: true,
    trashAssetsBeforeRuns: true, // Evita deletar vídeos e screenshots antigos, útil para análise pós-falha
  },
});
