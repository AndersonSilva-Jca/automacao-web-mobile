/**
 *  # Allure: 
 * node deletar-relatorios.js --bucket=allure --de=2000 --ate=2549

* # Cypress: 
* node deletar-relatorios.js --bucket=cypress --de=2000 --ate=2430

 * Backup (download) dos relatórios do Cloudflare R2 para o PC / microSD
 *
 * Uso:
 *   node baixar-relatorios.js --bucket=<allure|cypress|all> --destino=<pasta> [--de=N] [--ate=N] [--dry-run]
 *
 * Exemplos:
 *   node baixar-relatorios.js --bucket=all --destino=E:\historico-r2 --dry-run   # só calcula o tamanho
 *   node baixar-relatorios.js --bucket=all --destino=E:\historico-r2             # baixa tudo
 *   node baixar-relatorios.js --bucket=cypress --destino=D:\backup --de=1501 --ate=1800
 *
 * - Pode ser interrompido e rodado de novo: arquivos já baixados (mesmo tamanho) são pulados.
 * - Mantém a mesma estrutura do bucket: <destino>/<bucket>/reports/<run>/...
 * - NÃO apaga nada no R2.
 * node baixar-relatorios.js --bucket=cypress --destino=D:\06-ate-20-Out-2026-r2 --de=2256 --ate=2430
 * node baixar-relatorios.js --bucket=allure --destino=D:\03-ate-20-Out-2026-r2 --de=2209 --ate=2549

/
Isso aconteceu porque você rodou no Git Bash, onde a barra invertida (\) é caractere de escape. O Bash comeu a barra e o script recebeu C:historico-r2, como aparece na linha “BACKUP para” do seu print. No Windows, isso é um caminho relativo ao diretório atual no drive C:, então a pasta foi criada dentro do projeto, em /c/automacao-web-mobile/historico-r2.

1) Apague a pasta criada na raiz do projeto

bash
cd /c/automacao-web-mobile
ls historico-r2              # confira: deve ter só cypress-reports/
rm -rf historico-r2
git status                   # confirme que nada novo ficou para commit

2) Rode de novo com o caminho correto

Use uma destas formas no Git Bash:

bash
# com barras normais (a mais simples)
node baixar-relatorios.js --bucket=cypress --destino=C:/historico-r2 --de=2007 --ate=2020

# ou com aspas simples, mantendo a barra invertida
node baixar-relatorios.js --bucket=cypress --destino='C:\historico-r2' --de=2007 --ate=2020

Confira na linha “BACKUP para:” que apareceu C:/historico-r2 ou C:\historico-r2, e não C:historico-r2. Se você usar PowerShell ou CMD, C:\historico-r2 funciona normalmente.

Dicas

Essa foi só uma amostra pequena: 10 pastas, 175 arquivos e 0,10 GB. Quando for o backup grande, rode antes o --dry-run para ver o total.
Se o git status mostrou a pasta como “untracked”, ainda não foi commitada. Não use git add . antes de apagar.
O aviso NODE_TLS_REJECT_UNAUTHORIZED=0 no seu terminal indica que a verificação de certificado HTTPS está desligada, provavelmente por uma variável no .env ou no ambiente. Funciona, mas o script usa suas credenciais do R2 nessa conexão. Se puder, remova essa variável.
 */
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
require("dotenv").config();

const BUCKETS = {
  allure: { nome: "allure-reports", base: "reports/", regex: /^reports\/mobile-run-(\d+)\/$/ },
  cypress: { nome: "cypress-reports", base: "reports/", regex: /^reports\/(\d+)\/$/ },
};
const CONCORRENCIA = 8; // arquivos baixados em paralelo

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

function lerArgs() {
  const args = { bucket: null, destino: null, de: 0, ate: null, dryRun: false };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") args.dryRun = true;
    else if (a.startsWith("--bucket=")) args.bucket = a.split("=")[1];
    else if (a.startsWith("--destino=")) args.destino = a.slice("--destino=".length);
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
  if (!args.destino && !args.dryRun) {
    console.error("❌ Informe --destino=<pasta> (ex: --destino=E:\\historico-r2)");
    process.exit(1);
  }
  return args;
}

const fmtGB = (b) => (b / 1024 ** 3).toFixed(2) + " GB";

