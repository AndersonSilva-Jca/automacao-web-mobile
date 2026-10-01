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
  console.log("🚀 Iniciando exclusão no Cloudflare R2 usando credenciais do .env...\n");

  // 1️⃣ BUCKET: allure-reports (mobile-run-1 a mobile-run-1800)
  console.log("📦 [Bucket: allure-reports] Apagando pastas de mobile-run-1 a 1800...");
  const pastasMobile = [];
  for (let i = 1; i <= 1800; i++) {
    pastasMobile.push(`reports/mobile-run-${i}/`);
  }

  let progressoMobile = 0;
  await processarEmLote(pastasMobile, 20, async (prefixo) => {
    const qtd = await deletarPasta("allure-reports", prefixo);
    progressoMobile++;
    if (qtd > 0) {
      console.log(`  └─ [OK] ${prefixo} (${qtd} arquivos deletados)`);
    }
    if (progressoMobile % 200 === 0) {
      console.log(`  ⏳ Progresso Allure: ${progressoMobile}/1800 pastas verificadas...`);
    }
  });
  console.log("✅ Concluída a exclusão no allure-reports!\n");

  // 2️⃣ BUCKET: cypress-reports (1 a 1500)
  console.log("📦 [Bucket: cypress-reports] Apagando pastas de 1 a 1500...");
  const pastasCypress = [];
  for (let i = 1; i <= 1500; i++) {
    pastasCypress.push(`reports/${i}/`);
  }

  let progressoCypress = 0;
  await processarEmLote(pastasCypress, 20, async (prefixo) => {
    const qtd = await deletarPasta("cypress-reports", prefixo);
    progressoCypress++;
    if (qtd > 0) {
      console.log(`  └─ [OK] ${prefixo} (${qtd} arquivos deletados)`);
    }
    if (progressoCypress % 200 === 0) {
      console.log(`  ⏳ Progresso Cypress: ${progressoCypress}/1500 pastas verificadas...`);
    }
  });
  console.log("✅ Concluída a exclusão no cypress-reports!\n");

  console.log("🎉 Limpeza concluída com sucesso!");
}

main().catch(console.error);
