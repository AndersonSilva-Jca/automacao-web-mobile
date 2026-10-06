const fs = require("fs");
const path = require("path");
const https = require("https");

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || `local_${Date.now()}`;
const RUN_NUMBER = process.env.GITHUB_RUN_NUMBER || "0";
const BRANCH = process.env.GITHUB_REF_NAME || "main";
const CYPRESS_R2_PUBLIC_URL = process.env.CYPRESS_R2_PUBLIC_URL;
const REPORTS_DIR = process.env.REPORTS_DIR || "cypress/reports";
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, "screenshots");

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
  let caminhoJson = path.join(dir, "mochawesome.json");

  if (!fs.existsSync(caminhoJson)) {
    caminhoJson = path.join(dir, "index.json");
  }

  if (!fs.existsSync(caminhoJson)) return null;

  try {
    const conteudo = JSON.parse(fs.readFileSync(caminhoJson, "utf-8"));
    if (Array.isArray(conteudo.results)) return conteudo;
  } catch (e) {
    console.error(`❌ Erro ao ler/parsear ${caminhoJson}:`, e.message);
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

function buscarUrlVideoFalha(nomeSpecArquivo) {
  if (!CYPRESS_R2_PUBLIC_URL || !RUN_NUMBER) return "";
  return `${CYPRESS_R2_PUBLIC_URL}/reports/${RUN_NUMBER}/01_e2e/videos/${encodeURIComponent(nomeSpecArquivo + ".cy.js.mp4")}`;
}

function requisitar(urlStr, metodo, dados, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error("Redirecionamentos demais"));
    const url = new URL(urlStr);
    const headers = {};
    if (dados) {
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = Buffer.byteLength(dados);
    }
    const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: metodo, headers }, (res) => {
      let corpo = "";
      res.on("data", (c) => (corpo += c));
      res.on("end", () => {
        // Apps Script responde o POST com 302 -> o resultado real vem seguindo com GET
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          return resolve(requisitar(res.headers.location, "GET", null, redirects + 1));
        }
        resolve({ status: res.statusCode, corpo });
      });
    });
    req.setTimeout(60000, () => req.destroy(new Error("Timeout")));
    req.on("error", reject);
    if (dados) req.write(dados);
    req.end();
  });
}

// Só considera sucesso se o Apps Script devolver JSON {status:"ok"}.
async function enviarParaAppsScript(payload) {
  const { status, corpo } = await requisitar(APPS_SCRIPT_URL, "POST", JSON.stringify(payload));
  let json;
  try {
    json = JSON.parse(corpo);
  } catch (e) {
    throw new Error(`Resposta inválida (HTTP ${status}) - URL do Apps Script provavelmente errada/desatualizada: ${corpo.slice(0, 120).replace(/\s+/g, " ")}`);
  }
  if (status !== 200 || json.status !== "ok") throw new Error(`Apps Script recusou (HTTP ${status}): ${corpo.slice(0, 200)}`);
  return corpo;
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
      const [u1, u2] = buscarUrlsPrintFalha(nomeSpecArquivo, nomeCompleto); // Só precisamos dos dois primeiros prints
      const urlVideo = buscarUrlVideoFalha(nomeSpecArquivo);

      falhas.push({
        nome_teste: `${marcaFinal} - ${tituloTeste}`,
        mensagem_erro: t.err && t.err.message ? t.err.message : "Erro não especificado",
        url_print_tentativa1: u1,
        url_print_tentativa2: u2,
        // Substituímos a terceira tentativa de print pelo vídeo
        url_print_tentativa3: urlVideo,
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

let erros = 0;

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

  console.log(`📦 Processando ${relatorio.results.length} spec(s)...`);

  for (const specResult of relatorio.results) {
    const caminhoSpec = specResult.file || specResult.fullFile || "";
    const nomeSpecArquivo = extrairNomeSpec(caminhoSpec);

    let todosOsTestes = [];
    (specResult.suites || []).forEach((suite) => {
      todosOsTestes = todosOsTestes.concat(extrairTestesDaSuite(suite, nomeSpecArquivo));
    });

    // Lógica para capturar a data original da Run retroativa ou a data atual se for execução normal
    const dataBase = process.env.RETRO_DATA ? new Date(process.env.RETRO_DATA) : new Date();

    const dataHoraFormatada = dataBase.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    for (const item of todosOsTestes) {
      // Se o teste passou, envia a contagem para o Dashboard, mas deixa a URL vazia
      // para não apontar para relatórios que não foram salvos na Cloudflare R2
      const urlMochawesomeFinal = item.falhou > 0 ? urlRelatorio : "";

      const payload = {
        run_id: `${RUN_ID}`,
        marca: item.marca,
        plataforma: "web",
        data_hora: dataBase.toISOString(),
        data_hora_formatada: dataHoraFormatada,
        total_testes: item.total,
        total_passou: item.passou,
        total_falhou: item.falhou,
        duracao_seg: item.duracaoSeg,
        branch: BRANCH,
        url_allure: "",
        url_mochawesome: urlMochawesomeFinal,
        falhas: item.falhas,
      };

      try {
        const resposta = await enviarParaAppsScript(payload);
        if (item.falhou > 0) {
          console.log(`⚠️ [FALHA REGISTRADA] [${item.marca}] enviado — falhou:${item.falhou} ->`, resposta);
        } else {
          console.log(`✅ [SUCESSO REGISTRADO] [${item.marca}] enviado — passou:${item.passou} ->`, resposta);
        }
      } catch (err) {
        erros++;
        console.error(`❌ [${item.marca}] falhou ao enviar:`, err.message);
      }
    }
  }
}

main().then(() => {
  if (erros > 0) {
    console.error(`❌ ${erros} registro(s) NÃO foram gravados no Dashboard.`);
    process.exit(1);
  }
});
