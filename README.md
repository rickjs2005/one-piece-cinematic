# One Piece — A história que o mundo tentou apagar

Peça cinematográfica de página única sobre a história de One Piece. Uma cena
controlada pelo scroll abre o site, e a partir dela a página conta a jornada:
como a Era dos Piratas começou, quem são os Chapéus de Palha, a rota até o fim
do mapa, os momentos que marcaram e as falas que ficaram.

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
src/app/                 layout, página, tokens de cor e tipografia
src/components/hero/     a cena de abertura e suas camadas
src/components/sections/ Manifesto, Era, Crew, FlagReveal, Rota, Jornada, Falas
src/components/ui/       Preloader, Marquee, Reveal, ParallaxBackdrop
src/content/             todo o texto e os dados, separados dos componentes
src/lib/                 timeline do hero e integração Lenis + ScrollTrigger
scripts/                 utilitário que reduz as artes ao tamanho de uso
public/art/              33 ilustrações
public/video/            2 planos do hero
docs/superpowers/specs/  o documento de design que originou o projeto
```

Todo o texto vive em `src/content/`. Trocar uma fala, uma ilha da rota ou um
tripulante não exige tocar em componente nenhum.

## Decisões que valem saber

**O palco das seções fixas usa `position: sticky`, não o `pin` do
ScrollTrigger.** Sticky não cria pin-spacer, não desloca o resto da página e
não depende de remedição depois que as imagens carregam.

**O Lenis só emite evento para o scroll que ele mesmo conduz.** Um scroll
programático — âncora, tecla Home, restauração de posição ao recarregar —
deixaria o ScrollTrigger com a posição antiga, então há um listener nativo de
`scroll` como rede de segurança em `src/lib/smooth-scroll.tsx`.

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
