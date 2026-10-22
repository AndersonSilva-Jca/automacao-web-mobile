/**
 * Limpeza de relatórios no Cloudflare R2
 *
 * Uso:
 *   node deletar-relatorios.js --bucket=<allure|cypress|all> [--de=N] [--ate=N] [--dry-run] [--yes]
 *
 * Exemplos:
 *   node deletar-relatorios.js --bucket=all --dry-run          # só simula (mostra pastas, arquivos e GB)
 *   node deletar-relatorios.js --bucket=all                    # apaga a partir de 1801 (allure) e 1501 (cypress)
 *   node deletar-relatorios.js --bucket=cypress --de=1700      # apaga cypress da run 1700 em diante
 *   node deletar-relatorios.js --bucket=allure --de=1801 --ate=2100
 *   node deletar-relatorios.js --bucket=all --yes              # sem pedir confirmação (útil p/ automação)
 *
 * Sem --ate, apaga TUDO que for >= --de (não existe mais limite fixo).
 * 
 * # Allure: apaga da mobile-run-1801 até a mobile-run-1950 (a 1951 em diante fica)
node deletar-relatorios.js --bucket=allure --de=1801 --ate=1950

# Cypress: apaga da 1501 até a 1800
node deletar-relatorios.js --bucket=cypress --de=1501 --ate=1800

# Os dois buckets com o mesmo intervalo
node deletar-relatorios.js --bucket=all --de=1501 --ate=1800
 */
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const readline = require("readline");
require("dotenv").config();

// ---------- Configuração dos buckets ----------
const BUCKETS = {
  allure: {
    nome: "allure-reports",
    base: "reports/",
    regex: /^reports\/mobile-run-(\d+)\/$/,
    deDefault: 1801,
  },
  cypress: {
    nome: "cypress-reports",
    base: "reports/",
    regex: /^reports\/(\d+)\/$/,
    deDefault: 1501,
  },
};
const CONCORRENCIA = 10; // pastas apagadas em paralelo

// ---------- Credenciais ----------
const { CYPRESS_R2_ACCOUNT_ID, CYPRESS_R2_ACCESS_KEY_ID, CYPRESS_R2_SECRET_ACCESS_KEY } = process.env;
if (!CYPRESS_R2_ACCOUNT_ID || !CYPRESS_R2_ACCESS_KEY_ID || !CYPRESS_R2_SECRET_ACCESS_KEY) {
  console.error("❌ Variáveis CYPRESS_R2_* não encontradas no .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${CYPRESS_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: CYPRESS_R2_ACCESS_KEY_ID,
    secretAccessKey: CYPRESS_R2_SECRET_ACCESS_KEY,
  },
});

// ---------- Argumentos ----------
function lerArgs() {
  const args = { bucket: null, de: null, ate: null, dryRun: false, yes: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--yes") args.yes = true;
    else if (a.startsWith("--bucket=")) args.bucket = a.split("=")[1];
    else if (a.startsWith("--de=")) args.de = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--ate=")) args.ate = parseInt(a.split("=")[1], 10);
    else {
      console.error(`❌ Argumento desconhecido: ${a}`);
      process.exit(1);
    }
  }
  if (!["allure", "cypress", "all"].includes(args.bucket)) {
    console.error("❌ Use --bucket=allure, --bucket=cypress ou --bucket=all");
    process.exit(1);
  }
  return args;
}

// ---------- Helpers ----------
const fmtGB = (bytes) => (bytes / 1024 ** 3).toFixed(2) + " GB";

function confirmar(pergunta) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(pergunta, (r) => {
      rl.close();
      resolve(r.trim().toLowerCase() === "s");
    }),
  );
}

/** Lista as "pastas" reais (CommonPrefixes) e filtra pelo número da run */
async function listarPastas(cfg, de, ate) {
  const pastas = [];
  let token;
  do {
    const r = await s3.send(
      new ListObjectsV2Command({
        Bucket: cfg.nome,
        Prefix: cfg.base,
        Delimiter: "/",
        ContinuationToken: token,
      }),
    );
    for (const p of r.CommonPrefixes || []) {
      const m = p.Prefix.match(cfg.regex);
      if (!m) continue; // ignora qualquer pasta fora do padrão
      const num = parseInt(m[1], 10);
      if (num >= de && (ate == null || num <= ate)) pastas.push({ prefixo: p.Prefix, num });
    }
    token = r.NextContinuationToken;
  } while (token);
  return pastas.sort((a, b) => a.num - b.num);
}

