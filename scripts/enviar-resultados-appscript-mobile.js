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
//   const statElem = robot.statistics && robot.statistics[0] && robot.statistics[0].total && robot.statistics[0].total[0].stat[0].$;

//   const passou = parseInt(statElem.pass || "0", 10);
//   const falhou = parseInt(statElem.fail || "0", 10);
//   const total = passou + falhou;

//   // Calcula a duração total em segundos
//   // Lógica corrigida para calcular a duração total em segundos
//   let duracaoSeg = 0;
//   if (robot.suite && robot.suite[0] && robot.suite[0].status) {
//     const statusObj = robot.suite[0].status[0].$;
//     const startStr = statusObj.starttime || "";
//     const endStr = statusObj.endtime || "";

//     if (startStr && endStr) {
//       // Função para converter strings do Robot (ISO ou AAAAMMDD HH:MM:SS) em Date
//       const converterDataRobot = (str) => {
//         // Se estiver no formato AAAAMMDD HH:MM:SS.mmm
//         const match = str.match(/^(\d{4})(\d{2})(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
//         if (match) {
//           const [, ano, mes, dia, hora, min, seg] = match;
//           return new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg}`);
//         }
//         // Se já estiver em formato ISO
//         return new Date(str);
//       };

//       const start = converterDataRobot(startStr);
//       const end = converterDataRobot(endStr);

//       if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
//         duracaoSeg = Math.round((end - start) / 1000);
//       }
//     }
//   }

//   const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
//     timeZone: "America/Sao_Paulo",
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });

//   const urlRelatorio = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}/index.html`;

//   const payload = {
//     run_id: `${RUN_ID}`,
//     marca: "Wemobi/UTP",
//     plataforma: "mobile", // 👈 Identificador para diferenciar da Web
//     data_hora: new Date().toISOString(),
//     data_hora_formatada: dataHoraFormatada,
//     total_testes: total,
//     total_passou: passou,
//     total_falhou: falhou,
//     duracao_seg: duracaoSeg,
//     branch: BRANCH,
//     url_mochawesome: urlRelatorio,
//     falhas: [],
//   };

//   try {
//     const resposta = await enviarParaAppsScript(payload);
//     console.log(`✅ [MOBILE - Wemobi/UTP] enviado com sucesso! ->`, resposta);
//   } catch (err) {
//     console.error(`❌ Falha ao enviar métricas mobile:`, err.message);
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
const ALLURE_DIR = process.env.ALLURE_DIR || "allure-results";

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

// Extrai as falhas e mapeia com os anexos de print gerados pelo Allure e salvos no R2
function extrairFalhasComEvidencias() {
  const falhas = [];
  const baseUrl = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}`;

  if (!fs.existsSync(ALLURE_DIR)) return falhas;

  const arquivosAllure = fs.readdirSync(ALLURE_DIR);

  arquivosAllure.forEach((arquivo) => {
    if (arquivo.endsWith("-result.json")) {
      try {
        const conteudo = JSON.parse(fs.readFileSync(path.join(ALLURE_DIR, arquivo), "utf-8"));

        if (conteudo.status === "failed" || conteudo.status === "broken") {
          let urlPrint = "";

          // Procura pelo anexo de imagem gerado pelo Allure
          if (Array.isArray(conteudo.attachments)) {
            const anexoImagem = conteudo.attachments.find((att) => att.type && att.type.startsWith("image/") && att.source);
            if (anexoImagem) {
              urlPrint = `${baseUrl}/data/attachments/${anexoImagem.source}`;
            }
          }

          const mensagemErro = conteudo.statusDetails && conteudo.statusDetails.message ? conteudo.statusDetails.message.replace(/\n/g, " ").replace(/\r/g, "").trim() : "Erro não especificado no teste mobile";

          falhas.push({
            nome_teste: conteudo.name || "Teste Mobile",
            mensagem_erro: mensagemErro,
            url_print_tentativa1: urlPrint,
            url_print_tentativa2: "",
            url_print_tentativa3: "",
          });
        }
      } catch (e) {
        console.error(`⚠️ Erro ao ler arquivo do Allure (${arquivo}):`, e.message);
      }
    }
  });

  return falhas;
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
  const statElem = robot.statistics && robot.statistics[0] && robot.statistics[0].total && robot.statistics[0].total[0].stat[0].$;

  const passou = parseInt(statElem.pass || "0", 10);
  const falhou = parseInt(statElem.fail || "0", 10);
  const total = passou + falhou;

  let duracaoSeg = 0;
  if (robot.suite && robot.suite[0] && robot.suite[0].status) {
    const statusObj = robot.suite[0].status[0].$;
    const startStr = statusObj.starttime || "";
    const endStr = statusObj.endtime || "";

    if (startStr && endStr) {
      const converterDataRobot = (str) => {
        const match = str.match(/^(\d{4})(\d{2})(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
        if (match) {
          const [, ano, mes, dia, hora, min, seg] = match;
          return new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg}`);
        }
        return new Date(str);
      };

      const start = converterDataRobot(startStr);
      const end = converterDataRobot(endStr);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        duracaoSeg = Math.round((end - start) / 1000);
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

  const urlRelatorio = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}/index.html`;

  // Extrai as falhas detalhadas e as URLs públicas dos prints do R2
  const falhasEncontradas = extrairFalhasComEvidencias();

  const payload = {
    run_id: `${RUN_ID}`,
    marca: "Wemobi/UTP",
    plataforma: "mobile",
    data_hora: new Date().toISOString(),
    data_hora_formatada: dataHoraFormatada,
    total_testes: total,
    total_passou: passou,
    total_falhou: falhou,
    duracao_seg: duracaoSeg,
    branch: BRANCH,
    url_mochawesome: urlRelatorio,
    falhas: falhasEncontradas,
  };

  try {
    const resposta = await enviarParaAppsScript(payload);
    console.log(`✅ [MOBILE - Wemobi/UTP] enviado com sucesso! ->`, resposta);
  } catch (err) {
    console.error(`❌ Falha ao enviar métricas mobile:`, err.message);
  }
}

main();