async function listarPastas(cfg, de, ate) {
  const pastas = [];
  let token;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: cfg.nome, Prefix: cfg.base, Delimiter: "/", ContinuationToken: token }));
    for (const p of r.CommonPrefixes || []) {
      const m = p.Prefix.match(cfg.regex);
      if (!m) continue;
      const num = parseInt(m[1], 10);
      if (num >= de && (ate == null || num <= ate)) pastas.push({ prefixo: p.Prefix, num });
    }
    token = r.NextContinuationToken;
  } while (token);
  return pastas.sort((a, b) => a.num - b.num);
}

async function listarObjetos(cfg, prefixo) {
  const objetos = [];
  let token;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: cfg.nome, Prefix: prefixo, ContinuationToken: token }));
    for (const o of r.Contents || []) {
      if (!o.Key.endsWith("/")) objetos.push({ key: o.Key, size: o.Size || 0 });
    }
    token = r.NextContinuationToken;
  } while (token);
  return objetos;
}

async function baixarObjeto(cfg, obj, raiz) {
  // troca caracteres inválidos no Windows/FAT/exFAT
  const rel = obj.key
    .split("/")
    .map((s) => s.replace(/[<>:"|?*]/g, "_"))
    .join(path.sep);
  const destino = path.join(raiz, cfg.nome, rel);

  if (fs.existsSync(destino) && fs.statSync(destino).size === obj.size) return "pulado";

  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const tmp = destino + ".part";
  const r = await s3.send(new GetObjectCommand({ Bucket: cfg.nome, Key: obj.key }));
  await pipeline(r.Body, fs.createWriteStream(tmp));
  fs.renameSync(tmp, destino);
  return "baixado";
}

async function processarBucket(chave, args) {
  const cfg = BUCKETS[chave];
  console.log(`\n📦 [${cfg.nome}] listando pastas...`);
  const pastas = await listarPastas(cfg, args.de, args.ate);
  if (pastas.length === 0) {
    console.log("  ✔ Nenhuma pasta encontrada nesse intervalo.");
    return { arquivos: 0, bytes: 0, erros: 0 };
  }
  console.log(`  ${pastas.length} pastas (#${pastas[0].num} a #${pastas[pastas.length - 1].num}).`);

  let arquivos = 0,
    bytes = 0,
    baixados = 0,
    pulados = 0;
  const erros = [];
  let feitas = 0;

  for (const { prefixo } of pastas) {
    const objetos = await listarObjetos(cfg, prefixo);

    if (args.dryRun) {
      arquivos += objetos.length;
      bytes += objetos.reduce((s, o) => s + o.size, 0);
    } else {
      for (let i = 0; i < objetos.length; i += CONCORRENCIA) {
        await Promise.all(
          objetos.slice(i, i + CONCORRENCIA).map(async (o) => {
            try {
              const res = await baixarObjeto(cfg, o, args.destino);
              res === "baixado" ? baixados++ : pulados++;
              arquivos++;
              bytes += o.size;
            } catch (e) {
              erros.push(`${o.key}: ${e.message}`);
            }
          }),
        );
      }
    }
    feitas++;
    if (feitas % 25 === 0 || feitas === pastas.length) {
      console.log(`  ⏳ ${feitas}/${pastas.length} pastas | ${arquivos} arquivos | ${fmtGB(bytes)}`);
    }
  }

  if (args.dryRun) {
    console.log(`  🔍 ${arquivos} arquivos, ${fmtGB(bytes)} seriam baixados.`);
  } else {
    console.log(`  ✅ ${baixados} baixados, ${pulados} já existiam (${fmtGB(bytes)} no total).`);
  }
  if (erros.length) {
    console.log(`  ❌ ${erros.length} erros (rode de novo para repetir só o que faltou):`);
    erros.slice(0, 10).forEach((e) => console.log(`     - ${e}`));
  }
  return { arquivos, bytes, erros: erros.length };
}

async function main() {
  const args = lerArgs();
  console.log(args.dryRun ? "🔍 SIMULAÇÃO (nada será baixado)" : `💾 BACKUP para: ${args.destino}`);

  const chaves = args.bucket === "all" ? ["allure", "cypress"] : [args.bucket];
  let totalBytes = 0,
    totalErros = 0;
  for (const c of chaves) {
    const r = await processarBucket(c, args);
    totalBytes += r.bytes;
    totalErros += r.erros;
  }
  console.log(`\n🎉 Finalizado. Total: ${fmtGB(totalBytes)}.`);
  if (totalErros > 0) {
    console.log("⚠️  Houve erros: NÃO apague nada do R2 até rodar de novo e zerar os erros.");
    process.exit(2);
  }
}

main().catch((e) => {
  console.error("❌ Erro inesperado:", e);
  process.exit(1);
});
