const fs = require("fs");
const path = require("path");
const https = require("https");
const xml2js = require("xml2js");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const BRANCH = process.env.GITHUB_REF_NAME || "main";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

const RESULTS_DIR = process.env.RESULTS_DIR || "results";
const OUTPUT_XML = path.join(RESULTS_DIR, "output.xml");

const MAPA_MARCAS_MOBILE = {
  wemobi: "(APP) Wemobi",
  1001: "(APP) 1001",
  catarinense: "(APP) Catarinense",
  cometa: "(APP) Cometa",
  giro: "(APP) Clube Giro",
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

function listarScreenshots(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => ({
      name: f,
      mtime: fs.statSync(path.join(dir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
}

function encontrarScreenshotParaTeste(nomeTeste, screenshotsDisponiveis) {
  if (!screenshotsDisponiveis.length) return "";
  const nomeNorm = nomeTeste.toLowerCase().replace(/[^a-z0-9]/g, "");

  const matchDireto = screenshotsDisponiveis.find((s) =>
    s.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .includes(nomeNorm),
  );
  if (matchDireto) return matchDireto.name;

  // Fallback: retorna o print mais recente capturado na execução
  return screenshotsDisponiveis[0].name;
}

function identificarMarca(textoContexto) {
  const lower = textoContexto.toLowerCase();
  for (const key of Object.keys(MAPA_MARCAS_MOBILE)) {
    if (lower.includes(key)) {
      return MAPA_MARCAS_MOBILE[key];
    }
  }
  return `(APP) ${textoContexto}`;
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
  const parsed = await parser.parseStringPromise(xmlData);

  const baseUrlR2 = `${R2_PUBLIC_URL}/reports/maestro-run-${RUN_NUMBER}`;
  const screenshots = listarScreenshots(RESULTS_DIR);

  const dataHoraFormatada = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Normaliza estrutura JUnit (<testsuites> -> <testsuite> ou <testsuite> raiz)
  let suites = [];
  if (parsed.testsuites && parsed.testsuites.testsuite) {
    suites = Array.isArray(parsed.testsuites.testsuite) ? parsed.testsuites.testsuite : [parsed.testsuites.testsuite];
  } else if (parsed.testsuite) {
    suites = Array.isArray(parsed.testsuite) ? parsed.testsuite : [parsed.testsuite];
  }

  // Agrupa resultados por marca identificada
  const resultadosPorMarca = {};

  for (const suite of suites) {
    const testcases = suite.testcase ? (Array.isArray(suite.testcase) ? suite.testcase : [suite.testcase]) : [];

    for (const tc of testcases) {
      const nomeTeste = tc.$?.name || suite.$?.name || "Maestro Flow";
      const className = tc.$?.classname || "";
      const contexto = `${nomeTeste} ${className} ${suite.$?.name || ""}`;
      const marcaFormatada = identificarMarca(contexto);

      if (!resultadosPorMarca[marcaFormatada]) {
        resultadosPorMarca[marcaFormatada] = {
          total: 0,
          passou: 0,
          falhou: 0,
          duracao: 0,
          falhas: [],
        };
      }

      const grupo = resultadosPorMarca[marcaFormatada];
      grupo.total += 1;
      grupo.duracao += Math.round(parseFloat(tc.$?.time || "0"));

      const failureNode = tc.failure || tc.error;
      if (!failureNode) {
        grupo.passou += 1;
      } else {
        grupo.falhou += 1;
        const failItem = Array.isArray(failureNode) ? failureNode[0] : failureNode;
        const msgBruta = (typeof failItem === "string" ? failItem : failItem._ || failItem.$?.message) || "Falha na execução do fluxo Maestro";

        const nomePrint = encontrarScreenshotParaTeste(nomeTeste, screenshots);
        const urlAnexoR2 = nomePrint ? `${baseUrlR2}/${nomePrint}` : `${baseUrlR2}/index.html`;

        grupo.falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgBruta.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlAnexoR2,
          url_print_tentativa2: "",
          url_print_tentativa3: "",
        });
      }
    }
  }

  for (const [marcaFormatada, dados] of Object.entries(resultadosPorMarca)) {
    const urlRelatorioFinal = dados.falhou > 0 ? `${baseUrlR2}/index.html` : "";

    const payload = {
      run_id: `${RUN_ID}`,
      marca: marcaFormatada,
      plataforma: "mobile",
      data_hora: new Date().toISOString(),
      data_hora_formatada: dataHoraFormatada,
      total_testes: dados.total,
      total_passou: dados.passou,
      total_falhou: dados.falhou,
      duracao_seg: dados.duracao || 30,
      branch: BRANCH,
      url_mochawesome: urlRelatorioFinal,
      falhas: dados.falhas,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      if (dados.falhou > 0) {
        console.log(`⚠️ [FALHA REGISTRADA] [${marcaFormatada}] enviado — falhou:${dados.falhou} ->`, resposta);
      } else {
        console.log(`✅ [SUCESSO REGISTRADO] [${marcaFormatada}] enviado — passou:${dados.passou} ->`, resposta);
      }
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
    }
  }
}

main();
