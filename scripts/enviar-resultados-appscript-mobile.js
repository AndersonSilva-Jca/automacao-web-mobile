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
const ALLURE_ATTACHMENTS_REPORT = "allure-report/data/attachments";

// 🟢 Mapeamento padronizado de marcas exatamente como solicitado
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

// 🟢 Varre a pasta do Allure para capturar evidências de imagem (URL no R2 ou Base64 embutido)
function extrairEvidenciasImagens(baseUrl) {
  const evidencias = [];

  // 1. Procura na pasta compilada do Allure Report (allure-report/data/attachments)
  if (fs.existsSync(ALLURE_ATTACHMENTS_REPORT)) {
    const arquivos = fs.readdirSync(ALLURE_ATTACHMENTS_REPORT);

    arquivos.forEach((arq) => {
      const caminhoCompleto = path.join(ALLURE_ATTACHMENTS_REPORT, arq);

      if (arq.endsWith(".png") || arq.endsWith(".jpg") || arq.endsWith(".jpeg")) {
        evidencias.push({ type: "url", val: `${baseUrl}/data/attachments/${arq}` });
      } else if (arq.endsWith(".html")) {
        try {
          const stats = fs.statSync(caminhoCompleto);
          if (stats.size > 100000) {
            const htmlContent = fs.readFileSync(caminhoCompleto, "utf-8");
            const match = htmlContent.match(/src=["'](data:image\/[a-zA-Z]+;base64,[^"']+)["']/);
            if (match && match[1]) {
              evidencias.push({ type: "base64", val: match[1] });
            }
          }
        } catch (e) {}
      }
    });
  }

  // 2. Fallback: Procura na pasta allure-results caso não tenha encontrado em allure-report
  if (evidencias.length === 0 && fs.existsSync(ALLURE_DIR)) {
    const arquivosResults = fs.readdirSync(ALLURE_DIR);
    arquivosResults.forEach((arq) => {
      const caminho = path.join(ALLURE_DIR, arq);
      if (arq.endsWith(".png") || arq.endsWith(".jpg")) {
        evidencias.push({ type: "url", val: `${baseUrl}/data/attachments/${arq}` });
      } else if (arq.endsWith(".html") || arq.endsWith(".txt")) {
        try {
          const stats = fs.statSync(caminho);
          if (stats.size > 100000) {
            const content = fs.readFileSync(caminho, "utf-8");
            const match = content.match(/src=["'](data:image\/[a-zA-Z]+;base64,[^"']+)["']/);
            if (match && match[1]) {
              evidencias.push({ type: "base64", val: match[1] });
            }
          }
        } catch (e) {}
      }
    });
  }

  return evidencias;
}

// 🟢 Coleta todas as suítes no XML recursivamente
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

  const listaEvidencias = extrairEvidenciasImagens(baseUrlR2);
  console.log(`📸 Evidências extraídas no Allure: ${listaEvidencias.length}`);

  const todasSuites = extrairSuitesRecursivo(robot.suite);
  console.log(`📦 Total de suítes encontradas no XML: ${todasSuites.length}`);

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

    // 🟢 Busca a marca no de-para ajustado
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

        let urlUnica = "";
        let base64Img = "";

        if (ponteiroEvidencia < listaEvidencias.length) {
          const itemEvidencia = listaEvidencias[ponteiroEvidencia];
          if (itemEvidencia.type === "url") {
            urlUnica = itemEvidencia.val;
          } else if (itemEvidencia.type === "base64") {
            base64Img = itemEvidencia.val;
          }
          ponteiroEvidencia++;
        }

        // 🟢 Replicar o mesmo print 3x para preencher Print 1, Print 2 e Print 3 sem quebrar a tabela
        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlUnica,
          url_print_tentativa2: urlUnica,
          url_print_tentativa3: urlUnica,
          imagem_base64: base64Img,
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
      console.log(`✅ [${marcaFormatada}] enviado — total:${total} passou:${passou} falhou:${falhou} falhasComEvidencia:${falhas.length} ->`, resposta);
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
    }
  }
}

main();
