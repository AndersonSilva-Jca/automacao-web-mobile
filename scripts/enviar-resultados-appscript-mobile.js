// const fs = require("fs");
// const path = require("path");
// const https = require("https");
// const xml2js = require("xml2js");

// const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
// const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
// const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
// const BRANCH = process.env.GITHUB_REF_NAME || "main";
// const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-8f8304dd624445aca80dcb98bc5a78d0.r2.dev";

// const OUTPUT_XML = "results/output.xml";
// const ALLURE_REPORT_DIR = "allure-report/data/attachments";

// const MAPA_MARCAS_MOBILE = {
//   wemobi: "(APP) Wemobi",
//   1001: "(APP) 1001",
//   catarinense: "(APP) Catarinense",
//   cometa: "(APP) Cometa",
// };

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

// // 🟢 Procura os ficheiros de imagem gerados no allure-report/data/attachments e constrói as URLs do R2
// function obterEvidenciasR2(baseUrlR2) {
//   const evidencias = [];

//   if (fs.existsSync(ALLURE_REPORT_DIR)) {
//     const arquivos = fs.readdirSync(ALLURE_REPORT_DIR);

//     arquivos.forEach((arq) => {
//       const caminhoCompleto = path.join(ALLURE_REPORT_DIR, arq);
//       try {
//         const stats = fs.statSync(caminhoCompleto);
//         // Filtra anexos relevantes (imagens ou ficheiros de log/html de tamanho razoável)
//         if (stats.size > 10000) {
//           const urlAnexoR2 = `${baseUrlR2}/data/attachments/${arq}`;
//           evidencias.push(urlAnexoR2);
//         }
//       } catch (e) {
//         console.error(`Erro ao processar anexo ${arq}:`, e.message);
//       }
//     });
//   }

//   return evidencias;
// }

// function extrairSuitesRecursivo(suiteObj) {
//   let acumulado = [];
//   if (!suiteObj) return acumulado;

//   const listaSuites = Array.isArray(suiteObj) ? suiteObj : [suiteObj];

//   listaSuites.forEach((st) => {
//     if (st.test && st.test.length > 0) {
//       acumulado.push(st);
//     }
//     if (st.suite) {
//       acumulado = acumulado.concat(extrairSuitesRecursivo(st.suite));
//     }
//   });

//   return acumulado;
// }

// async function main() {
//   if (!APPS_SCRIPT_URL) {
//     console.error("❌ APPS_SCRIPT_URL não configurada. Abortando envio.");
//     process.exit(1);
//   }

//   if (!fs.existsSync(OUTPUT_XML)) {
//     console.error(`❌ Arquivo ${OUTPUT_XML} não encontrado. Nenhuma métrica enviada.`);
//     process.exit(1);
//   }

//   const xmlData = fs.readFileSync(OUTPUT_XML, "utf-8");
//   const parser = new xml2js.Parser();
//   const result = await parser.parseStringPromise(xmlData);

//   const robot = result.robot;
//   const baseUrlR2 = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}`;

//   const listaEvidenciasR2 = obterEvidenciasR2(baseUrlR2);
//   console.log(`📸 Evidências identificadas para URL do R2: ${listaEvidenciasR2.length}`);

//   const todasSuites = extrairSuitesRecursivo(robot.suite);

//   const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
//     timeZone: "America/Sao_Paulo",
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

//   let ponteiroEvidencia = 0;

//   for (const st of todasSuites) {
//     const nomeSuiteOriginal = st.$?.name || "Mobile Test";
//     const sourceSuite = st.$?.source || "";
//     const contextoMarca = `${nomeSuiteOriginal} ${sourceSuite}`.toLowerCase().trim();

//     let marcaFormatada = "";
//     for (const key in MAPA_MARCAS_MOBILE) {
//       if (contextoMarca.includes(key)) {
//         marcaFormatada = MAPA_MARCAS_MOBILE[key];
//         break;
//       }
//     }

//     if (!marcaFormatada) {
//       marcaFormatada = `(APP) ${nomeSuiteOriginal}`;
//     }

//     let total = 0,
//       passou = 0,
//       falhou = 0;
//     const falhas = [];

//     const testes = st.test || [];
//     testes.forEach((t) => {
//       total++;
//       const statusObj = t.status && t.status[0] ? t.status[0].$ : {};
//       const statusTeste = statusObj.status || "FAIL";

//       if (statusTeste === "PASS") {
//         passou++;
//       } else {
//         falhou++;
//         const nomeTeste = t.$.name || "Teste Mobile";
//         const msgErro = t.status && t.status[0] && t.status[0]._ ? t.status[0]._.trim() : "Falha na execução do teste mobile";

