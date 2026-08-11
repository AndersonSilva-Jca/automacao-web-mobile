// scripts/enviar-resultados-appscript.js
//
// Lê o relatório Mochawesome gerado pelo Cypress, separa os resultados por marca (spec)
// e envia cada um pro Apps Script (doPost), que grava na planilha e alimenta o dashboard.
//
// Rodar depois do "npx cypress run" e depois do deploy pro gh-pages (pra já ter a URL certa do relatório).

const fs = require("fs");
const path = require("path");
const https = require("https");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

const REPORTS_DIR = "cypress/reports";
const SCREENSHOTS_DIR = "cypress/screenshots";

// Nome do arquivo de spec (sem .cy.js) -> nome da marca que aparece no dashboard.
// Ajuste aqui se adicionar, renomear ou remover algum spec no futuro.
const MAPA_MARCAS = {
  "01_ODH": "Outlet de Hotéis",
  "02_ODP": "Outlet de Passagens",
  "03_Giro": "Clube Giro",
  "04_Wemobi": "Wemobi",
  "05_Cometa": "Viação Cometa",
  "06_1001": "Auto Viação 1001",
  "07_ExpressoSul": "Expresso Sul",
  "08_RapidoRibeirao": "Rápido Ribeirão",
  "09_Catarinense": "Catarinense",
  "10_Totem": "Totem",
};

// Procura e consolida TODOS os JSONs gerados pelo Mochawesome dentro de cypress/reports
function encontrarJsonMochawesome(dir) {
  if (!fs.existsSync(dir)) return null;

  let resultadosConsolidados = [];

  function varrerDiretorio(diretorioAtual) {
    const itens = fs.readdirSync(diretorioAtual, { withFileTypes: true });
    for (const item of itens) {
      const caminho = path.join(diretorioAtual, item.name);

      if (item.isDirectory()) {
        varrerDiretorio(caminho);
      } else if (item.name.endsWith(".json")) {
        try {
          const conteudo = JSON.parse(fs.readFileSync(caminho, "utf-8"));

          // Se for um JSON individual de spec ou um arquivo compilado contendo 'results'
          if (Array.isArray(conteudo.results) && conteudo.results.length > 0) {
            resultadosConsolidados.push(...conteudo.results);
          }
        } catch (e) {
          // Ignora arquivos JSON corrompidos ou com formato incompatível
        }
      }
    }
  }

  varrerDiretorio(dir);

  if (resultadosConsolidados.length > 0) {
    return { results: resultadosConsolidados };
  }

  return null;
}

// Procura o JSON principal do Mochawesome dentro de cypress/reports (pode estar em subpasta,
// dependendo de como o reporter está configurado no cypress.config.js)
// function encontrarJsonMochawesome(dir) {
//   if (!fs.existsSync(dir)) return null;
//   const itens = fs.readdirSync(dir, { withFileTypes: true });
//   for (const item of itens) {
//     const caminho = path.join(dir, item.name);
//     if (item.isDirectory()) {
//       const achado = encontrarJsonMochawesome(caminho);
//       if (achado) return achado;
//     } else if (item.name.endsWith(".json")) {
//       try {
//         const conteudo = JSON.parse(fs.readFileSync(caminho, "utf-8"));
//         // o JSON principal do mochawesome tem "results" (array, 1 item por spec)
//         if (Array.isArray(conteudo.results)) return conteudo;
//       } catch (e) {
//         // não é o arquivo certo, ignora e continua procurando
//       }
//     }
//   }
//   return null;
// }

// Conta testes recursivamente (specs podem ter suites aninhadas)
function contarTestes(suites) {
  let total = 0,
    passou = 0,
    falhou = 0;
  const falhas = [];

  function percorrer(suite) {
    (suite.tests || []).forEach((t) => {
      total++;
      if (t.state === "passed") passou++;
      if (t.state === "failed") {
        falhou++;
        falhas.push({
          nome: t.title,
          erro: t.err && t.err.message ? t.err.message : "Erro não especificado",
        });
      }
    });
    (suite.suites || []).forEach(percorrer);
  }

  suites.forEach(percorrer);
  return { total, passou, falhou, falhas };
}

function extrairNomeSpec(caminhoArquivo) {
  return path.basename(caminhoArquivo, ".cy.js");
}

