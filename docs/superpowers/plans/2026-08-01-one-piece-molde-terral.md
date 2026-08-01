# One Piece no molde TERRAL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refazer `projetos/animes` (site One Piece) na estrutura completa do TERRAL: 5 capítulos horizontais fixados com vídeo, vitrine editorial das Falas, rodapé-jornal e página-recompensa `/laugh-tale`.

**Architecture:** Porta-se o design system e os componentes do terral (`C:\Users\rickj\projetos\terral`) para o animes — copiar arquivo, adaptar tokens/conteúdo — mantendo o `ThroneHero` atual como abertura. Conteúdo em `src/content/`, componentes sem texto. Mídia nova gerada no Higgsfield (imagens primeiro, vídeos por image-to-video depois).

**Tech Stack:** Next 16 (App Router) + TypeScript + Tailwind 4 + GSAP/ScrollTrigger + Lenis. Sem dependência nova. MCP Higgsfield para mídia (SÓ na sessão principal — subagentes não têm o MCP).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-01-one-piece-molde-terral-design.md`.
- Fonte da verdade do comportamento: os arquivos do terral em `C:\Users\rickj\projetos\terral`. Portar = copiar e adaptar, NUNCA reescrever de cabeça.
- Palco fixado é `position: sticky`… exceto no ChapterSection portado, que usa `pin: true` do ScrollTrigger como no terral (funciona lá; não converter).
- Nada dentro de uma faixa fixada tem ScrollTrigger próprio — tudo dirigido pela timeline do capítulo.
- `prefers-reduced-motion`: empilhado, poster no lugar de vídeo, sem pin (o código do terral já faz; não remover esses ramos).
- NADA de `feTurbulence` em tela cheia (travou o Chrome; ver `globals.css` atual). O `.grain-sheet` do terral usa `feTurbulence` mas num sheet raster-izado pequeno com `background-image` — MEDIR no navegador na Task 11; se travar, remover o grain-sheet e manter só a vinheta.
- Toda arte nova passa por `node scripts/downscale-art.mjs` antes do commit.
- Copy em PT-BR; nunca usar a palavra "ritual".
- Commits frequentes, mensagens em PT-BR no padrão do repo (`feat:`, `fix:`, `docs:`).
- Verificação de cada task: `npm run build` limpo. Verificação visual de scroll SÓ com screenshots do Playwright (nunca por code review) — Task 11.
- Créditos Higgsfield: ~102. Imagens primeiro; vídeos na ordem 01→05; se saldo < custo do próximo vídeo, parar e deixar o capítulo com poster (comportamento já suportado).

## Mapa de arquivos

| Ação | Arquivo | Origem/Nota |
|---|---|---|
| Reescrever | `src/app/globals.css` | base = terral `globals.css`, tokens/fonts/keys adaptados |
| Modificar | `src/app/layout.tsx` | + Fraunces (voice), SiteShell fica na page |
| Copiar | `src/lib/split.ts`, `src/lib/reveal.ts`, `src/lib/scroll.ts`, `src/lib/nav-color.ts` | terral `src/lib/` (scroll.ts: renomear eventos `terral:*` → `onepiece:*`) |
| Copiar | `src/components/svg-word.tsx`, `src/components/magnetics.tsx`, `src/components/hold-button.tsx`, `src/components/loader.tsx`, `src/components/site-shell.tsx` | terral `src/components/` |
| Criar | `src/content/chapters.ts` | dados dos 5 capítulos (Task 2) |
| Criar | `src/components/nav.tsx` | port do terral nav.tsx |
| Criar | `src/components/chapter.tsx` | port do terral chapter.tsx + cenas OP + painel extra |
| Criar | `src/components/intro.tsx` | port do terral intro.tsx |
| Criar | `src/components/falas.tsx` | port do terral coffees.tsx sobre `VOICES` |
| Criar | `src/components/site-footer.tsx` | port do terral site-footer.tsx |
| Criar | `src/app/laugh-tale/page.tsx` | port do terral casa-do-torrador |
| Modificar | `src/app/page.tsx` | montagem final |
| Modificar | `src/components/hero/ThroneHero.tsx` | dispara READY_EVENT |
| Deletar | `src/lib/smooth-scroll.tsx`, `src/components/ui/Preloader.tsx`, `src/components/sections/*` (Era, Crew*, FlagReveal, GrandLineMap*, Manifesto, Moments, Voices, Footer), `src/components/ui/{Marquee,Reveal,ParallaxBackdrop}.tsx` | substituídos (\*Crew e GrandLineMap: o MIOLO migra pro chapter antes de deletar) |
| Criar | `public/shot/<key>/{full.mp4,full.webp,a.webp,b.webp,c.webp}` ×5 + `public/shot/cutout/*.webp` | Higgsfield (Tasks 3-4) |

Keys dos capítulos: `execucao`, `tripulacao`, `rota`, `guerras`, `amanhecer`.

---

### Task 1: Fundação — design system, libs e fontes

**Files:** Reescrever `src/app/globals.css`; modificar `src/app/layout.tsx`; copiar os 4 libs + `svg-word.tsx` + `magnetics.tsx` do terral.

**Interfaces — Produces:** tokens `--color-coal/cream/gold/...` com valores One Piece; classes `t-mega/t-giant/t-huge/t-big/t-lead/t-body/t-cap/t-micro/t-outline/t-nums/.voice/.ink*/.chapter*/.panel*/.mote/.mist/.sun-rays/.steam-wisp/.x-*/.ch-*/.marquee*/.btn-*/.link-under/.rule*/.nav-progress/.loader*/.grain-sheet/.vignette/.split-*`; libs `splitText(el, mode)`, `registerReveals(root, opts)`, `setLenis/getLenis/lockScroll/unlockScroll/EXPO_OUT/scrollToId/READY_EVENT/GATE_EVENT`, `registerNav/setNavColor`; componente `SvgWord`.

- [ ] **Step 1: copiar libs e componentes base**

```powershell
Copy-Item C:\Users\rickj\projetos\terral\src\lib\split.ts,C:\Users\rickj\projetos\terral\src\lib\reveal.ts,C:\Users\rickj\projetos\terral\src\lib\scroll.ts,C:\Users\rickj\projetos\terral\src\lib\nav-color.ts C:\Users\rickj\projetos\animes\src\lib\
Copy-Item C:\Users\rickj\projetos\terral\src\components\svg-word.tsx,C:\Users\rickj\projetos\terral\src\components\magnetics.tsx C:\Users\rickj\projetos\animes\src\components\
```

Em `src/lib/scroll.ts`: `terral:scene-ready` → `onepiece:scene-ready`, `terral:gate-open` → `onepiece:gate-open`.
Em `svg-word.tsx`: `fontWeight={900}` → `fontWeight={400}` e fallback `Georgia, serif` → `Impact, sans-serif` (Anton é 400-only; bold sintético deforma o stencil).

- [ ] **Step 2: reescrever `globals.css`** — partir do terral inteiro (1282 linhas) e aplicar:

1. `@theme` vira:

```css
@theme {
  /* matéria — azul-noite de mar, nunca #000 */
  --color-coal: #05070d;
  --color-coal-2: #0a1020;
  --color-cream: #f4efe4;
  --color-cream-dim: #97a0b3;
  /* o fio condutor: ouro de tesouro */
  --color-gold: #f5b740;
  /* paleta legada do hero e das falas */
  --color-abyss: #05070d;
  --color-deep: #0b1220;
  --color-ocean: #1b4b8f;
  --color-surf: #35c2e8;
  --color-blood: #e4232c;
  --color-ember: #ff5a3c;
  --color-orchid: #e057b0;
  --color-violet: #8b6cf0;
  --color-jade: #4ecb8b;
  --color-parchment: #f4efe4;
  --color-fog: #8ba0bd;
  --font-display: var(--font-anton), Impact, sans-serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-voice: var(--font-fraunces), Georgia, serif;
  --ease-default: cubic-bezier(0.65, 0.05, 0, 1);
}
```

2. `.voice` passa a usar `var(--font-voice)` (segue itálico serif).
3. Seletores `[data-chapter="caparao|terreiro|tambor|moenda|xicara"]` → `execucao|tripulacao|rota|guerras|amanhecer` (mesma ordem; o bloco especial do `xicara` — fundo claro, luz de janela — vira o do `amanhecer`).
4. Remover blocos `coffee-row/coffee-num/coffee-pack/pack-*` SÓ SE a Task 8 não os usar — ela usa; MANTER, apenas renomeando nada (as classes são genéricas o bastante).
5. Preservar do animes atual: as utilities `@utility display`, `@utility label-caps`, `@utility text-hollow` e o comentário-aviso do `feTurbulence` (colar no fim).
6. Manter a raiz fluida `1vw` do terral como está.

- [ ] **Step 3: `layout.tsx`** — adicionar Fraunces e Magnetics:

```tsx
import { Anton, Fraunces, Inter } from "next/font/google";
import { Magnetics } from "@/components/magnetics";
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});
```

`<html className={...anton, inter, fraunces...}>`; body mantém `bg-abyss text-parchment`; `<Magnetics />` antes de fechar o body. REMOVER `<Preloader />` e `<SmoothScroll />` do layout (o SiteShell assume na Task 5 — até lá a página fica sem smooth, ok).

- [ ] **Step 4: build**

Run: `npm run build` — Expected: PASS (as seções antigas seguem compilando; classes novas não conflitam).

- [ ] **Step 5: commit** — `feat: porta o design system do terral (tokens, tipos, libs de scroll/split/reveal)`

---

### Task 2: Conteúdo dos capítulos — `src/content/chapters.ts`

**Files:** Criar `src/content/chapters.ts`.

**Interfaces — Produces:** `export type Stat/Chapter` (idênticos ao terral `src/lib/chapters.ts`), `export const CHAPTERS: Chapter[]`, `export const NEUTRAL_NAV = "#c9b083"` → usar `"#f5b740"` (ouro OP). Consumido por nav/chapter/intro via `@/content/chapters`.

- [ ] **Step 1: copiar os types do terral** (`Stat`, `Chapter` — incluindo `headline`, `wall`, `images`, `color` com `blend`) e escrever os 5 capítulos:

```ts
export const CHAPTERS: Chapter[] = [
  {
    key: "execucao", index: "01", title: "EXECUÇÃO", nav: "Execução", kicker: "A palavra",
    heading: "Uma frase soltou o mundo no mar.",
    headline: { lines: ["Uma frase", "soltou o mundo", "no mar."], hot: 0 },
    wall: { wide: 0, mid: 1 },
    lead: "Gol D. Roger conquistou tudo, dissolveu a própria tripulação e se entregou. No cadafalso, perguntaram do tesouro — ele respondeu que estava tudo lá, era só ir buscar. O Governo queria encerrar a pirataria com aquela morte. Em um único dia, cada porto do planeta soltou um navio no mar.",
    caption: "Loguetown, a praça da execução — onde tudo começou e terminou.",
    hero: { value: "22", unit: "anos", label: "Do cadafalso ao barco a remo" },
    stats: [
      { value: "22", unit: "anos", label: "Até o garoto zarpar" },
      { value: "1", label: "Frase no cadafalso" },
      { value: "17", unit: "anos", label: "O garoto do chapéu" },
    ],
    images: {
      video: "/shot/execucao/full.mp4", full: "/shot/execucao/full.webp",
      cluster: ["/shot/execucao/a.webp", "/shot/execucao/b.webp", "/shot/execucao/c.webp"],
      alt: {
        full: "A praça de Loguetown sob chuva fina, multidão diante do cadafalso ao longe.",
        cluster: [
          "Multidão apinhada na praça de execução, vista de cima.",
          "O sorriso do rei dos piratas no cadafalso, em close pictórico.",
          "Jornais voando e navios zarpando de um porto ao amanhecer.",
        ],
      },
    },
    color: { bg: "#212a36", ink: "#edf1f7", accent: "#e05548", nav: "#e05548", blend: true },
  },
  {
    key: "tripulacao", index: "02", title: "TRIPULAÇÃO", nav: "Tripulação", kicker: "Os dez",
    heading: "Dez pessoas, um mastro, um chapéu.",
    headline: { lines: ["Dez pessoas,", "um mastro,", "um chapéu."], hot: 2 },
    wall: { wide: 1, mid: 2 },
    lead: "Um espadachim que se perdeu, uma navegadora que odiava piratas, um atirador covarde, um cozinheiro que alimenta inimigo, um médico rejeitado, uma arqueóloga procurada, um carpinteiro sem corpo, um músico sem ninguém, um timoneiro do mar de baixo. Nenhum deles foi recrutado. Todos foram salvos — e escolheram ficar.",
    caption: "O convés ao meio-dia — a mesa onde cabem dez sonhos.",
    hero: { value: "10", label: "Tripulantes a bordo" },
    stats: [
      { value: "10", label: "Tripulantes" },
      { value: "5", label: "Mares de origem" },
      { value: "1", label: "Capitão" },
    ],
    images: {
      video: "/shot/tripulacao/full.mp4", full: "/shot/tripulacao/full.webp",
      cluster: ["/shot/tripulacao/a.webp", "/shot/tripulacao/b.webp", "/shot/tripulacao/c.webp"],
      alt: {
        full: "Navio pirata a vela cruzando um mar ensolarado, visto de longe.",
        cluster: [
          "Chapéu de palha com fita vermelha em close, sobre madeira de convés.",
          "Banquete barulhento no convés à noite, lanternas acesas.",
          "Vela principal com a caveira sorridente, enfunada ao vento.",
        ],
      },
    },
    color: { bg: "#8a6a1a", ink: "#fdf6e0", accent: "#ffd97a", nav: "#ffd97a", blend: false },
  },
  {
    key: "rota", index: "03", title: "ROTA", nav: "Rota", kicker: "O mapa",
    heading: "O mapa acaba, o mar continua.",
    headline: { lines: ["O mapa acaba,", "o mar", "continua."], hot: 1 },
    wall: { wide: 0, mid: 2 },
    lead: "Dois anéis cortam o mundo: uma parede de terra e um mar que enlouquece bússolas. Entra-se por uma montanha que engole navios e, no meio do caminho, desce-se dez mil metros para atravessar por baixo o que não se atravessa por cima. A última ilha não está em mapa nenhum.",
    caption: "A Grand Line — onde bússola comum aponta pra lugar nenhum.",
    hero: { value: "10000", unit: "m", label: "O mergulho sob a Red Line" },
    stats: [
      { value: "10000", unit: "m", label: "Mergulho" },
      { value: "21", label: "Ilhas na rota" },
      { value: "2", label: "Anéis no mundo" },
    ],
    images: {
      video: "/shot/rota/full.mp4", full: "/shot/rota/full.webp",
      cluster: ["/shot/rota/a.webp", "/shot/rota/b.webp", "/shot/rota/c.webp"],
      alt: {
        full: "Mar revolto em tempestade com um farol de rota ao longe.",
        cluster: [
          "Corrente vertical de água subindo a montanha reversa.",
          "Uma bússola de vidro no pulso, apontando para cima.",
          "O abismo do mar profundo com luzes de uma cidade submersa.",
        ],
      },
    },
    color: { bg: "#123c58", ink: "#e9f4f9", accent: "#7adcec", nav: "#7adcec", blend: true },
  },
  {
    key: "guerras", index: "04", title: "GUERRAS", nav: "Guerras", kicker: "As bandeiras",
    heading: "Algumas bandeiras queimaram primeiro.",
    headline: { lines: ["Algumas", "bandeiras", "queimaram."], hot: 2 },
    wall: { wide: 1, mid: 0 },
    lead: "Uma bandeira queimada num tribunal que nunca absolveu ninguém. Uma guerra onde o homem mais forte do mundo morreu de pé, sem um único ferimento nas costas. Um país que esperou vinte anos por uma vingança marcada. As guerras desta história não são sobre território — são sobre o direito de existir.",
    caption: "Marineford — a guerra que ninguém venceu.",
    hero: { value: "20", unit: "anos", label: "A espera de Wano" },
    stats: [
      { value: "20", unit: "anos", label: "A espera de Wano" },
      { value: "1", label: "Bandeira queimada" },
      { value: "0", label: "Feridas nas costas" },
    ],
    images: {
      video: "/shot/guerras/full.mp4", full: "/shot/guerras/full.webp",
      cluster: ["/shot/guerras/a.webp", "/shot/guerras/b.webp", "/shot/guerras/c.webp"],
      alt: {
        full: "Campo de batalha naval em chamas, fumaça cobrindo o céu.",
        cluster: [
          "Bandeira pirata em chamas contra o céu escuro.",
          "Guerreiros em silhueta avançando entre cinzas.",
          "Muralha de fortaleza com canhões, vista de baixo.",
        ],
      },
    },
    color: { bg: "#671710", ink: "#fdeade", accent: "#ff9b6e", nav: "#ff9b6e", blend: true },
  },
  {
    key: "amanhecer", index: "05", title: "AMANHECER", nav: "Amanhecer", kicker: "A herança",
    heading: "A vontade passa de mão em mão.",
    headline: { lines: ["A vontade", "passa de mão", "em mão."], hot: 0 },
    wall: { wide: 2, mid: 1 },
    lead: "Um século apagado dos livros, um nome proibido de existir, uma vontade que atravessa gerações trocando de dono como um chapéu de palha. O tesouro tem nome, tem lugar e tem dono — mas a resposta de verdade nunca foi o que está lá no fim. É quem chega junto. O amanhecer que alguém prometeu ainda vem.",
    caption: "O primeiro sol depois da tempestade — o amanhecer prometido.",
    hero: { value: "100", unit: "anos", label: "O século que apagaram" },
    stats: [
      { value: "100", unit: "anos", label: "Século Vazio" },
      { value: "2", unit: "anos", label: "De treino — 3D2Y" },
      { value: "1", label: "Tesouro no fim" },
    ],
    images: {
      video: "/shot/amanhecer/full.mp4", full: "/shot/amanhecer/full.webp",
      cluster: ["/shot/amanhecer/a.webp", "/shot/amanhecer/b.webp", "/shot/amanhecer/c.webp"],
      alt: {
        full: "Amanhecer dourado sobre mar calmo, luz varrendo a água.",
        cluster: [
          "Gaivotas em contraluz contra o sol nascente.",
          "Chapéu de palha pousado na proa contra o amanhecer.",
          "Linha do horizonte dourada com nuvens altas.",
        ],
      },
    },
    color: { bg: "#ecdfc8", ink: "#191310", accent: "#b0451f", nav: "#b0451f", blend: false },
  },
];
export const NEUTRAL_NAV = "#f5b740";
```

- [ ] **Step 2:** `npm run build` — Expected: PASS (arquivo ainda sem consumidores).
- [ ] **Step 3: commit** — `feat: conteudo dos cinco capitulos da jornada`

---

### Task 3: Mídia Higgsfield — imagens (SESSÃO PRINCIPAL, não delegar)

**Files:** Criar `public/shot/<key>/{full,a,b,c}.webp` ×5 e `public/shot/cutout/{sword,hat,compass,flag}.webp`.

- [ ] **Step 1:** conferir saldo (`mcp__higgsfield__balance`) e custo (`models_explore` action recommend p/ imagem estilizada). Usar nano banana (mais barato; entregou os pack shots do terral).
- [ ] **Step 2: estilo** — todo prompt de imagem termina com o sufixo: `"painterly cinematic illustration inspired by classic pirate adventure anime, oil paint texture, dramatic light, muted sea palette, no text, no watermark, 16:9"`. NUNCA citar nomes de personagens/marca nos prompts (gerar arquétipos: "young pirate captain with a straw hat" etc.). Conferir consistência com `public/art/*.webp` (abrir 2-3 no Read pra calibrar).
- [ ] **Step 3:** gerar os 20 shots (5 capítulos × full/a/b/c) com os conteúdos descritos nos `alt` da Task 2 — o alt É o prompt-base. Baixar, converter pra webp, salvar nos caminhos finais.
- [ ] **Step 4: cutouts** — gerar 4 objetos em fundo neutro liso: espada de lâmina longa fincada, chapéu de palha com fita vermelha, bússola de vidro antiga (log pose: bolha de vidro com agulha, em pulseira), bandeira pirata rasgada em mastro curto. Passar cada um por `mcp__higgsfield__remove_background`, salvar como webp com alpha em `public/shot/cutout/`.
- [ ] **Step 5:** `node scripts/downscale-art.mjs` (conferir no script se ele varre `public/shot`; se não, ajustar o glob para incluir).
- [ ] **Step 6:** mostrar um contact-sheet pro Rick (SendUserFile com 3-4 amostras) ANTES de gastar com vídeo.
- [ ] **Step 7: commit** — `feat: fotografia dos capitulos gerada (posters, clusters e recortes)`

---

### Task 4: Mídia Higgsfield — vídeos (SESSÃO PRINCIPAL, não delegar)

**Files:** Criar `public/shot/<key>/full.mp4` ×5 (o que o saldo permitir, ordem 01→05).

- [ ] **Step 1:** `models_explore` (recommend, image-to-video, loop lento). Escolher o mais barato que faça movimento sutil (mar, fumaça, luz).
- [ ] **Step 2:** para cada capítulo, animar o `full.webp` com prompt de movimento lento ("slow drifting camera, gentle rain/smoke/waves, cinematic, seamless loop, no cuts"). 5s, 16:9.
- [ ] **Step 3:** re-encodar cada mp4 com ffmpeg: `ffmpeg -i in.mp4 -an -c:v libx264 -crf 26 -g 1 -pix_fmt yuv420p full.mp4` — `-g 1` (todo frame keyframe) é a lição do dagrao pra scrub/seek liso; aqui o vídeo dá play normal, mas keyframes densos mantêm o seek do loop limpo. Alvo ≤ 3 MB por vídeo (subir CRF se passar).
- [ ] **Step 4:** conferir saldo restante; registrar no commit quanto sobrou. Commit — `feat: planos de video dos capitulos`

---

### Task 5: Shell + Loader + Nav

**Files:** Copiar `site-shell.tsx` + `loader.tsx` do terral; criar `src/components/nav.tsx`; modificar `ThroneHero.tsx`; deletar `src/lib/smooth-scroll.tsx` e `src/components/ui/Preloader.tsx`.

**Interfaces — Consumes:** `CHAPTERS`/`NEUTRAL_NAV` de `@/content/chapters`; libs da Task 1. **Produces:** `<SiteShell>`, `<Nav />`.

- [ ] **Step 1:** copiar `site-shell.tsx` e `loader.tsx`; nos dois, trocar import de `@/lib/chapters` (se houver) para `@/content/chapters` e a marca desenhada no loader: `SvgWord text="ONE PIECE"`.
- [ ] **Step 2:** port do `nav.tsx` do terral com: marca `ONE PIECE` (href `#topo`), links dos 5 capítulos de `CHAPTERS`, e no lugar do CTA de WhatsApp um link `As falas` → `scrollToId("falas")`. REMOVER `const WHATSAPP`/`wa` (site sem comércio). Exportar nada além de `Nav`.
- [ ] **Step 3:** `ThroneHero.tsx` — o loader espera `READY_EVENT`. Adicionar no componente (efeito): quando o primeiro `<video>` interno disparar `canplay` OU 1500 ms se passarem, `window.dispatchEvent(new Event(READY_EVENT))` (import de `@/lib/scroll`). O bail de 4 s do shell segue como rede.
- [ ] **Step 4:** deletar `smooth-scroll.tsx` e `ui/Preloader.tsx`; ajustar `page.tsx` provisoriamente: envolver o conteúdo atual em `<SiteShell><Nav/>…</SiteShell>` para o build passar (a montagem final é a Task 10; seções antigas que quebrarem por falta do Lenis antigo seguem — o Lenis do shell cobre).
- [ ] **Step 5:** `npm run build` — PASS. `npm run start` + abrir: loader desenha ONE PIECE, portão abre, hero scruba. Commit — `feat: shell do terral (lenis unico, loader com portao) e nav por capitulos`

---

### Task 6: ChapterSection — port + cenas One Piece + painel extra

**Files:** Criar `src/components/chapter.tsx` (base: terral `chapter.tsx`, 1091 linhas); miolo do `Crew.tsx` e do `GrandLineMap.tsx` migra pra cá como painéis extras.

**Interfaces — Consumes:** `Chapter`/`CHAPTERS`/`NEUTRAL_NAV`, `setNavColor`, `splitText`, `SvgWord`. **Produces:** `ChapterSection({ chapter, first, extra })` — `extra?: React.ReactNode` renderiza um painel adicional de `100vw` entre o corredor (painel 2) e a mídia (painel 3).

- [ ] **Step 1:** copiar o arquivo; trocar imports para `@/content/chapters`.
- [ ] **Step 2: adaptações pontuais**
  - Todo `"xicara"` (numeral escondido, max-w do título) → `"amanhecer"`.
  - Fallback do véu `?? "#0b0908"` → `?? "#05070d"` (coal OP).
  - Marca no topo da cena: `Terral` → `One Piece`; rótulo do painel 1: `Terral · Jornada` → `One Piece · A jornada`.
  - Manchete (`.ch-head` inline style): `fontWeight: 900` → `400` (Anton).
  - `const BEAN = "/shot/cutout/bean.webp"` → `const HAT = "/shot/cutout/hat.webp"` (o recorte-vinheta reutilizável).
- [ ] **Step 3: GLYPHS** (mesmo formato 24×24):

```ts
const GLYPHS: Record<string, string[]> = {
  execucao: ["M4 20 L15 9", "M13 7 L18 2 L22 6 L17 11", "M7 15 L11 19"],
  tripulacao: ["M3 15h18", "M7 15a5 5 0 0 1 10 0", "M7 13h10"],
  rota: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M15.5 8.5 13 13l-4.5 2.5L11 11Z"],
  guerras: ["M6 3v18", "M6 4h11l-2.5 3 2.5 3H6"],
  amanhecer: ["M3 17h18", "M7 17a5 5 0 0 1 10 0", "M12 6v2.5M5.6 8.6l1.8 1.8M18.4 8.6l-1.8 1.8"],
};
```

- [ ] **Step 4: SCENES** — mesma `SceneSpec`; reaproveitar os strokes do terral onde a forma serve (calor→fumaça, sol→sol) e trocar objetos/copy:
  - `execucao`: strokes = 3 diagonais de chuva (`"M300,0 L180,600"`, `"M700,0 L580,600"`, `"M1050,0 L930,600"`) + plataforma (`"M420,470 h360 M480,470 L480,300 h240 L720,470"`); obj `sword.webp` à esquerda (`left:"4vw", bottom:"-2vh", width:"24rem", rotate(8deg)`); fore = 2× `HAT` desfocado; air `"mist"`; block right, icon `execucao`, copy: `Tudo termina numa praça e começa na mesma praça. A morte dele foi <em className="voice">um convite</em> — e o mundo inteiro aceitou.`
  - `tripulacao`: strokes do `terreiro` (sol a pino); obj `hat.webp` à direita; fore = 2× `HAT`; air `"rays"`; block left, copy: `Ninguém aqui foi recrutado. Cada um foi <em className="voice">salvo</em> — e escolheu ficar.`
  - `rota`: strokes = 2 ondas (`"M0,420 C200,360 400,470 600,410 S1000,340 1200,400"`, `"M0,500 C260,450 520,520 780,470 S1080,420 1200,460"`) + círculo de bússola (`"M950,140 a70,70 0 1 1 0.1,0"`) + agulha (`"M950,90 L950,140"`); obj `compass.webp` à esquerda; fore = 2× `HAT`; air `"mist"`; block right, copy: `A bússola comum enlouquece aqui. Só serve a que aponta <em className="voice">pro impossível</em>.`
  - `guerras`: strokes do `tambor` (calor subindo = fumaça); obj `flag.webp` à esquerda (`bottom:"6vh"`); fore = 2× `HAT`; air `"embers"`; block right, icon `guerras`, copy: `Guerra, aqui, nunca é por ouro. É pelo direito de <em className="voice">hastear uma bandeira</em>.`
  - `amanhecer`: strokes = arcos de sol no horizonte (`"M240,430 A420,420 0 0 1 960,430"`, `"M340,470 A300,300 0 0 1 860,470"`, `"M0,470 L1200,470"`) + 2 gaivotas (`"M500,180 q30,-22 60,0 M560,180 q30,-22 60,0"` e outra deslocada); obj `hat.webp` bottom right (o chapéu devolvido); `steam: false`; fore = 2× `HAT`; block left, copy: `O tesouro tem dono e lugar. A resposta, não: ela chega <em className="voice">com quem chega junto</em>.`
- [ ] **Step 5: painel extra** — na `chapter-track`, entre o painel 2 e o painel 3, renderizar `{extra && <div className="panel flex items-center px-[6vw]">{extra}</div>}`. Regras: conteúdo estático (SEM ScrollTrigger próprio). O `overflow = track.scrollWidth - innerWidth` já absorve a largura extra — nada mais a ajustar.
- [ ] **Step 6: extras de conteúdo** — criar `src/components/chapter-extras.tsx` com dois exports:
  - `CrewPanel`: fileira horizontal dos 10 retratos de `CREW` (`src/content/crew.ts`) — `flex gap-[2rem]`, cada card `w-[16rem]` com `Image` do retrato, nome em `t-micro` e o sonho/role em `t-cap`. Copiar dados/campos do `Crew.tsx` atual antes de deletá-lo (Task 10).
  - `MapPanel`: o SVG do mapa portado do `GrandLineMap.tsx` (usa `ROUTE/WORLD/SEAS/ROUTE_PATH` de `@/content/route`), renderizado estático (rota já traçada, ilhas com rótulos), largura `min(88vw, 96rem)`. Remover animações de draw por ScrollTrigger que existirem no original.
- [ ] **Step 7:** `npm run build` — PASS. Commit — `feat: capitulos fixados portados com cenas proprias e paineis de crew/mapa`

---

### Task 7: Intro (manifesto)

**Files:** Criar `src/components/intro.tsx` (base: terral `intro.tsx`, 292 linhas).

- [ ] **Step 1:** copiar; imports → `@/content/chapters`. `ChapterIcon` troca os 5 cases pelos GLYPHS da Task 6 (mesmos paths, um `<svg>` por case). `ROW_COLOR = { amanhecer: "#c95f33" }` (o accent do capítulo claro afunda no escuro — mesma lógica do xicara).
- [ ] **Step 2: conteúdo** — manchete/parágrafos do manifesto atual (`Manifesto.tsx` — copiar o texto de lá ou de `src/content/era.ts` antes de deletar): manchete `A história que o mundo tentou apagar`, apoio com o texto do manifesto existente. `PROOFS` vira: `{title:"Uma cena só", sub:"Do trono ao amanhecer"}`, `{title:"33 ilustrações", sub:"Geradas por IA, inspiradas na obra"}`, `{title:"Sem vínculo", sub:"Projeto de demonstração"}` — ícones: reusar chapéu, bússola e bandeira dos GLYPHS. Rótulo do topo: `Manifesto` / `Desde 1997` (ano do mangá). Foto do bloco direito: `/shot/tripulacao/b.webp`.
- [ ] **Step 3:** build PASS; commit — `feat: manifesto no formato editorial com indice dos capitulos`

---

### Task 8: As Falas — vitrine editorial

**Files:** Criar `src/components/falas.tsx` (base: terral `coffees.tsx`, 501 linhas); consome `VOICES` de `@/content/voices`.

- [ ] **Step 1:** copiar `coffees.tsx` → `falas.tsx`; renomear export para `Falas`, `id="falas"`, título da seção `As falas que ficaram`, kicker `O que se disse`.
- [ ] **Step 2: mapeamento por linha** (uma `coffee-row` por fala, 10 linhas):
  - numeral gigante de fundo (`coffee-num`) = índice `01…10`;
  - nome do blend = `speaker`; notas/chips = `context`;
  - descrição = `lead` (se houver, em `t-cap`) + `quote` em `.voice`;
  - foto (`coffee-pack`/`pack-photo`) = `portrait` (StaticImageData — usar `<Image src={voice.portrait} …>`);
  - cor do hover/acento = mapear `voice.accent` para o token (`gold→--color-gold`, `blood→--color-blood`, `ember→--color-ember`, `surf→--color-surf`, `orchid→--color-orchid`, `violet→--color-violet`, `jade→--color-jade`).
  - REMOVER tudo de preço/CTA/WhatsApp/Clube que existir no coffees; a linha não é clicável.
- [ ] **Step 3:** build PASS; commit — `feat: vitrine editorial das falas no molde da vitrine de cafes`

---

### Task 9: Rodapé-jornal + botão SEGURE + `/laugh-tale`

**Files:** Copiar `hold-button.tsx`; criar `src/components/site-footer.tsx` (base terral) e `src/app/laugh-tale/page.tsx` (base casa-do-torrador).

- [ ] **Step 1:** `hold-button.tsx`: `SECRET = "/laugh-tale"`; dica: `Tem uma ilha que não está no mapa.`; manter os 6 s.
- [ ] **Step 2:** `site-footer.tsx`:
  - `DADOS = [{label:"A obra", lines:["One Piece — Eiichiro Oda","Shueisha · Toei Animation"]},{label:"Este site", lines:["Projeto de demonstração","Ilustrações geradas por IA"]},{label:"Feito por", lines:["MilWeb — milweb.com.br"]}]`
  - `PALAVRAS = ["Liberdade","Herança","Vontade","D.","O mar","Amanhecer"]`
  - manchete: `A era ainda não <em className="voice">acabou</em>.` — CTA principal vira link `Ver o código do site` → `https://github.com/rickjs2005` (sem WhatsApp) ao lado do `<HoldButton />`.
  - marca final: `SvgWord text="ONE PIECE"`; linha legal: `Projeto de demonstração — sem vínculo com os detentores dos direitos. Site por MilWeb.`; link discreto do segredo: `O fim do mapa` → `/laugh-tale`.
  - kicker do topo do rodapé: `Fim da jornada` (mantém).
- [ ] **Step 3:** `laugh-tale/page.tsx`:
  - fundo: `/shot/amanhecer/b.webp` (chapéu no amanhecer) com a mesma máscara;
  - kicker `A ilha que não está no mapa`; manchete `Você <em className="voice">chegou</em>.`;
  - parágrafo: `Seis segundos com o dedo parado num botão que não prometia nada. Quem atravessa a Grand Line inteira descobre a mesma coisa que você: o que há no fim é uma história — e ela termina rindo.`;
  - o prêmio (no lugar do código): bloco com rótulo `O que está aqui`, a frase `« O One Piece é real. »` em `t-big` ouro, e um botão `Levar o amanhecer` que baixa `/laugh-tale/wallpaper.webp` (`<a download href=…>`), + `Voltar`;
  - gerar o wallpaper: `mcp__higgsfield__upscale_image` do `/shot/amanhecer/full.webp` para 4K → `public/laugh-tale/wallpaper.webp` (sessão principal);
  - `robots: { index: false, follow: false }` mantém.
- [ ] **Step 4:** build PASS; commit — `feat: rodape-jornal com letreiro, segredo do segure e a ilha do fim do mapa`

---

### Task 10: Montagem final + limpeza

**Files:** Modificar `src/app/page.tsx`; deletar seções antigas; atualizar `README.md`.

- [ ] **Step 1: page.tsx**

```tsx
import { ChapterSection } from "@/components/chapter";
import { CrewPanel, MapPanel } from "@/components/chapter-extras";
import { Falas } from "@/components/falas";
import { Intro } from "@/components/intro";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteShell } from "@/components/site-shell";
import { ThroneHero } from "@/components/hero/ThroneHero";
import { CHAPTERS } from "@/content/chapters";

const EXTRAS: Record<string, React.ReactNode> = {
  tripulacao: <CrewPanel />,
  rota: <MapPanel />,
};

export default function Home() {
  return (
    <SiteShell>
      <Nav />
      <main id="topo">
        <ThroneHero />
        <Intro />
        {CHAPTERS.map((chapter, i) => (
          <ChapterSection key={chapter.key} chapter={chapter} first={i === 0} extra={EXTRAS[chapter.key]} />
        ))}
        <Falas />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
```

- [ ] **Step 2:** deletar `src/components/sections/*` (Manifesto, Era, Crew, FlagReveal, GrandLineMap, Moments, Voices, Footer) e `src/components/ui/{Marquee,Reveal,ParallaxBackdrop}.tsx` — ANTES conferir com grep que nada mais os importa. `src/content/{era,moments}.ts` ficam órfãos? `era.ts` foi absorvido no lead do cap 01 (deletar); `moments.ts` deletar; `crew.ts`, `route.ts`, `voices.ts` FICAM (consumidos por extras/falas).
- [ ] **Step 3:** `npm run build` + `npx eslint src` — PASS, zero imports quebrados.
- [ ] **Step 4:** README: atualizar a seção Estrutura (capítulos, shot/, laugh-tale) e manter as lições. Commit — `feat: pagina montada na jornada em capitulos + limpeza das secoes antigas`

---

### Task 11: Verificação visual (obrigatória antes de qualquer "pronto")

- [ ] **Step 1:** criar `scripts/shoot.mjs` adaptando `C:\Users\rickj\projetos\terral\tmp-shoot.mjs` (Playwright: abre `http://localhost:3010`, espera o portão, rola em ~14 pontos do documento tirando screenshot de cada um em `tmp-shots/`).
- [ ] **Step 2:** `npm run build; npx next start -p 3010` (lembrete do terral: `-p` via `next start`, não via `npm start --`) e rodar o shoot.
- [ ] **Step 3:** OLHAR cada screenshot (Read): loader, hero, manifesto, os 5 capítulos (abertura/corredor/manchete/mídia aberta/stats), painéis crew/mapa, falas, rodapé, marca final. Conferir: manchete inteira (não meia-palavra), stats não cortados, numeral do amanhecer escondido, contraste do capítulo claro, vídeo com poster correto.
- [ ] **Step 4:** medir o `grain-sheet`: rolar com DevTools Performance ou simplesmente observar jank nos screenshots/tempo de scroll do script; se houver travamento, remover `.grain-sheet` (constraint global).
- [ ] **Step 5:** testar `/laugh-tale` (screenshot) e o hold-button (6 s → navega).
- [ ] **Step 6:** `prefers-reduced-motion`: relançar o shoot com `--reduced` (emular no contexto Playwright) e conferir versão empilhada.
- [ ] **Step 7:** corrigir o que aparecer, re-rodar, commit — `fix: ajustes da verificacao visual`

---

### Task 12: Deploy

- [ ] **Step 1:** `git remote -v`; sem remote → `gh repo create rickjs2005/one-piece-site --public --source . --push`; com remote → `git push`. GitHub SEMPRE antes do deploy (regra do Rick).
- [ ] **Step 2:** `npx vercel --prod` no diretório do projeto.
- [ ] **Step 3:** gotchas do terral: (a) projeto novo nasce com Deployment Protection — desligar via `PATCH /v9/projects/{id}?teamId=… {"ssoProtection":null}` com o token do CLI (`AppData/Roaming/xdg.data/com.vercel.cli/auth.json`); (b) escolher alias `*.vercel.app` conferindo se já não é de terceiro (checar `<title>` servido); `vercel alias set <deploy> <nome>.vercel.app` — e lembrar que o alias NÃO acompanha deploys futuros.
- [ ] **Step 4:** repetir o shoot da Task 11 CONTRA A URL DE PRODUÇÃO (regra da memória: scrub que passa local pode quebrar na CDN) e olhar os screenshots.
- [ ] **Step 5:** commit final de docs + atualizar a memória do projeto (`loja-animes-akatsuki.md` NÃO — criar/atualizar memória própria do site One Piece com URL, gotchas novos).