/** Apaga (ou só conta, se dryRun) tudo dentro de um prefixo */
async function processarPasta(cfg, prefixo, dryRun) {
  let token;
  let arquivos = 0;
  let bytes = 0;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: cfg.nome, Prefix: prefixo, ContinuationToken: token }));
    token = r.NextContinuationToken;
    const itens = r.Contents || [];
    if (itens.length === 0) break;

    if (!dryRun) {
      const del = await s3.send(
        new DeleteObjectsCommand({
          Bucket: cfg.nome,
          Delete: { Objects: itens.map((o) => ({ Key: o.Key })), Quiet: true },
        }),
      );
      if (del.Errors && del.Errors.length) {
        throw new Error(`Falha ao apagar ${del.Errors.length} objetos em ${prefixo}: ${del.Errors[0].Message}`);
      }
    }
    arquivos += itens.length;
    bytes += itens.reduce((s, o) => s + (o.Size || 0), 0);
  } while (token);
  return { arquivos, bytes };
}

async function emLotes(itens, tamanho, fn) {
  for (let i = 0; i < itens.length; i += tamanho) {
    await Promise.all(itens.slice(i, i + tamanho).map(fn));
  }
}

// ---------- Execução por bucket ----------
async function limparBucket(chave, args) {
  const cfg = BUCKETS[chave];
  const de = args.de ?? cfg.deDefault;
  const ate = args.ate;

  console.log(`\n📦 [${cfg.nome}] buscando pastas de ${de} ${ate != null ? `até ${ate}` : "em diante"}...`);
  const pastas = await listarPastas(cfg, de, ate);

  if (pastas.length === 0) {
    console.log("  ✔ Nenhuma pasta encontrada nesse intervalo.");
    return;
  }
  console.log(`  Encontradas ${pastas.length} pastas (de #${pastas[0].num} a #${pastas[pastas.length - 1].num}).`);

  if (!args.dryRun && !args.yes) {
    const ok = await confirmar(`  ⚠️  Apagar DEFINITIVAMENTE essas ${pastas.length} pastas de ${cfg.nome}? (s/N) `);
    if (!ok) {
      console.log("  ⏭️  Pulado.");
      return;
    }
  }

  let feitas = 0;
  let totalArquivos = 0;
  let totalBytes = 0;
  const erros = [];

  await emLotes(pastas, CONCORRENCIA, async ({ prefixo }) => {
    try {
      const { arquivos, bytes } = await processarPasta(cfg, prefixo, args.dryRun);
      totalArquivos += arquivos;
      totalBytes += bytes;
    } catch (e) {
      erros.push(`${prefixo}: ${e.message}`);
    }
    feitas++;
    if (feitas % 50 === 0 || feitas === pastas.length) {
      console.log(`  ⏳ ${feitas}/${pastas.length} pastas processadas...`);
    }
  });

  const verbo = args.dryRun ? "seriam apagados" : "apagados";
  console.log(`  ✅ ${totalArquivos} arquivos ${verbo} (${fmtGB(totalBytes)} liberados).`);
  if (erros.length) {
    console.log(`  ❌ ${erros.length} pastas com erro (rode de novo para tentar apenas o que sobrou):`);
    erros.slice(0, 10).forEach((e) => console.log(`     - ${e}`));
  }
}

async function main() {
  const args = lerArgs();
  console.log(args.dryRun ? "🔍 MODO SIMULAÇÃO (nada será apagado)" : "🗑️  MODO EXCLUSÃO REAL");

  const chaves = args.bucket === "all" ? ["allure", "cypress"] : [args.bucket];
  for (const c of chaves) await limparBucket(c, args);

  console.log("\n🎉 Finalizado.");
}

main().catch((e) => {
  console.error("❌ Erro inesperado:", e);
  process.exit(1);
});
