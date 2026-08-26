const fs = require("fs");
const path = require("path");
const https = require("https");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const BRANCH = process.env.GITHUB_REF_NAME || "main";
// const REPO_OWNER = process.env.REPO_OWNER;
// const REPO_NAME = process.env.REPO_NAME;
const CYPRESS_R2_PUBLIC_URL = process.env.CYPRESS_R2_PUBLIC_URL;
const REPORTS_DIR = "cypress/reports";
const SCREENSHOTS_DIR = "cypress/reports/screenshots"; // confirmado via log do GitHub Actions

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

// Procura o JSON principal do Mochawesome dentro de cypress/reports (pode estar em subpasta,
// dependendo de como o reporter está configurado no cypress.config.js)
function encontrarJsonMochawesome(dir) {
  if (!fs.existsSync(dir)) return null;
  const itens = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of itens) {
    const caminho = path.join(dir, item.name);
    if (item.isDirectory()) {
      const achado = encontrarJsonMochawesome(caminho);
      if (achado) return achado;
    } else if (item.name.endsWith(".json")) {
      try {
        const conteudo = JSON.parse(fs.readFileSync(caminho, "utf-8"));
        // o JSON principal do mochawesome tem "results" (array, 1 item por spec)
        if (Array.isArray(conteudo.results)) return conteudo;
      } catch (e) {
        // não é o arquivo certo, ignora e continua procurando
      }
    }
  }
  return null;
}

// Conta testes recursivamente (specs podem ter suites aninhadas).
// O nomeCompleto é reconstruído manualmente com " -- " entre suite e teste porque é
// esse o separador que o Cypress usa no nome do arquivo do print.
function contarTestes(suites) {
  let total = 0,
    passou = 0,
    falhou = 0;
  const falhas = [];

  function percorrer(suite, caminhoSuites) {
    // Limpa espaços extras no final/início do nome da suite (describe)
    const tituloSuite = suite.title ? suite.title.trim() : "";
    const caminhoAtual = tituloSuite ? [...caminhoSuites, tituloSuite] : caminhoSuites;

    (suite.tests || []).forEach((t) => {
      total++;
      if (t.state === "passed") passou++;
      if (t.state === "failed") {
        falhou++;
        // Limpa espaços extras no final/início do nome do teste (it)
        const tituloTeste = t.title ? t.title.trim() : "";
        falhas.push({
          nome: tituloTeste,
          nomeCompleto: [...caminhoAtual, tituloTeste].join(" -- "),
          erro: t.err && t.err.message ? t.err.message : "Erro não especificado",
        });
      }
    });
    (suite.suites || []).forEach((s) => percorrer(s, caminhoAtual));
  }

  suites.forEach((s) => percorrer(s, []));
  return { total, passou, falhou, falhas };
}

function extrairNomeSpec(caminhoArquivo) {
  return path.basename(caminhoArquivo, ".cy.js");
}

// Acha o arquivo de print correspondente à falha e monta a URL pública do gh-pages.
// Nome real do arquivo (confirmado via log do Actions):
//   "<título do describe> -- <título do teste> (failed).png"
//   "<...> (failed) (attempt 2).png"  / "(attempt 3).png" quando há retry
// Retorna um array com até 3 posições — [tentativa1, tentativa2, tentativa3] — cada uma
// com a URL pública (gh-pages) do print daquela tentativa, ou "" se ela não existir.
// Antes só pegávamos a tentativa mais alta; agora guardamos as 3 pra dar pra conferir o retry inteiro.
function buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompletoTeste) {
  const pastaSpecLocal = path.join(SCREENSHOTS_DIR, `${nomeSpecArquivo}.cy.js`);
  const nomeLimpo = nomeCompletoTeste ? nomeCompletoTeste.trim() : "";
  const urlsPorTentativa = ["", "", ""];

  console.log(`   🔍 procurando prints em: "${pastaSpecLocal}"`);
  console.log(`   🔍 nome completo reconstruído: "${nomeLimpo}"`);

  if (!fs.existsSync(pastaSpecLocal)) {
    console.log(`   ⚠️  pasta não existe: "${pastaSpecLocal}"`);
    return urlsPorTentativa;
  }

  const arquivos = fs.readdirSync(pastaSpecLocal);
  console.log(`   🔍 arquivos encontrados na pasta: ${JSON.stringify(arquivos)}`);

  const prefixo = `${nomeLimpo} (failed)`;
  console.log(`   🔍 prefixo esperado: "${prefixo}"`);
  const candidatos = arquivos.filter((a) => a.startsWith(prefixo));
  if (candidatos.length === 0) {
    console.log(`   ❌ nenhum arquivo bateu com o prefixo esperado`);
    return urlsPorTentativa;
  }

  // URL base direcionando para a pasta de screenshots
  const urlBase = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/screenshots`;

  candidatos.forEach((nomeArquivo) => {
    const attempt = parseInt((nomeArquivo.match(/attempt (\d+)/) || [])[1] || "1", 10);
    if (attempt < 1 || attempt > 3) return;

    // Monta a estrutura correta: .../screenshots/<nomeSpec.cy.js>/<nomeDoPrint.png>
    const urlFinal = `${urlBase}/${encodeURIComponent(nomeSpecArquivo + ".cy.js")}/${encodeURIComponent(nomeArquivo)}`;
    urlsPorTentativa[attempt - 1] = urlFinal;
    console.log(`   ✅ tentativa ${attempt} -> "${nomeArquivo}"`);
  });

  return urlsPorTentativa;
}

function enviarParaAppsScript(payload) {
  return new Promise((resolve, reject) => {
    const dados = JSON.stringify(payload);
    const url = new URL(APPS_SCRIPT_URL);
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

  // const urlRelatorio = `https://${REPO_OWNER}.github.io/${REPO_NAME}/reports/${RUN_NUMBER}/01_e2e/index.html`;

  const urlRelatorio = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/index.html`;

  console.log(`📦 ${relatorio.results.length} spec(s) encontrado(s) no relatório. Enviando para o dashboard...`);

  for (const specResult of relatorio.results) {
    const caminhoSpec = specResult.file || specResult.fullFile || "";
    const nomeSpecArquivo = extrairNomeSpec(caminhoSpec);
    const marca = MAPA_MARCAS[nomeSpecArquivo] || nomeSpecArquivo;

    const { total, passou, falhou, falhas } = contarTestes(specResult.suites || []);
    const duracaoMs = (specResult.suites || []).reduce((acc, s) => acc + (s.duration || 0), 0);
    const duracaoSeg = Math.round(duracaoMs / 1000);

    const falhasComPrint = falhas.map((f) => {
      const [urlPrint1, urlPrint2, urlPrint3] = buscarUrlsPrintFalha(nomeSpecArquivo, f.nomeCompleto);
      return {
        nome_teste: `${marca} - ${f.nome}`,
        mensagem_erro: f.erro,
        url_print_tentativa1: urlPrint1,
        url_print_tentativa2: urlPrint2,
        url_print_tentativa3: urlPrint3,
      };
    });

    const payload = {
      run_id: `${RUN_ID}`,
      marca,
      plataforma: "web",
      data_hora: new Date().toISOString(),
      total_testes: total,
      total_passou: passou,
      total_falhou: falhou,
      duracao_seg: duracaoSeg,
      branch: BRANCH,
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
