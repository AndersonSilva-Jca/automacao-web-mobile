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

// 🟢 Mapeamento do nome do arquivo Robot / Suíte para o nome exibido nos Gráficos e na Tabela de Falhas
const MAPA_MARCAS_MOBILE = {
  emobi_login: "(APP) Wemobi",
  "1001_login": "(APP) 1001",
  catarinense_login: "(APP) Catarinense",
  cometa_login: "(APP) Viação Cometa",
  "Wemobi Login": "(APP) Wemobi",
  "Catarinense Login": "(APP) Catarinense",
  "Cometa Login": "(APP) Viação Cometa",
  wemobi_login: "(APP) Wemobi",
  "1001_login": "(APP) Auto Viação 1001",
  catarinense_login: "(APP) Catarinense",
  cometa_login: "(APP) Viação Cometa",
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

// Mapeia evidências anexadas pelo Allure para o R2
function obterAnexoPrintAllure(attachmentList, baseUrl) {
  if (!Array.isArray(attachmentList)) return "";
  const anexoImagem = attachmentList.find((att) => att.type && att.type.startsWith("image/") && att.source);
  return anexoImagem ? `${baseUrl}/data/attachments/${anexoImagem.source}` : "";
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

  // Lê as suítes filhas diretamente do output do Robot Framework
  const suitesPrincipais = robot.suite && robot.suite[0] && robot.suite[0].suite ? robot.suite[0].suite : [];

  // Leitura dos JSONs do Allure para vinculo de prints
  const mapaEvidenciasAllure = new Map();
  if (fs.existsSync(ALLURE_DIR)) {
    fs.readdirSync(ALLURE_DIR).forEach((arq) => {
      if (arq.endsWith("-result.json")) {
        try {
          const json = JSON.parse(fs.readFileSync(path.join(ALLURE_DIR, arq), "utf-8"));
          if (json.name) {
            mapaEvidenciasAllure.set(json.name, json);
          }
        } catch (e) {}
      }
    });
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

  // Iteração por arquivo/suíte de marca (idêntico ao loop por spec do Cypress)
  for (const st of suitesPrincipais) {
    const nomeSuiteOriginal = st.$.name || "Mobile Test";
    const marcaFormatada = MAPA_MARCAS_MOBILE[nomeSuiteOriginal] || MAPA_MARCAS_MOBILE[nomeSuiteOriginal.toLowerCase()] || `(APP) ${nomeSuiteOriginal}`;

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

        let urlPrint = "";
        if (mapaEvidenciasAllure.has(nomeTeste)) {
          const jsonAllure = mapaEvidenciasAllure.get(nomeTeste);
          urlPrint = obterAnexoPrintAllure(jsonAllure.attachments, baseUrlR2);
        }

        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlPrint,
          url_print_tentativa2: "",
          url_print_tentativa3: "",
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
      url_mochawesome: `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}/index.html`,
      falhas: falhas,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      console.log(`✅ [${marcaFormatada}] enviado — total:${total} passou:${passou} falhou:${falhou} ->`, resposta);
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
    }
  }
}

main();
