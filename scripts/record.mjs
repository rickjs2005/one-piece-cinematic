/**
 * Grava o site como vídeo num screencast CDP contínuo: o loader fica em
 * tempo real e a jornada é dirigida por um scroll suave em tempo real cujo
 * trecho é RE-TEMPORIZADO na lista do ffmpeg pra cravar a duração-alvo.
 *
 * Por que não screenshot frame a frame: no SwiftShader cada captura custa
 * ~2s e uma jornada de 90s@12fps levaria ~35min (morreu no teto de 10min do
 * runner — visto na prática). O screencast entrega os frames que o browser
 * já renderizou, com timestamp, quase de graça.
 *
 * Uso: node scripts/record.mjs <realSec> <targetSec> <outDir>
 *   realSec   quanto tempo real o scroll leva (mais tempo = mais frames)
 *   targetSec duração final do trecho de jornada no vídeo
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const URL = "http://localhost:3010";
const REAL = Number(process.argv[2] ?? 120);
const TARGET = Number(process.argv[3] ?? 55);
const OUT = process.argv[4] ?? "./tmp-rec";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: [
    "--enable-unsafe-swiftshader",
    "--use-angle=swiftshader",
    "--use-gl=angle",
    "--hide-scrollbars",
    "--no-first-run",
    "--mute-audio",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(join(OUT, "frames"), { recursive: true });

/* ---- screencast contínuo: escreve cada frame direto no disco ------------ */
const client = await page.createCDPSession();
const meta = []; // { i, ts }
let n = 0;
const pending = [];
client.on("Page.screencastFrame", (ev) => {
  const i = n++;
  meta.push({ i, ts: ev.metadata.timestamp });
  pending.push(
    writeFile(
      join(OUT, "frames", `${String(i).padStart(5, "0")}.jpg`),
      Buffer.from(ev.data, "base64"),
    ),
  );
  client
    .send("Page.screencastFrameAck", { sessionId: ev.sessionId })
    .catch(() => {});
});

await client.send("Page.startScreencast", {
  format: "jpeg",
  quality: 85,
  everyNthFrame: 1,
});

await page.goto(URL, { waitUntil: "domcontentloaded" });
// loader (3.3s) + saída + hero assentando — tudo em tempo real
await wait(6400);

// marca onde o tempo real termina e o trecho re-temporizado começa
const boundary = Date.now() / 1000;
const boundaryIdx = n;

// o scroll anda em TEMPO REAL dentro da página (rAF + performance.now):
// não depende do ritmo do runner nem do custo de captura
const docH = await page.evaluate(
  () => document.body.scrollHeight - innerHeight,
);
await page.evaluate(
  (ms, target) =>
    new Promise((done) => {
      const t0 = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / ms);
        // linear de propósito: o scrub (1s) já suaviza as pontas, e ritmo
        // constante dá o mesmo tempo por pixel a cada capítulo
        window.scrollTo(0, Math.round(t * target));
        if (t >= 1) return done(undefined);
        requestAnimationFrame(tick);
      };
      tick();
    }),
  REAL * 1000,
  docH,
);
await wait(1500); // o scrub alcança o rodapé
await client.send("Page.stopScreencast");
await Promise.all(pending);
await browser.close();

/* ---- lista do ffmpeg com dois relógios ---------------------------------- */
if (meta.length < 10) {
  console.error(`só ${meta.length} frames — algo falhou`);
  process.exit(1);
}
const journey = meta.filter((f) => f.ts >= boundary);
const realSpan = journey.length
  ? journey[journey.length - 1].ts - journey[0].ts
  : 1;
const scale = TARGET / realSpan;

let list = "";
for (let k = 0; k < meta.length; k++) {
  const cur = meta[k];
  const next = meta[k + 1];
  const rawDur = next ? next.ts - cur.ts : 0.8;
  const dur = cur.ts >= boundary ? rawDur * scale : rawDur;
  list += `file '${String(cur.i).padStart(5, "0")}.jpg'\nduration ${Math.max(0.01, dur).toFixed(5)}\n`;
}
list += `file '${String(meta[meta.length - 1].i).padStart(5, "0")}.jpg'\n`;
await writeFile(join(OUT, "frames", "list.txt"), list);

console.log(
  `frames: ${meta.length} (loader real: ${boundaryIdx}, jornada: ${journey.length} | ${realSpan.toFixed(1)}s reais -> ${TARGET}s, escala ${scale.toFixed(3)})`,
);
