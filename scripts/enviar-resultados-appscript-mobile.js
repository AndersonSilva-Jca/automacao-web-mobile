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

  // Calcula a duração total em segundos
  let duracaoSeg = 0;
  if (robot.suite && robot.suite[0] && robot.suite[0].status) {
    const status = robot.suite[0].status[0].$;
    if (status.starttime && status.endtime) {
      const start = new Date(status.starttime.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2}):(\d{2}).*/, "$1-$2-$3T$4:$5:$6"));
      const end = new Date(status.endtime.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2}):(\d{2}):(\d{2}).*/, "$1-$2-$3T$4:$5:$6"));
      duracaoSeg = Math.round((end - start) / 1000);
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

  const payload = {
    run_id: `${RUN_ID}`,
    marca: "Wemobi/UTP",
    plataforma: "mobile", // 👈 Identificador para diferenciar da Web
    data_hora: new Date().toISOString(),
    data_hora_formatada: dataHoraFormatada,
    total_testes: total,
    total_passou: passou,
    total_falhou: falhou,
    duracao_seg: duracaoSeg,
    branch: BRANCH,
    url_mochawesome: urlRelatorio,
    falhas: [],
  };

  try {
    const resposta = await enviarParaAppsScript(payload);
    console.log(`✅ [MOBILE - Wemobi/UTP] enviado com sucesso! ->`, resposta);
  } catch (err) {
    console.error(`❌ Falha ao enviar métricas mobile:`, err.message);
  }
}

main();
