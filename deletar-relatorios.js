const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
require("dotenv").config(); // Carrega as variáveis do seu arquivo .env

// 🔑 Lendo as variáveis diretamente do seu .env
const ACCOUNT_ID = process.env.CYPRESS_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.CYPRESS_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.CYPRESS_R2_SECRET_ACCESS_KEY;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error("❌ ERRO: Variáveis de ambiente do R2 não foram encontradas no arquivo .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

/**
 * Função para apagar o conteúdo de uma pasta específica em um bucket
 */
async function deletarPasta(bucketName, prefixoPasta) {
  let continuationToken = undefined;
  let totalDeletados = 0;

  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefixoPasta,
      ContinuationToken: continuationToken,
    });

    const resposta = await s3.send(listCommand);
    continuationToken = resposta.NextContinuationToken;

    if (!resposta.Contents || resposta.Contents.length === 0) break;

    const objetosParaDeletar = resposta.Contents.map((obj) => ({ Key: obj.Key }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: { Objects: objetosParaDeletar },
    });

    await s3.send(deleteCommand);
    totalDeletados += objetosParaDeletar.length;
  } while (continuationToken);

  return totalDeletados;
}

/**
 * Processa as pastas em paralelo (lotes concorrentes) para acelerar a exclusão
 */
async function processarEmLote(itens, tamanhoLote, funcaoProcessamento) {
  for (let i = 0; i < itens.length; i += tamanhoLote) {
    const lote = itens.slice(i, i + tamanhoLote);
    await Promise.all(lote.map(funcaoProcessamento));
  }
}

async function main() {
  console.log("🚀 Retornando a exclusão no Cloudflare R2 (continuando de onde parou)...\n");

  // 1️⃣ BUCKET: allure-reports (Continua de mobile-run-1801 até 2100)
  console.log("📦 [Bucket: allure-reports] Apagando pastas de mobile-run-1801 a 2100...");
  const pastasMobile = [];
  for (let i = 1801; i <= 2100; i++) {
    pastasMobile.push(`reports/mobile-run-${i}/`);
  }

  let progressoMobile = 0;
  const totalMobile = pastasMobile.length;
  await processarEmLote(pastasMobile, 20, async (prefixo) => {
    const qtd = await deletarPasta("allure-reports", prefixo);
    progressoMobile++;
    if (qtd > 0) {
      console.log(`  └─ [OK] ${prefixo} (${qtd} arquivos deletados)`);
    }
    if (progressoMobile % 50 === 0 || progressoMobile === totalMobile) {
      console.log(`  ⏳ Progresso Allure: ${progressoMobile}/${totalMobile} pastas verificadas...`);
    }
  });
  console.log("✅ Concluída a exclusão restante no allure-reports!\n");

  // 2️⃣ BUCKET: cypress-reports (Continua de 1501 até 2000)
  console.log("📦 [Bucket: cypress-reports] Apagando pastas de 1501 a 2000...");
  const pastasCypress = [];
  for (let i = 1501; i <= 2000; i++) {
    pastasCypress.push(`reports/${i}/`);
  }

  let progressoCypress = 0;
  const totalCypress = pastasCypress.length;
  await processarEmLote(pastasCypress, 20, async (prefixo) => {
    const qtd = await deletarPasta("cypress-reports", prefixo);
    progressoCypress++;
    if (qtd > 0) {
      console.log(`  └─ [OK] ${prefixo} (${qtd} arquivos deletados)`);
    }
    if (progressoCypress % 50 === 0 || progressoCypress === totalCypress) {
      console.log(`  ⏳ Progresso Cypress: ${progressoCypress}/${totalCypress} pastas verificadas...`);
    }
  });
  console.log("✅ Concluída a exclusão restante no cypress-reports!\n");

  console.log("🎉 Limpeza total (até 2100/2000) concluída com sucesso!");
}

main().catch(console.error);
