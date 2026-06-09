const { defineConfig } = require("cypress");
const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");

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
        async buscarCodigo2FA({ email, appMailPassword }) {
          console.log(`📬 Buscando código 2FA para: ${email}`);

          const tempoMaximo = 45000;
          const intervalo = 5000;
          let tempoDecorrido = 0;

          // Configuração IMAP para Gmail
          const config = {
            imap: {
              user: email,
              password: `${(appMailPassword, { log: false })}`, // Use a senha do app para autenticação
              host: "imap.gmail.com",
              port: 993,
              tls: true,
              tlsOptions: { rejectUnauthorized: false },
              authTimeout: 10000,
              customAuth: {
                PLAIN: (imap) => {
                  return ["PLAIN", imap.user, imap.password];
                },
              },
            },
          };

          while (tempoDecorrido < tempoMaximo) {
            let connection;
            try {
              // Conecta ao IMAP
              connection = await imaps.connect(config);
              await connection.openBox("INBOX");

              // Busca e-mails não lidos do Clube Giro dos últimos 5 minutos
              const delay = new Date();
              delay.setTime(delay.getTime() - 5 * 60 * 1000);

              const searchCriteria = ["UNSEEN", ["FROM", "seuacesso@clubegiro.com.br"], ["SINCE", delay]];

              const fetchOptions = {
                bodies: ["TEXT", "HEADER"],
                markSeen: true,
              };

              const messages = await connection.search(searchCriteria, fetchOptions);
              console.log(`📨 E-mails encontrados: ${messages.length}`);

              for (const msg of messages) {
                const body = msg.parts.find((p) => p.which === "TEXT");
                if (body) {
                  const parsed = await simpleParser(body.body);
                  const texto = parsed.text || "";

                  // Extrai código de 6 dígitos
                  const match = texto.match(/\b(\d{6})\b/);
                  if (match) {
                    console.log(`✅ Código encontrado: ${match[1]}`);
                    await connection.end();
                    return match[1];
                  }
                }
              }

              if (connection) await connection.end();
            } catch (err) {
              console.log(`⚠️ Erro IMAP: ${err.message}`);
              if (connection) await connection.end().catch(() => {});
            }

            console.log(`⏳ Aguardando e-mail... ${tempoDecorrido / 1000}s`);
            await wait(intervalo);
            tempoDecorrido += intervalo;
          }

          console.log("❌ Tempo esgotado — código não encontrado");
          return null;
        },
      });
    },
    allowCypressEnv: true,
    trashAssetsBeforeRuns: true, // Evita deletar vídeos e screenshots antigos, útil para análise pós-falha
  },
});
