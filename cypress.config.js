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
        // Altere a sua task para incluir a lógica de repetição (retries)
        async buscarCodigoMFA({ email, senha }) {
          console.log(`📬 Iniciando busca de e-mail para: ${email}`);

          const tempoMaximoEspera = 45000; // 45 segundos no total
          const intervaloTentativas = 5000; // Checa a caixa de e-mail a cada 5 segundos
          let tempoDecorrido = 0;
          let codigoEncontrado = null;

          // Começa o loop de tentativas
          while (tempoDecorrido < tempoMaximoEspera) {
            // 1. AQUI VAI A SUA LÓGICA ATUAL DE CONEXÃO IMAP/POP3
            // Exemplo fictício do que você já deve ter rodando aí:
            codigoEncontrado = await suaFuncaoQueLeOImap(email, senha);

            // 💡 SIMULAÇÃO: Se a sua biblioteca de e-mail retornar o código de 6 dígitos:
            if (codigoEncontrado) {
              console.log(`✅ Código encontrado com sucesso: ${codigoEncontrado}`);
              return codigoEncontrado; // Retorna o código para o Cypress e encerra o loop
            }

            // Se não encontrou, avisa no terminal e espera antes de tentar de novo
            console.log(`⏳ E-mail ainda não chegou. Aguardando mais 5s... (${tempoDecorrido / 1000}s decorridos)`);
            await wait(intervaloTentativas);
            tempoDecorrido += intervaloTentativas;
          }

          // Se estourar os 45 segundos e sair do loop sem o código:
          console.log(`❌ Fim do tempo limite de 45s. E-mail não localizado.`);
          return null;
        },
      });

      // Seus outros eventos (como before:browser:launch) continuam aqui embaixo...
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--ignore-certificate-errors");
        }
        return launchOptions;
      });
    },
    allowCypressEnv: false,
    trashAssetsBeforeRuns: true, // Evita deletar vídeos e screenshots antigos, útil para análise pós-falha
  },
});
