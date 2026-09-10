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

// 🟢 Mapeia os arquivos de anexo e gera a URL exata do arquivo no Cloudflare R2
function extrairEvidenciasImagens(baseUrlR2) {
  const evidencias = [];

  if (fs.existsSync(ALLURE_ATTACHMENTS_REPORT)) {
    const arquivos = fs.readdirSync(ALLURE_ATTACHMENTS_REPORT);

    arquivos.forEach((arq) => {
      const caminhoCompleto = path.join(ALLURE_ATTACHMENTS_REPORT, arq);

      try {
        const stats = fs.statSync(caminhoCompleto);

        // Se for um anexo pesado (> 300KB) ou imagem, captura o nome exato do arquivo
        if (stats.size > 300000 || arq.endsWith(".png") || arq.endsWith(".jpg")) {
          // Monta o caminho exato: https://.../reports/mobile-run-1290/data/attachments/<NOME_DO_ARQUIVO>
          const urlAnexoDireto = `${baseUrlR2}/data/attachments/${arq}`;

          let base64Img = "";
          if (arq.endsWith(".html")) {
            const htmlContent = fs.readFileSync(caminhoCompleto, "utf-8");
            const match = htmlContent.match(/src=["'](data:image\/[a-zA-Z]+;base64,[^"']+)["']/);
            if (match && match[1]) {
              base64Img = match[1];
            }
          }

          evidencias.push({
            url: urlAnexoDireto,
            base64: base64Img,
          });
        }
      } catch (e) {
        console.error(`Erro ao ler anexo ${arq}:`, e.message);
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

  // URL base da run no R2
  const baseUrlR2 = `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}`;

  const listaEvidencias = extrairEvidenciasImagens(baseUrlR2);
  console.log(`📸 Evidências encontradas no Allure: ${listaEvidencias.length}`);

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

        let urlAnexo = "";
        let base64Img = "";

        if (ponteiroEvidencia < listaEvidencias.length) {
          urlAnexo = listaEvidencias[ponteiroEvidencia].url;
          base64Img = listaEvidencias[ponteiroEvidencia].base64;
          ponteiroEvidencia++;
        }

        // 🟢 Preenche explicitamente url_print_tentativa com o link direto do anexo
        // Exemplo: https://.../reports/mobile-run-1290/data/attachments/88660879a39cbdc4.html
        falhas.push({
          nome_teste: `${marcaFormatada} - ${nomeTeste}`,
          mensagem_erro: msgErro.replace(/\n/g, " ").replace(/\r/g, "").trim(),
          url_print_tentativa1: urlAnexo,
          url_print_tentativa2: urlAnexo,
          url_print_tentativa3: urlAnexo,
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
      url_mochawesome: `${baseUrlR2}/index.html`, // Link do relatório geral
      falhas: falhas,
    };

    try {
      const resposta = await enviarParaAppsScript(payload);
      console.log(`✅ [${marcaFormatada}] enviado ->`, resposta);
    } catch (err) {
      console.error(`❌ [${marcaFormatada}] falhou ao enviar:`, err.message);
    }
  }
}

main();

// antes de tudo , pq esse payload no enviar-resultados-appscript-mobile está com a variavel de mochawesome sendo q é allure , ajuste tbm o caminho pq está errado , um detalhe bem importante, todos os screenshorts geralmente tem mais de 1MB dentro do deploy do relatorio para cloudeflare r2, na pasta que vai o screenshots a maioria dos arquivos que não sao evidencias , tem bytes apenas o arquivo que são extraidos

// no relatorio allure : https://pub-8f8304dd624445aca80dcb98bc5a78d0.r2.dev/reports/mobile-run-1296/index.html#suites/348c6cc3c55a386f3b3eeb4407d668ce/4bad4c49abab1140/

// na parte da falha do teste em executions test body no AppiumLibrary.Capture Page Screenshot 1 attachment tem a keyword log dentro dele que tem disponivel para baixar diretamente a evidencia screenshot , ela vem como data_attachments_81069e1df01319fe

// cloudeflare r2 : allure-reports/reports/mobile-run-1296/data/attachments/
// exemplo de url: https://pub-8f8304dd624445aca80dcb98bc5a78d0.r2.dev/reports/mobile-run-1290/data/attachments/88660879a39cbdc4.html

//   const payload = {
//       run_id: `${RUN_ID}`,
//       marca: marcaFormatada,
//       plataforma: "mobile",
//       data_hora: new Date().toISOString(),
//       data_hora_formatada: dataHoraFormatada,
//       total_testes: total,
//       total_passou: passou,
//       total_falhou: falhou,
//       duracao_seg: 30,
//       branch: BRANCH,
//       url_mochawesome: `${R2_PUBLIC_URL}/reports/mobile-run-${RUN_NUMBER}/index.html`,
//       falhas: falhas,
//     };
