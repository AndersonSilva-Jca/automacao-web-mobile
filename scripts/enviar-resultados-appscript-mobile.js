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
const ALLURE_RESULTS_DIR = process.env.ALLURE_DIR || "allure-results";

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

function normalizarNomeTeste(nome) {
  return String(nome || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function extrairLabelsSuite_(resultado) {
  const labels = resultado.labels || [];
  return labels
    .filter((l) => ["suite", "parentSuite", "subSuite"].includes(l.name))
    .map((l) => normalizarNomeTeste(l.value))
    .join(" ");
}

function extrairEvidenciaDoAnexo_(anexo) {
  if (!anexo || !anexo.source) return null;

  // Busca na pasta bruta de resultados (onde o nome anexo.source realmente existe)
  let caminhoLocal = path.join(ALLURE_RESULTS_DIR, anexo.source);
  if (!fs.existsSync(caminhoLocal)) {
    const alternativo = path.join(ALLURE_ATTACHMENTS_REPORT, anexo.source);
    if (fs.existsSync(alternativo)) {
      caminhoLocal = alternativo;
    } else {
      return null;
    }
  }

  const tipo = String(anexo.type || "").toLowerCase();
  const nomeArquivo = String(anexo.source || "").toLowerCase();

  try {
    // Caso 1: Imagem pura (.png / .jpg)
    if (tipo.startsWith("image/") || /\.(png|jpe?g)$/.test(nomeArquivo)) {
      const buffer = fs.readFileSync(caminhoLocal);
      return { base64: `data:image/png;base64,${buffer.toString("base64")}` };
    }

    // Caso 2: Padrão do Robot Framework (Print embutido em Base64 dentro de HTML/Text)
    if (tipo.startsWith("text/html") || tipo.startsWith("text/plain") || /\.(html|txt)$/.test(nomeArquivo)) {
      const conteudo = fs.readFileSync(caminhoLocal, "utf-8");
      const match = conteudo.match(/data:image\/[a-zA-Z]+;base64,[^"'\s)]+/);
      if (match) {
        return { base64: match[0] };
      }
    }
  } catch (e) {
    console.error(`Erro ao ler anexo "${anexo.source}":`, e.message);
  }

  return null;
}

function carregarResultadosAllurePorTeste() {
  const mapa = new Map();

  if (!fs.existsSync(ALLURE_RESULTS_DIR)) return mapa;

  const arquivos = fs.readdirSync(ALLURE_RESULTS_DIR).filter((a) => a.endsWith("-result.json"));

  arquivos.forEach((arq) => {
    try {
      const conteudo = JSON.parse(fs.readFileSync(path.join(ALLURE_RESULTS_DIR, arq), "utf-8"));
      const nome = normalizarNomeTeste(conteudo.name || conteudo.fullName);
      if (!nome) return;
      if (!mapa.has(nome)) mapa.set(nome, []);
      mapa.get(nome).push(conteudo);
    } catch (e) {
      console.error(`Erro ao ler resultado Allure ${arq}:`, e.message);
    }
  });

  return mapa;
}

function obterEvidenciaDoProprioTeste(mapaResultados, nomeTeste, marcaFormatada, baseUrlR2, contadorPorNome) {
  const chave = normalizarNomeTeste(nomeTeste);
  const candidatos = mapaResultados.get(chave) || [];
  if (!candidatos.length) return { urlR2: "", base64: "" };

  const candidatosDaMarca = candidatos.filter((c) => {
    const labels = extrairLabelsSuite_(c);
    let marcaDesteAllure = "";
    for (const key in MAPA_MARCAS_MOBILE) {
      if (labels.includes(key)) {
        marcaDesteAllure = MAPA_MARCAS_MOBILE[key];
        break;
      }
    }
    return marcaDesteAllure === marcaFormatada;
  });

  let listaOrdenada = candidatosDaMarca.length > 0 ? candidatosDaMarca : candidatos;

  const chaveContador = `${marcaFormatada}_${chave}`;
  const indice = contadorPorNome.get(chaveContador) || 0;
  contadorPorNome.set(chaveContador, indice + 1);

  const resultado = listaOrdenada[Math.min(indice, listaOrdenada.length - 1)];

  const anexos = [];
  const coletarAnexos = (obj) => {
    if (!obj) return;
    if (Array.isArray(obj.attachments)) anexos.push(...obj.attachments);
    if (Array.isArray(obj.steps)) obj.steps.forEach(coletarAnexos);
  };
  coletarAnexos(resultado);

  for (const anexo of anexos) {
    const evidencia = extrairEvidenciaDoAnexo_(anexo);
    if (evidencia) {
      return {
        urlR2: `${baseUrlR2}/index.html`,
        base64: evidencia.base64,
      };
    }
  }

  return { urlR2: "", base64: "" };
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

  const mapaResultadosAllure = carregarResultadosAllurePorTeste();
  const contadorPorNome = new Map();

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

    for (const key in MAPA_MARCAS_MOBILE) {
      if (contextoMarca.includes(key)) {
        marcaFormatada = MAPA_MARCAS_MOBILE[key];
        break;
      }
    }

    if (!marcaFormatada) {
      marcaFormatada = "(APP) Marca não identificada";
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

        const { urlR2: urlAnexoR2, base64: imagemBase64 } = obterEvidenciaDoProprioTeste(mapaResultadosAllure, nomeTeste, marcaFormatada, baseUrlR2, contadorPorNome);

        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlAnexoR2,
          url_print_tentativa2: "",
          url_print_tentativa3: "",
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
