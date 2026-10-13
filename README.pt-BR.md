# One Piece — A história que o mundo tentou apagar

Peça cinematográfica de página única sobre a história de One Piece. Uma cena
controlada pelo scroll abre o site, e a partir dela a página conta a jornada em
cinco capítulos — Execução, Tripulação, Rota, Guerras, Amanhecer — fechando
com uma vitrine das falas que ficaram.

Projeto de demonstração. Sem vínculo com os detentores dos direitos da obra.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4**
- **GSAP 3** + ScrollTrigger para toda a animação
- **Lenis** para suavizar o scroll que alimenta o ScrollTrigger

Site estático — sem backend, banco ou API.

## Rodando

```bash
npm install
npm run dev
```

Em `http://localhost:3000`.

Para conferir o desempenho de verdade, use o build de produção: em
desenvolvimento o otimizador de imagens processa as artes sob demanda e
disputa CPU com o navegador.

```bash
npm run build && npm run start
```

## Estrutura

```
src/app/                    home, /laugh-tale (a recompensa do SEGURE), tokens de cor e tipografia
src/components/hero/        ThroneHero — a cena de abertura — e suas camadas (ShotLayer)
src/components/chapter.tsx  ChapterSection — a faixa horizontal fixa de cada capítulo
src/components/chapter-extras.tsx  CrewPanel e MapPanel, os painéis extras de dois capítulos
src/components/intro.tsx    o manifesto de abertura
src/components/falas.tsx    a vitrine editorial das falas
src/components/site-shell.tsx, loader.tsx, nav.tsx, site-footer.tsx  casca do site
src/content/                os 5 capítulos, a tripulação, a rota e as falas
src/lib/                    timeline do hero, Lenis + ScrollTrigger, reveals, split de texto
scripts/                    utilitário que reduz as artes ao tamanho de uso
public/art/                 ilustrações do manifesto e da vitrine de falas
public/shot/                fotos por capítulo (execucao, tripulacao, rota, guerras, amanhecer, cutout)
public/video/               2 planos do hero
public/laugh-tale/          o wallpaper da página secreta
docs/superpowers/specs/     os documentos de design que originaram o projeto
```

Cada capítulo é uma entrada em `CHAPTERS` (`src/content/chapters.ts`), renderizada
pelo mesmo `ChapterSection` em `src/app/page.tsx`. Trocar uma fala, uma ilha da
rota ou um tripulante não exige tocar em componente nenhum — só no conteúdo em
`src/content/`.

## Decisões que valem saber

**O palco das seções fixas usa `position: sticky`, não o `pin` do
ScrollTrigger.** Sticky não cria pin-spacer, não desloca o resto da página e
não depende de remedição depois que as imagens carregam.

**O Lenis só emite evento para o scroll que ele mesmo conduz.** Um scroll
programático — âncora, tecla Home, restauração de posição ao recarregar —
deixaria o ScrollTrigger com a posição antiga, então `src/lib/scroll.ts`
centraliza a instância única (`getLenis`/`setLenis`) e expõe `scrollToId`, que
sabe cair para `scrollIntoView` nativo quando o Lenis ainda não montou.

**As artes são reduzidas ao tamanho em que aparecem** (`scripts/downscale-art.mjs`).
Em 2K a página travava o renderizador do Chrome. Se novas artes forem
adicionadas, rode o script antes de commitar.

**Nada de `feTurbulence` em tela cheia.** Uma camada de grão de filme em SVG
sob `mix-blend-mode` travou o navegador por completo — está anotado em
`globals.css` para não voltar.

**`prefers-reduced-motion` é respeitado em toda seção animada**: o hero mostra
o quadro final sem scrub, os vídeos dão lugar às imagens estáticas, e as
galerias horizontais viram listas de scroll comum.

## Créditos

One Piece — Eiichiro Oda / Shueisha / Toei Animation.
As ilustrações do site foram geradas por IA, inspiradas na obra.
