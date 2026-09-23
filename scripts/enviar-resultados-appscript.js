// const fs = require("fs");
// const path = require("path");
// const https = require("https");

// const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
// const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
// const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
// const BRANCH = process.env.GITHUB_REF_NAME || "main";
// const CYPRESS_R2_PUBLIC_URL = process.env.CYPRESS_R2_PUBLIC_URL;
// const REPORTS_DIR = "cypress/reports";
// const SCREENSHOTS_DIR = "cypress/reports/screenshots";

// const MAPA_MARCAS = {
//   "01_ODH": "Outlet de Hotéis",
//   "03_Giro": "Clube Giro",
//   "05_Cometa": "Viação Cometa",
//   "06_1001": "Auto Viação 1001",
//   "07_ExpressoSul": "Expresso Sul",
//   "08_RapidoRibeirao": "Rápido Ribeirão",
//   "09_Catarinense": "Catarinense",
//   "10_Totem": "Totem",
// };

// function encontrarJsonMochawesome(dir) {
//   const caminhoIndex = path.join(dir, "index.json");
//   if (!fs.existsSync(caminhoIndex)) return null;
//   try {
//     const conteudo = JSON.parse(fs.readFileSync(caminhoIndex, "utf-8"));
//     if (Array.isArray(conteudo.results)) return conteudo;
//   } catch (e) {
//     console.error(`❌ Erro ao ler/parsear ${caminhoIndex}:`, e.message);
//   }
//   return null;
// }

// function buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompletoTeste) {
//   const pastaSpecLocal = path.join(SCREENSHOTS_DIR, `${nomeSpecArquivo}.cy.js`);
//   const nomeLimpo = nomeCompletoTeste ? nomeCompletoTeste.trim() : "";
//   const urlsPorTentativa = ["", "", ""];

//   if (!fs.existsSync(pastaSpecLocal)) {
//     return urlsPorTentativa;
//   }

//   const arquivos = fs.readdirSync(pastaSpecLocal);
//   const prefixo = `${nomeLimpo} (failed)`;
//   const candidatos = arquivos.filter((a) => a.startsWith(prefixo));

//   if (candidatos.length === 0) return urlsPorTentativa;

//   const urlBase = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/screenshots`;

//   candidatos.forEach((nomeArquivo) => {
//     const attempt = parseInt((nomeArquivo.match(/attempt (\d+)/) || [])[1] || "1", 10);
//     if (attempt < 1 || attempt > 3) return;

//     const urlFinal = `${urlBase}/${encodeURIComponent(nomeSpecArquivo + ".cy.js")}/${encodeURIComponent(nomeArquivo)}`;
//     urlsPorTentativa[attempt - 1] = urlFinal;
//   });

//   return urlsPorTentativa;
// }

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

// function extrairTestesDaSuite(suite, nomeSpecArquivo, caminhoSuites = []) {
//   let listaTestes = [];
//   const tituloSuite = suite.title ? suite.title.trim() : "";
//   const caminhoAtual = tituloSuite ? [...caminhoSuites, tituloSuite] : caminhoSuites;

//   // Itera sobre cada 'it(...)' individual
//   (suite.tests || []).forEach((t) => {
//     const tituloTeste = t.title ? t.title.trim() : "";

//     // Se for spec com múltiplos 'it' (ex: Wemobi/ODP), o nome do 'it' vira o nome da marca.
//     // Caso contrário, usa o MAPA_MARCAS ou o nome da spec.
//     const marcaFinal = nomeSpecArquivo === "02_ODP" || nomeSpecArquivo === "04_Wemobi" ? tituloTeste : MAPA_MARCAS[nomeSpecArquivo] || tituloSuite || nomeSpecArquivo;

//     const passou = t.state === "passed" ? 1 : 0;
//     const falhou = t.state === "failed" ? 1 : 0;
//     const falhas = [];

//     if (falhou === 1) {
//       const nomeCompleto = [...caminhoAtual, tituloTeste].join(" -- ");
//       const [u1, u2, u3] = buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompleto);
//       falhas.push({
//         nome_teste: `${marcaFinal} - ${tituloTeste}`,
//         mensagem_erro: t.err && t.err.message ? t.err.message : "Erro não especificado",
//         url_print_tentativa1: u1,
//         url_print_tentativa2: u2,
//         url_print_tentativa3: u3,
//       });
//     }

//     listaTestes.push({
//       marca: marcaFinal,
//       total: 1,
//       passou,
//       falhou,
//       duracaoSeg: Math.round((t.duration || 0) / 1000),
//       falhas,
//     });
//   });

//   // Percorre sub-suítes caso existam
//   (suite.suites || []).forEach((s) => {
//     listaTestes = listaTestes.concat(extrairTestesDaSuite(s, nomeSpecArquivo, caminhoAtual));
//   });

//   return listaTestes;
// }

// function extrairNomeSpec(caminhoArquivo) {
//   return path.basename(caminhoArquivo, ".cy.js");
// }

// async function main() {
//   if (!APPS_SCRIPT_URL) {
//     console.error("❌ APPS_SCRIPT_URL não configurada. Abortando envio.");
//     process.exit(1);
//   }

