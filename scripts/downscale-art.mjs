/**
 * Reduz as artes para o tamanho em que elas realmente aparecem na tela.
 *
 * Os arquivos vinham do Higgsfield em 2K (até 3168px de largura), mas nenhum
 * deles é exibido acima de ~1600px, e os retratos não passam de ~560px. Com
 * 33 imagens nesse tamanho a página travava o renderizador do Chrome.
 *
 * Os limites abaixo são o dobro da maior exibição de cada tipo — folga para
 * telas 2x sem carregar quatro vezes mais pixel do que dá para ver.
 *
 * Uso: node scripts/downscale-art.mjs
 */
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const DIR = "public/art";

/** Largura máxima por tipo de arte, casada com o uso no layout. */
const MAX_WIDTH = [
  { match: /^(crew|voice)-/, width: 1100 }, // retratos em coluna estreita
  { match: /^moment-/, width: 1600 }, // painel de cena
  { match: /^(throne-room|eyes-dark|ocean|execution|flag)/, width: 2000 }, // full-bleed
];

const widthFor = (name) =>
  MAX_WIDTH.find((rule) => rule.match.test(name))?.width ?? 1600;

const files = (await readdir(DIR)).filter((f) => f.endsWith(".webp"));
let before = 0;
let after = 0;

for (const file of files) {
  const path = join(DIR, file);
  const original = (await stat(path)).size;
  before += original;

  const target = widthFor(file);
  // Lê para memória antes de processar: sharp lendo do disco mantém o arquivo
  // aberto, e no Windows isso impede a gravação no mesmo caminho (EPERM).
  const input = await readFile(path);
  const meta = await sharp(input).metadata();

  if (meta.width <= target) {
    after += original;
    console.log(`= ${file} (${meta.width}px, já cabe)`);
    continue;
  }

  const output = await sharp(input)
    .resize({ width: target, withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toBuffer();
  await writeFile(path, output);

  const size = (await stat(path)).size;
  after += size;
  console.log(
    `↓ ${file}  ${meta.width}px → ${target}px  ${(original / 1024).toFixed(0)}KB → ${(size / 1024).toFixed(0)}KB`,
  );
}

console.log(
  `\ntotal: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`,
);
