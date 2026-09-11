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
// const ALLURE_ATTACHMENTS_REPORT = "allure-report/data/attachments";

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

// // 🟢 Extrai a string Base64 da imagem e os links do R2
// function obterEvidenciasEBase64R2(baseUrlR2) {
//   const evidencias = [];

//   if (fs.existsSync(ALLURE_ATTACHMENTS_REPORT)) {
//     const arquivos = fs.readdirSync(ALLURE_ATTACHMENTS_REPORT);

//     arquivos.forEach((arq) => {
//       const caminhoCompleto = path.join(ALLURE_ATTACHMENTS_REPORT, arq);
//       try {
//         const stats = fs.statSync(caminhoCompleto);

//         // Considera apenas arquivos acima de 1MB (prints/anexos pesados)
//         if (stats.size >= 1000000) {
//           const urlAnexoR2 = `${baseUrlR2}/data/attachments/${arq}`;
//           let base64Img = "";

//           if (arq.endsWith(".png") || arq.endsWith(".jpg")) {
//             // Se já for arquivo de imagem direto
//             const buffer = fs.readFileSync(caminhoCompleto);
//             base64Img = `data:image/png;base64,${buffer.toString("base64")}`;
//           } else if (arq.endsWith(".html") || arq.endsWith(".txt")) {
//             // Se for um arquivo HTML do Allure contendo a imagem embutida em base64
//             const conteudo = fs.readFileSync(caminhoCompleto, "utf-8");
//             const match = conteudo.match(/data:image\/[a-zA-Z]+;base64,[^"'\s)]+/);
//             if (match) {
//               base64Img = match[0];
//             }
//           }

//           evidencias.push({
//             urlR2: urlAnexoR2,
//             base64: base64Img,
//           });
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

//   // Busca os anexos R2 e extrai a string base64 do print
//   const evidenciasR2 = obterEvidenciasEBase64R2(baseUrlR2);
//   console.log(`📸 Evidências (>1MB) identificadas: ${evidenciasR2.length}`);

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
//     const nomeSuiteOriginal = st.$.name || "Mobile Test";
//     const nomeChave = nomeSuiteOriginal.toLowerCase().trim();

//     let marcaFormatada = "";
//     for (const key in MAPA_MARCAS_MOBILE) {
//       if (nomeChave.includes(key)) {
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
//         let imagemBase64 = "";

//         if (ponteiroEvidencia < evidenciasR2.length) {
//           urlAnexoR2 = evidenciasR2[ponteiroEvidencia].urlR2;
//           imagemBase64 = evidenciasR2[ponteiroEvidencia].base64;
//           ponteiroEvidencia++;
//         }

//         falhas.push({
//           nome_teste: `${marcaFormatada} - ${nomeTeste}`,
//           mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
//           url_print_tentativa1: urlAnexoR2,
//           url_print_tentativa2: urlAnexoR2,
//           url_print_tentativa3: urlAnexoR2,
//           imagem_base64: imagemBase64, // 🟢 Enviando a string da foto para renderização no HTML/Planilha
//         });
//       }
//     });

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
//       url_mochawesome: `${baseUrlR2}/index.html`,
//       falhas: falhas,
//     };

//     try {
//       const resposta = await enviarParaAppsScript(payload);
//       console.log(`✅ [${marcaFormatada}] enviado para o Apps Script ->`, resposta);
//     } catch (err) {
//       console.error(`❌ [${marcaFormatada}] erro ao enviar:`, err.message);
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
const ALLURE_ATTACHMENTS_REPORT = "allure-report/data/attachments";

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

// 🟢 Extrai a string Base64 do arquivo HTML e retorna a evidência ajustada
function obterEvidenciasEBase64R2(baseUrlR2) {
  const evidencias = [];

  if (fs.existsSync(ALLURE_ATTACHMENTS_REPORT)) {
    const arquivos = fs.readdirSync(ALLURE_ATTACHMENTS_REPORT);

    arquivos.forEach((arq) => {
      const caminhoCompleto = path.join(ALLURE_ATTACHMENTS_REPORT, arq);
      try {
        const stats = fs.statSync(caminhoCompleto);

        // Considera apenas anexos com tamanho superior a 1MB
        if (stats.size >= 1000000) {
          const urlAnexoR2 = `${baseUrlR2}/data/attachments/${arq}`;
          let base64Img = "";

          if (arq.endsWith(".png") || arq.endsWith(".jpg") || arq.endsWith(".jpeg")) {
            // Se já for imagem direta
            const buffer = fs.readFileSync(caminhoCompleto);
            base64Img = `data:image/png;base64,${buffer.toString("base64")}`;
          } else if (arq.endsWith(".html") || arq.endsWith(".txt")) {
            // 🎯 Extrai a imagem Base64 de dentro do arquivo HTML gerado pelo Allure
            const conteudo = fs.readFileSync(caminhoCompleto, "utf-8");
            const match = conteudo.match(/data:image\/[a-zA-Z]+;base64,[^"'\s)]+/);
            if (match) {
              base64Img = match[0];
            }
          }

          evidencias.push({
            // 🎯 Se encontrou a imagem em Base64, usa ela como a própria URL_PRINT para renderizar na <img> do Dash
            urlPrint: base64Img || urlAnexoR2,
            urlR2: urlAnexoR2,
            base64: base64Img,
          });
        }
      } catch (e) {
        console.error(`Erro ao processar anexo ${arq}:`, e.message);
      }
    });
  }

  return evidencias;
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

  // Busca as evidências e realiza a extração do Base64
  const evidenciasR2 = obterEvidenciasEBase64R2(baseUrlR2);
  console.log(`📸 Evidências (>1MB) identificadas: ${evidenciasR2.length}`);

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

  let ponteiroEvidencia = 0;

  for (const st of todasSuites) {
    const nomeSuiteOriginal = st.$.name || "Mobile Test";
    const nomeChave = nomeSuiteOriginal.toLowerCase().trim();

    let marcaFormatada = "";
    for (const key in MAPA_MARCAS_MOBILE) {
      if (nomeChave.includes(key)) {
        marcaFormatada = MAPA_MARCAS_MOBILE[key];
        break;
      }
    }
    if (!marcaFormatada) {
      marcaFormatada = `(APP) ${nomeSuiteOriginal}`;
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

        let urlPrintEvidencia = "";
        let imagemBase64 = "";

        if (ponteiroEvidencia < evidenciasR2.length) {
          // 🟢 Passa a string Base64 diretamente para as variáveis de print se extraída com sucesso
          urlPrintEvidencia = evidenciasR2[ponteiroEvidencia].urlPrint;
          imagemBase64 = evidenciasR2[ponteiroEvidencia].base64;
          ponteiroEvidencia++;
        }

        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlPrintEvidencia, // 🟢 Agora envia data:image/png;base64... em vez do link .html
          url_print_tentativa2: urlPrintEvidencia,
          url_print_tentativa3: urlPrintEvidencia,
          imagem_base64: imagemBase64,
        });
      }
    });

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
      url_mochawesome: `${baseUrlR2}/index.html`,
      falhas: falhas,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      console.log(`✅ [${marcaFormatada}] enviado para o Apps Script ->`, resposta);
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] erro ao enviar:`, err.message);
    }
  }
}

main();