//         let urlAnexoR2 = "";
//         if (ponteiroEvidencia < listaEvidenciasR2.length) {
//           urlAnexoR2 = listaEvidenciasR2[ponteiroEvidencia];
//           ponteiroEvidencia++;
//         } else {
//           urlAnexoR2 = `${baseUrlR2}/index.html`;
//         }

//         falhas.push({
//           nome_teste: `${marcaFormatada} - ${nomeTeste}`,
//           mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
//           url_print_tentativa1: urlAnexoR2,
//           url_print_tentativa2: "",
//           url_print_tentativa3: "",
//         });
//       }
//     });

//     // 🟢 Lógica igual à do Cypress: Envia a URL do Mochawesome/Allure se houver falha, ou vazia se passou
//     const urlRelatorioFinal = falhou > 0 ? `${baseUrlR2}/index.html` : "";

//     const payload = {
//       run_id: `${RUN_ID}`,
//       marca: marcaFormatada,
//       plataforma: "mobile",
//       data_hora: new Date().toISOString(),
//       data_hora_formatada: dataHoraFormatada,
//       total_testes: total,
//       total_passou: passou,
//       total_falhou: falhou,
//       duracao_seg: 30,
//       branch: BRANCH,
//       url_mochawesome: urlRelatorioFinal,
//       falhas: falhas,
//     };

//     try {
//       const resposta = await enviarParaAppsScript(payload);
//       if (falhou > 0) {
//         console.log(`⚠️ [FALHA REGISTRADA] [${marcaFormatada}] enviado — falhou:${falhou} ->`, resposta);
//       } else {
//         console.log(`✅ [SUCESSO REGISTRADO] [${marcaFormatada}] enviado — passou:${passou} ->`, resposta);
//       }
//     } catch (err) {
//       console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
//     }
//   }
// }

// main();
const fs = require("fs");
const path = require("path");
const https = require("https");
const xml2js = require("xml2js");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const BRANCH = process.env.GITHUB_REF_NAME || "main";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-8f8304dd624445aca80dcb98bc5a78d0.r2.dev";

const OUTPUT_XML = "results/output.xml";
const ALLURE_RESULTS_DIR = process.env.ALLURE_DIR || "allure-results";
const ALLURE_REPORT_ATTACHMENTS = path.join("allure-report", "data", "attachments");

const MAPA_MARCAS_MOBILE = {
  wemobi: "(APP) Wemobi",
  1001: "(APP) 1001",
  catarinense: "(APP) Catarinense",
  cometa: "(APP) Cometa",
};

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

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Lê os arquivos -result.json do Allure para obter o hash exato dos anexos do teste
 */
function obterHashesAnexosDoTeste(nomeTeste, marcaChave) {
  const hashes = new Set();
  if (!fs.existsSync(ALLURE_RESULTS_DIR)) return hashes;

  const arquivos = fs.readdirSync(ALLURE_RESULTS_DIR).filter((a) => a.endsWith("-result.json"));
  const nomeNorm = normalizarTexto(nomeTeste);

  arquivos.forEach((arq) => {
    try {
      const conteudo = JSON.parse(fs.readFileSync(path.join(ALLURE_RESULTS_DIR, arq), "utf-8"));
      const testName = normalizarTexto(conteudo.name || conteudo.fullName);

      // Garante que o JSON pertence ao teste/marca que falhou
      if (testName.includes(nomeNorm) || normalizarTexto(arq).includes(marcaChave)) {
        const coletar = (obj) => {
          if (!obj) return;
          if (Array.isArray(obj.attachments)) {
            obj.attachments.forEach((att) => {
              if (att.source) hashes.add(att.source);
            });
          }
          if (Array.isArray(obj.steps)) obj.steps.forEach(coletar);
        };
        coletar(conteudo);
      }
    } catch (e) {
      console.error(`Erro ao ler JSON do Allure: ${arq}`, e.message);
    }
  });

  return hashes;
}

/**
 * Localiza a imagem ou anexo da marca que realmente pertence ao teste que falhou
 */
