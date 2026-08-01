/**
 * Captura o site rodando de verdade, num Chromium headless (Edge).
 *
 * Aba oculta zera o requestAnimationFrame — em headless a página se considera
 * VISÍVEL, então GSAP anda e dá pra ver o scrub de verdade.
 * Adaptado do tmp-shoot.mjs do terral.
 *
 * Uso: node scripts/shoot.mjs [url] [outDir] [--reduced]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const args = process.argv.slice(2).filter((a) => a !== "--reduced");
const REDUCED = process.argv.includes("--reduced");
const URL = args[0] ?? "http://localhost:3010";
const OUT = args[1] ?? "./tmp-shots";

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

await mkdir(OUT, { recursive: true });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
if (REDUCED) {
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
}

const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text());
});

await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

const shot = async (name) => {
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log("  " + name);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// --- loader e hero ---
console.log("abertura:");
await wait(900);
await shot("00-loader");
await wait(2200);
await shot("01-gate");
await wait(1500);
await shot("02-hero");

const state = await page.evaluate(() => ({
  vis: document.visibilityState,
  docH: document.body.scrollHeight,
  gate: document.querySelector("[data-gate]")?.dataset.gate,
  chapters: [...document.querySelectorAll(".chapter")].map((c) => ({
    key: c.dataset.chapter,
    top: Math.round(c.getBoundingClientRect().top + scrollY),
  })),
  falasTop: (() => {
    const f = document.getElementById("falas");
    return f ? Math.round(f.getBoundingClientRect().top + scrollY) : null;
  })(),
}));
console.log(JSON.stringify(state, null, 1));

// --- percurso ---
console.log("percurso:");
const marks = [
  ["03-hero-scrub", 1600],
  ["04-hero-fim", 3300],
  ["05-manifesto", state.chapters[0] ? state.chapters[0].top - 900 : 4600],
  ...state.chapters.flatMap((c, i) => [
    [`06-${i + 1}-${c.key}-abertura`, c.top + 900],
    [`06-${i + 1}-${c.key}-corredor`, c.top + 3600],
    [`06-${i + 1}-${c.key}-manchete`, c.top + 4600],
    [`06-${i + 1}-${c.key}-midia`, c.top + 7400],
  ]),
];
if (state.falasTop) marks.push(["07-falas", state.falasTop + 400]);

for (const [name, y] of marks) {
  await page.evaluate((to) => window.scrollTo(0, to), y);
  await wait(1400);
  await shot(name);
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1200));
await wait(1400);
await shot("98-rodape-alto");
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await wait(1600);
await shot("99-rodape");

await writeFile(join(OUT, "errors.txt"), errors.join("\n") || "sem erros");
console.log(errors.length ? "\nERROS:\n" + errors.slice(0, 15).join("\n") : "\nsem erros de console");

await browser.close();
