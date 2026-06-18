const { defineConfig } = require("cypress");
const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");
const path = require("path"); // 💡 Importa o módulo de caminhos do Node

// 🔥 Força o dotenv a carregar o arquivo .env correto usando o diretório atual
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

module.exports = defineConfig({
  // ... resto do seu código
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
    gmailAppPass: process.env.GMAIL_APP_PASS,
    gmailMail: process.env.GMAIL_MAIL,
  },
  e2e: {
    retries: {
      runMode: 2, // O GitHub Actions vai tentar até 3 vezes se o elemento sumir do DOM
      openMode: 0, // No seu PC desenvolvendo, ele falha de primeira para você ver o erro
    },
    baseUrl: "https://www.viacaocometa.com.br",
    scrollBehavior: "nearest", // Evita que o Cypress role a página automaticamente durante os testes
    screenshotsFolder: "cypress/reports/screenshots",
    defaultCommandTimeout: 40000, // Aumenta o tempo padrão de espera por elementos
    pageLoadTimeout: 120000, // Espera até 120s para a página carregar totalmente
    requestTimeout: 20000, // Espera até 15s por respostas de APIs (cy.request)
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
        async buscarCodigo2FAGmail() {
          console.log("\n==================================================");
          console.log("🚀 [IMAP LOG] Iniciando busca estável do código 2FA...");

          const senhaRaw = config.env.gmailAppPass || "";
          if (!senhaRaw) {
            throw new Error("A variável 'gmailAppPass' não foi preenchida.");
          }

          const client = new ImapFlow({
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            auth: {
              user: config.env.gmailMail,
              pass: senhaRaw.replace(/\s/g, ""),
            },
            connectionTimeout: 30000,
            greetingTimeout: 30000,
          });

          let codigoSorteado = null;

          try {
            console.log("🔄 [IMAP LOG] Conectando ao Gmail...");
            await client.connect();

            console.log("📂 [IMAP LOG] Abrindo Inbox...");
            let lock = await client.getMailboxLock("INBOX");

            try {
              console.log("🔍 [IMAP LOG] Varrendo e-mails recentes com critério limpo...");

              // 💡 Buscamos TODOS os e-mails da caixa. O retorno é uma Array de IDs numéricos simples.
              const todosIds = await client.search({ all: true });

              // Pegamos apenas os 3 últimos IDs da lista (as mensagens mais recentes)
              const ultimosIds = todosIds.slice(-3);
              console.log(`📊 [IMAP LOG] IDs das 3 mensagens mais recentes encontrados: [${ultimosIds.join(", ")}]`);

              if (ultimosIds.length > 0) {
                // Buscamos o conteúdo cru apenas desses 3 IDs específicos de forma cirúrgica
                let generator = client.fetch(ultimosIds, { source: true });

                for await (let message of generator) {
                  let parsed = await simpleParser(message.source);
                  const corpoTexto = parsed.text || parsed.html || "";

                  console.log(`📝 [IMAP LOG] Analisando e-mail ID ${message.uid} - Assunto: "${parsed.subject}"`);

                  // Procura a sequência de 6 dígitos do token 2FA
                  const match = corpoTexto.match(/\b(\d{6})\b/);
                  if (match) {
                    codigoSorteado = match[1];
                    console.log(`🎯 [IMAP LOG] Código localizado: ${codigoSorteado}`);
                  }
                }
              }

              if (codigoSorteado) {
                console.log(`🎯 [IMAP LOG] Envio com sucesso para o Cypress: ${codigoSorteado}`);
              } else {
                console.log("⚠️ [IMAP LOG] Nenhuma mensagem continha um código de 6 dígitos válido.");
              }
            } finally {
              lock.release();
            }
          } catch (error) {
            console.log(`❌ [IMAP LOG] Erro controlado de protocolo: ${error.message}`);
          } finally {
            try {
              await client.logout();
              console.log("🔌 [IMAP LOG] Sessão encerrada.");
            } catch (e) {}
          }

          console.log("==================================================\n");
          return codigoSorteado;
        },
      });
    },
    allowCypressEnv: true,
    trashAssetsBeforeRuns: true, // Evita deletar vídeos e screenshots antigos, útil para análise pós-falha
  },
});