// Tenta achar o print de uma falha específica dentro de cypress/screenshots/<spec>.cy.js/
function buscarPrintFalha(nomeSpecArquivo, nomeTeste) {
  const pastaSpec = path.join(SCREENSHOTS_DIR, `${nomeSpecArquivo}.cy.js`);
  if (!fs.existsSync(pastaSpec)) return null;

  const arquivos = fs.readdirSync(pastaSpec);
  const trechoNome = nomeTeste.slice(0, 25);
  const encontrado = arquivos.find((a) => a.includes(trechoNome)) || arquivos.find((a) => a.toLowerCase().includes("failed"));
  return encontrado ? path.join(pastaSpec, encontrado) : null;
}

function enviarParaAppsScript(payload, urlAlvo = APPS_SCRIPT_URL) {
  return new Promise((resolve, reject) => {
    const dados = JSON.stringify(payload);
    const url = new URL(urlAlvo);

    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(dados),
        },
      },
      (res) => {
        // Se o Google solicitar redirecionamento (status 301 ou 302), segue para a nova URL
        if (res.statusCode === 301 || res.statusCode === 302) {
          return resolve(enviarParaAppsScript(payload, res.headers.location));
        }

        let corpo = "";
        res.on("data", (c) => (corpo += c));
        res.on("end", () => resolve(corpo));
      },
    );

    req.on("error", reject);
    req.write(dados);
    req.end();
  });
}

// function enviarParaAppsScript(payload) {
//   return new Promise((resolve, reject) => {
//     const dados = JSON.stringify(payload);
//     const url = new URL(APPS_SCRIPT_URL);
//     const req = https.request(
//       {
//         hostname: url.hostname,
//         path: url.pathname + url.search,
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Content-Length": Buffer.byteLength(dados),
//         },
//       },
//       (res) => {
//         let corpo = "";
//         res.on("data", (c) => (corpo += c));
//         res.on("end", () => resolve(corpo));
//       },
//     );
//     req.on("error", reject);
//     req.write(dados);
//     req.end();
//   });
// }

async function main() {
  if (!APPS_SCRIPT_URL) {
    console.error("❌ APPS_SCRIPT_URL não configurada (secret ausente). Abortando envio.");
    process.exit(1);
  }

  const relatorio = encontrarJsonMochawesome(REPORTS_DIR);
  if (!relatorio) {
    console.error(`❌ Não encontrei o JSON do Mochawesome dentro de "${REPORTS_DIR}". Nada foi enviado.`);
    process.exit(1);
  }

  const urlRelatorio = `https://${REPO_OWNER}.github.io/${REPO_NAME}/reports/${RUN_NUMBER}/01_e2e/index.html`;

  console.log(`📦 ${relatorio.results.length} spec(s) encontrado(s) no relatório. Enviando para o dashboard...`);

  for (const specResult of relatorio.results) {
    const caminhoSpec = specResult.file || specResult.fullFile || "";
    const nomeSpecArquivo = extrairNomeSpec(caminhoSpec);
    const marca = MAPA_MARCAS[nomeSpecArquivo] || nomeSpecArquivo;

    const { total, passou, falhou, falhas } = contarTestes(specResult.suites || []);
    const duracaoMs = (specResult.suites || []).reduce((acc, s) => acc + (s.duration || 0), 0);
    const duracaoSeg = Math.round(duracaoMs / 1000);

    const falhasComPrint = falhas.map((f) => {
      const caminhoPrint = buscarPrintFalha(nomeSpecArquivo, f.nome);
      return {
        nome_teste: `${marca} - ${f.nome}`,
        mensagem_erro: f.erro,
        imagem_base64: caminhoPrint ? fs.readFileSync(caminhoPrint).toString("base64") : null,
      };
    });

    const payload = {
      run_id: `${RUN_ID}`,
      data_hora: new Date().toISOString(),
      marca,
      plataforma: "web",
      total_testes: total,
      total_passou: passou,
      total_falhou: falhou,
      duracao_seg: duracaoSeg,
      url_allure: "",
      url_mochawesome: urlRelatorio,
      falhas: falhasComPrint,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      console.log(`✅ [${marca}] enviado — total:${total} passou:${passou} falhou:${falhou} ->`, resposta);
    } catch (err) {
      console.error(`❌ [${marca}] falhou ao enviar:`, err.message);
    }
  }
}

main();