function obterEvidenciaDoTeste(nomeTeste, marcaChave, baseUrlR2) {
  if (!fs.existsSync(ALLURE_REPORT_ATTACHMENTS)) {
    return `${baseUrlR2}/index.html`;
  }

  const anexosDoTeste = obterHashesAnexosDoTeste(nomeTeste, marcaChave);
  const arquivos = fs.readdirSync(ALLURE_REPORT_ATTACHMENTS);

  // 1. Procura primeiro entre os anexos explicitamente vinculados no JSON do Allure
  for (const arq of arquivos) {
    if (anexosDoTeste.has(arq) && (arq.endsWith(".png") || arq.endsWith(".jpg"))) {
      return `${baseUrlR2}/data/attachments/${arq}`;
    }
  }

  // 2. Filtro de contingência por nome da marca no arquivo
  const printDaMarca = arquivos.find((arq) => {
    const nomeNorm = normalizarTexto(arq);
    return (arq.endsWith(".png") || arq.endsWith(".jpg")) && nomeNorm.includes(marcaChave);
  });

  if (printDaMarca) {
    return `${baseUrlR2}/data/attachments/${printDaMarca}`;
  }

  // 3. Caso não encontre print da marca, direciona ao relatório completo
  return `${baseUrlR2}/index.html`;
}

function extrairSuitesRecursivo(suiteObj) {
  let acumulado = [];
  if (!suiteObj) return acumulado;

  const listaSuites = Array.isArray(suiteObj) ? suiteObj : [suiteObj];

  listaSuites.forEach((st) => {
    if (st.test && st.test.length > 0) {
      acumulado.push(st);
    }
    if (st.suite) {
      acumulado = acumulado.concat(extrairSuitesRecursivo(st.suite));
    }
  });

  return acumulado;
}

async function main() {
  if (!APPS_SCRIPT_URL) {
    console.error("❌ APPS_SCRIPT_URL não configurada. Abortando envio.");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_XML)) {
    console.error(`❌ Arquivo ${OUTPUT_XML} não encontrado. Nenhuma métrica enviada.`);
    process.exit(1);
  }

  const xmlData = fs.readFileSync(OUTPUT_XML, "utf-8");
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xmlData);

  const robot = result.robot;
  const baseUrlR2 = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}`;
  const todasSuites = extrairSuitesRecursivo(robot.suite);

  const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  for (const st of todasSuites) {
    const nomeSuiteOriginal = st.$?.name || "Mobile Test";
    const sourceSuite = st.$?.source || "";
    const contextoMarca = `${nomeSuiteOriginal} ${sourceSuite}`.toLowerCase().trim();

    let marcaFormatada = "";
    let marcaChave = "";

    for (const key in MAPA_MARCAS_MOBILE) {
      if (contextoMarca.includes(key)) {
        marcaFormatada = MAPA_MARCAS_MOBILE[key];
        marcaChave = key;
        break;
      }
    }

    if (!marcaFormatada) {
      marcaFormatada = `(APP) ${nomeSuiteOriginal}`;
      marcaChave = normalizarTexto(nomeSuiteOriginal);
    }

    let total = 0,
      passou = 0,
      falhou = 0;
    const falhas = [];

    const testes = st.test || [];
    testes.forEach((t) => {
      total++;
      const statusObj = t.status && t.status[0] ? t.status[0].$ : {};
      const statusTeste = statusObj.status || "FAIL";

      if (statusTeste === "PASS") {
        passou++;
      } else {
        falhou++;
        const nomeTeste = t.$.name || "Teste Mobile";
        const msgErro = t.status && t.status[0] && t.status[0]._ ? t.status[0]._.trim() : "Falha na execução do teste mobile";

        // Busca a evidência isolando pela marca e teste específico
        const urlAnexoR2 = obterEvidenciaDoTeste(nomeTeste, marcaChave, baseUrlR2);

        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlAnexoR2,
          url_print_tentativa2: "",
          url_print_tentativa3: "",
        });
      }
    });

    const urlRelatorioFinal = falhou > 0 ? `${baseUrlR2}/index.html` : "";

    const payload = {
      run_id: `${RUN_ID}`,
      marca: marcaFormatada,
      plataforma: "mobile",
      data_hora: new Date().toISOString(),
      data_hora_formatada: dataHoraFormatada,
      total_testes: total,
      total_passou: passou,
      total_falhou: falhou,
      duracao_seg: 30,
      branch: BRANCH,
      url_mochawesome: urlRelatorioFinal,
      falhas: falhas,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      if (falhou > 0) {
        console.log(`⚠️ [FALHA REGISTRADA] [${marcaFormatada}] enviado — falhou:${falhou} ->`, resposta);
      } else {
        console.log(`✅ [SUCESSO REGISTRADO] [${marcaFormatada}] enviado — passou:${passou} ->`, resposta);
      }
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
    }
  }
}

main();