//   const relatorio = encontrarJsonMochawesome(REPORTS_DIR);
//   if (!relatorio) {
//     console.error(`❌ Não encontrei o JSON do Mochawesome em "${REPORTS_DIR}".`);
//     process.exit(1);
//   }

//   const urlRelatorio = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/index.html`;

//   console.log(`📦 Processando ${relatorio.results.length} spec(s)...`);

//   for (const specResult of relatorio.results) {
//     const caminhoSpec = specResult.file || specResult.fullFile || "";
//     const nomeSpecArquivo = extrairNomeSpec(caminhoSpec);

//     let todosOsTestes = [];
//     (specResult.suites || []).forEach((suite) => {
//       todosOsTestes = todosOsTestes.concat(extrairTestesDaSuite(suite, nomeSpecArquivo));
//     });

//     // 💡 FILTRO: Seleciona APENAS os itens que contêm pelo menos 1 falha
//     // const apenasFalhas = todosOsTestes.filter((item) => item.falhou > 0);

//     if (apenasFalhas.length === 0) {
//       console.log(`✅ [${nomeSpecArquivo}] Todos os testes passaram! Ignorando envio deste spec.`);
//       continue; // Pula para a próxima spec sem enviar nada ao Apps Script
//     }

//     const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
//       timeZone: "America/Sao_Paulo",
//       day: "2-digit",
//       month: "2-digit",
//       year: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });

//     for (const item of todosOsTestes) {
//       const payload = {
//         run_id: `${RUN_ID}`,
//         marca: item.marca,
//         plataforma: "web",
//         data_hora: new Date().toISOString(),
//         data_hora_formatada: dataHoraFormatada,
//         total_testes: item.total, // Envia o total real de testes da spec
//         total_passou: item.passou, // Registra as passagens
//         total_falhou: item.falhou, // Registra as falhas
//         duracao_seg: item.duracaoSeg,
//         branch: BRANCH,
//         url_allure: "",
//         url_mochawesome: urlRelatorio,
//         falhas: item.falhas,
//       };

//       try {
//         const resposta = await enviarParaAppsScript(payload);
//         console.log(`📊 [REGISTRO ENVIADO - ${item.marca}] ->`, resposta);
//       } catch (err) {
//         console.error(`❌ [${item.marca}] Falha ao enviar registro:`, err.message);
//       }
//     }

//     // try {
//     //     const resposta = await enviarParaAppsScript(payload);
//     //     console.log(`🚨 [FALHA REGISTRADA - ${item.marca}] enviado com sucesso ->`, resposta);
//     //   } catch (err) {
//     //     console.error(`❌ [${item.marca}] falhou ao enviar registro:`, err.message);
//     //   }

//     // try {
//     //   const resposta = await enviarParaAppsScript(payload);
//     //   console.log(`✅ [${item.marca}] enviado — passou:${item.passou} falhou:${item.falhou} ->`, resposta);
//     // } catch (err) {
//     //   console.error(`❌ [${item.marca}] falhou ao enviar:`, err.message);
//     // }
//     // }
//   }
// }

// main();

const fs = require("fs");
const path = require("path");
const https = require("https");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const BRANCH = process.env.GITHUB_REF_NAME || "main";
const CYPRESS_R2_PUBLIC_URL = process.env.CYPRESS_R2_PUBLIC_URL;
const REPORTS_DIR = "cypress/reports";
const SCREENSHOTS_DIR = "cypress/reports/screenshots";

const MAPA_MARCAS = {
  "01_ODH": "Outlet de Hotéis",
  "03_Giro": "Clube Giro",
  "05_Cometa": "Viação Cometa",
  "06_1001": "Auto Viação 1001",
  "07_ExpressoSul": "Expresso Sul",
  "08_RapidoRibeirao": "Rápido Ribeirão",
  "09_Catarinense": "Catarinense",
  "10_Totem": "Totem",
};

function encontrarJsonMochawesome(dir) {
  const caminhoIndex = path.join(dir, "index.json");
  if (!fs.existsSync(caminhoIndex)) return null;
  try {
    const conteudo = JSON.parse(fs.readFileSync(caminhoIndex, "utf-8"));
    if (Array.isArray(conteudo.results)) return conteudo;
  } catch (e) {
    console.error(`❌ Erro ao ler/parsear ${caminhoIndex}:`, e.message);
  }
  return null;
}

function buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompletoTeste) {
  const pastaSpecLocal = path.join(SCREENSHOTS_DIR, `${nomeSpecArquivo}.cy.js`);
  const nomeLimpo = nomeCompletoTeste ? nomeCompletoTeste.trim() : "";
  const urlsPorTentativa = ["", "", ""];

  if (!fs.existsSync(pastaSpecLocal)) {
    return urlsPorTentativa;
  }

  const arquivos = fs.readdirSync(pastaSpecLocal);
  const prefixo = `${nomeLimpo} (failed)`;
  const candidatos = arquivos.filter((a) => a.startsWith(prefixo));

  if (candidatos.length === 0) return urlsPorTentativa;

  const urlBase = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/screenshots`;

  candidatos.forEach((nomeArquivo) => {
    const attempt = parseInt((nomeArquivo.match(/attempt (\d+)/) || [])[1] || "1", 10);
    if (attempt < 1 || attempt > 3) return;

    const urlFinal = `${urlBase}/${encodeURIComponent(nomeSpecArquivo + ".cy.js")}/${encodeURIComponent(nomeArquivo)}`;
    urlsPorTentativa[attempt - 1] = urlFinal;
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

function extrairTestesDaSuite(suite, nomeSpecArquivo, caminhoSuites = []) {
  let listaTestes = [];
  const tituloSuite = suite.title ? suite.title.trim() : "";
  const caminhoAtual = tituloSuite ? [...caminhoSuites, tituloSuite] : caminhoSuites;

  (suite.tests || []).forEach((t) => {
    const tituloTeste = t.title ? t.title.trim() : "";

    const marcaFinal = nomeSpecArquivo === "02_ODP" || nomeSpecArquivo === "04_Wemobi" ? tituloTeste : MAPA_MARCAS[nomeSpecArquivo] || tituloSuite || nomeSpecArquivo;

    const passou = t.state === "passed" ? 1 : 0;
    const falhou = t.state === "failed" ? 1 : 0;
    const falhas = [];

    if (falhou === 1) {
      const nomeCompleto = [...caminhoAtual, tituloTeste].join(" -- ");
      const [u1, u2, u3] = buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompleto);
      falhas.push({
        nome_teste: `${marcaFinal} - ${tituloTeste}`,
        mensagem_erro: t.err && t.err.message ? t.err.message : "Erro não especificado",
        url_print_tentativa1: u1,
        url_print_tentativa2: u2,
        url_print_tentativa3: u3,
      });
    }

    listaTestes.push({
      marca: marcaFinal,
      total: 1,
      passou,
      falhou,
      duracaoSeg: Math.round((t.duration || 0) / 1000),
      falhas,
    });
  });

  (suite.suites || []).forEach((s) => {
    listaTestes = listaTestes.concat(extrairTestesDaSuite(s, nomeSpecArquivo, caminhoAtual));
  });

  return listaTestes;
}

function extrairNomeSpec(caminhoArquivo) {
  return path.basename(caminhoArquivo, ".cy.js");
}

async function main() {
  if (!APPS_SCRIPT_URL) {
    console.error("❌ APPS_SCRIPT_URL não configurada. Abortando envio.");
    process.exit(1);
  }

  const relatorio = encontrarJsonMochawesome(REPORTS_DIR);
  if (!relatorio) {
    console.error(`❌ Não encontrei o JSON do Mochawesome em "${REPORTS_DIR}".`);
    process.exit(1);
  }

  const urlRelatorio = `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/index.html`;

  let totalTestesRun = 0;
  let totalPassouRun = 0;
  let totalFalhouRun = 0;
  let duracaoTotalSeg = 0;
  let todasAsFalhas = [];

  console.log(`📦 Consolidando ${relatorio.results.length} spec(s)...`);

  // Percorre todas as specs e acumula os valores globais da suíte
  for (const specResult of relatorio.results) {
    const caminhoSpec = specResult.file || specResult.fullFile || "";
    const nomeSpecArquivo = extrairNomeSpec(caminhoSpec);

    let testesSpec = [];
    (specResult.suites || []).forEach((suite) => {
      testesSpec = testesSpec.concat(extrairTestesDaSuite(suite, nomeSpecArquivo));
    });

    for (const item of testesSpec) {
      totalTestesRun += item.total || 0;
      totalPassouRun += item.passou || 0;
      totalFalhouRun += item.falhou || 0;
      duracaoTotalSeg += item.duracaoSeg || 0;

      if (item.falhas && item.falhas.length > 0) {
        todasAsFalhas = todasAsFalhas.concat(item.falhas);
      }
    }
  }

  const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Monta um único payload consolidado para a execução
  const payload = {
    run_id: `${RUN_ID}`,
    marca: item.marca,
    plataforma: "web",
    data_hora: new Date().toISOString(),
    data_hora_formatada: dataHoraFormatada,
    total_testes: totalTestesRun, // Soma real de todos os testes
    total_passou: totalPassouRun, // Soma das passagens com sucesso
    total_falhou: totalFalhouRun, // Soma das falhas
    duracao_seg: Math.round(duracaoTotalSeg),
    branch: BRANCH,
    url_allure: "",
    url_mochawesome: urlRelatorio,
    falhas: todasAsFalhas,
  };

  try {
    const resposta = await enviarParaAppsScript(payload);
    console.log(`📊 [REGISTRO ENVIADO - ${item.marca}] ->`, resposta);
  } catch (err) {
    console.error(`❌ [${item.marca}] Falha ao enviar registro:`, err.message);
  }
}

// try {
//   console.log(`🚀 Enviando resultado consolidado para o Apps Script:`, payload);
//   const resposta = await enviarParaAppsScript(payload);
//   console.log(`📊 [REGISTRO ENVIADO] ->`, resposta);
// } catch (err) {
//   console.error(`❌ Falha ao enviar registro consolidado:`, err.message);
// }
// }

main();
