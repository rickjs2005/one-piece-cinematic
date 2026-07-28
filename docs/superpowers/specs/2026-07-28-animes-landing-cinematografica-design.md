# Animes — Landing Cinematográfica (Imu / O Trono Vazio)

**Data:** 2026-07-28
**Status:** Design aprovado

## Objetivo

Landing page de um único universo (One Piece — Imu e o Trono Vazio) cujo hero é uma
cena cinematográfica revelada pelo scroll: começa em escuridão total com dois olhos
carmesins e termina no trono dourado inteiro, com espadas em primeiro plano.

O site é a peça. Não há catálogo, backend, autenticação ou banco de dados.

## Não-objetivos

- Nenhum backend, API, banco ou CMS.
- Nenhuma imagem de personagem inventada ou placeholder cinza. Onde não há arte
  real disponível, a solução é tipográfica/silhueta (ver seção Os Cinco Anciães).
- Nenhum vídeo. A cena é construída em camadas DOM/SVG.

## Stack

| Item | Escolha | Motivo |
|---|---|---|
| Framework | Next 16, App Router, TypeScript | Padrão dos outros projetos cinematográficos do usuário |
| Estilo | Tailwind CSS 4 | idem |
| Animação | GSAP 3 + ScrollTrigger + @gsap/react | Scrub preciso e timeline única |
| Scroll | Lenis | Suavização que alimenta o ScrollTrigger |
| Deploy | Estático (Vercel) | Sem runtime server |

Sem `three`/R3F: a cena é 2D em camadas, não precisa de WebGL.

## Estrutura de arquivos

```
src/app/layout.tsx          fontes, metadata, <SmoothScroll>
src/app/page.tsx            composição das seções
src/app/globals.css         tokens de cor, base

src/components/hero/ThroneHero.tsx        orquestrador: pin + timeline mestre
src/components/hero/layers/EyesLayer.tsx      SVG procedural dos olhos
src/components/hero/layers/ArtCloseLayer.tsx  eyes.webp
src/components/hero/layers/ArtThroneLayer.tsx throne.webp
src/components/hero/layers/LightRaysLayer.tsx SVG de feixes volumétricos
src/components/hero/layers/SwordsLayer.tsx    faixa inferior de throne.webp
src/components/hero/layers/DarknessMask.tsx   radial-gradient preto

src/components/sections/Manifesto.tsx
src/components/sections/Elders.tsx
src/components/sections/Timeline.tsx
src/components/sections/Lore.tsx

src/components/ui/Reveal.tsx        wrapper de entrada por scroll
src/components/ui/SplitText.tsx     quebra texto em spans animáveis

src/lib/smooth-scroll.tsx           Lenis + ScrollTrigger.update
src/lib/hero-timeline.ts            constrói a timeline (testável isolada)
src/content/elders.ts               dados dos Cinco Anciães
src/content/arcs.ts                 dados da linha do tempo
src/content/lore.ts                 dados dos blocos de lore

public/art/eyes.webp                close dos olhos do Imu
public/art/throne.webp              trono vazio completo
```

Cada camada do hero é um componente isolado que recebe apenas uma `ref` e não
conhece a timeline. Quem conhece a timeline é `hero-timeline.ts`, que recebe as
refs e devolve uma `gsap.timeline`. Isso permite alterar o ritmo da cena sem tocar
em nenhuma camada, e testar a timeline sem DOM real.

## Hero — especificação da cena

Seção de 400vh com um palco `position: sticky`, uma única `gsap.timeline` com
`scrub: 1`. Progresso 0 → 1 mapeado assim:

> **Desvio da primeira versão deste spec:** o palco usa `sticky`, não o `pin` do
> ScrollTrigger. Sticky não cria pin-spacer, não desloca o resto da página e não
> precisa de `ScrollTrigger.refresh()` depois que as imagens carregam — a altura
> do gatilho é 400vh fixos e não depende do conteúdo. Isso elimina a fragilidade
> que este spec originalmente listava como risco.

Ordem de empilhamento, de baixo para cima:

| z | Camada | Propriedade | 0% | 100% |
|---|---|---|---|---|
| 10 | Arte trono | scale, blur, opacity | 3.0, blur 10px, opacity 0 | fade-in 48%, scale 1.0, blur 0 |
| 15 | Raios de luz | opacity, scaleY | 0 | 0.7 a partir de 45% |
| 20 | Arte close | scale, opacity | 2.8, opacity 0 | fade-in 18%, fade-out 55%, scale 1.0 |
| 30 | **Máscara escuridão** | scale, opacity | 1.0, opacity 1 | 1.45, opacity 0.5 |
| 40 | **Olhos (SVG)** | scale, opacity | close absoluto, opacity 1 | some em 30% |
| 50 | Espadas | y, blur | fora da tela | entra em 75%, blur 8px |

A máscara de escuridão é um overlay com `radial-gradient` **estático**; o que anima
é `scale` + `opacity`, ambos compositados na GPU.

**Desvio da primeira versão deste spec:** ela previa animar o raio do gradiente via
custom property `--reveal`. Na implementação ficou claro que isso repinta a tela
inteira a cada frame sem ganho visual, porque quem de fato revela a cena é a
opacidade das próprias camadas de arte (que sobem de 0 sobre um fundo já preto). O
papel real da máscara é a vinheta — manter as bordas escuras para que a revelação
leia como luz se abrindo do centro em vez de um crossfade chapado. Escala e
opacidade entregam isso de graça.

A escala só cresce (1 → 1.45) e nunca encolhe: assim a camada cobre a viewport
inteira em qualquer ponto da timeline. Encolher abriria os cantos e as artes
vazariam sem vinheta.

**A máscara fica abaixo dos olhos, e isso é obrigatório.** Ela existe para esconder as
artes (z10–z20) enquanto o scroll não avança; os olhos precisam brilhar *através* da
escuridão total, que é exatamente a Cena 1 do storyboard. Se a máscara subisse acima
dos olhos, a tela ficaria 100% preta em 0% de scroll e a cena de abertura não existiria.
As espadas ficam acima da máscara porque só entram em 75%, quando a cena já está
revelada, e precisam ler como primeiro plano.

### Por que os olhos são SVG e não imagem

Os primeiros 30% da cena precisam de piscada lenta, pulso de brilho e um dolly-out
contínuo. Uma imagem raster escalada 3x nesse trecho apareceria pixelada e não
poderia piscar. Dois grupos SVG (esclera + íris + pupila + `feGaussianBlur` para o
glow) resolvem os três requisitos com controle exato.

A piscada roda em uma tween própria, independente do scroll (repeat infinito,
intervalo ~4.5s), para que a cena tenha vida mesmo com o scroll parado.

### Acessibilidade e performance

- `prefers-reduced-motion: reduce` → sem pin, sem scrub; o hero renderiza
  diretamente o frame final (trono completo, revelado) como imagem estática.
- Viewport < 768px: pin mantido, `filter: blur()` desativado em todas as camadas
  (custo de GPU em mobile), escalas iniciais reduzidas de 3.0 → 2.0.
- Todas as camadas usam apenas `transform` e `opacity` (compositadas na GPU).
  `will-change` aplicado só durante o pin, removido no `onLeave`.
- As duas artes entram via `next/image` com `priority` e `sizes="100vw"`.

## Seções pós-hero

### 1. Manifesto
Tela cheia, fundo preto. Uma frase — *"O trono nunca esteve vazio."* — em Instrument
Serif no tamanho máximo que couber, revelada caractere a caractere conforme o scroll.
Sem outro elemento.

### 2. Os Cinco Anciães
Scroll horizontal dirigido pelo scroll vertical (ScrollTrigger + `x: -100%`).
Seis cards: Imu + os cinco Gorosei.

**Restrição assumida:** não há arte disponível dos personagens. Os cards são
compostos por silhueta em SVG, o nome em display, o título em caixa alta espaçada e
uma linha de mistério — com acento carmesim no hover. Nenhuma imagem falsa e nenhum
retângulo cinza de placeholder.

### 3. Linha do Tempo
Timeline vertical dos arcos da saga final. Cada entrada revela ano/arco/descrição em
sequência conforme entra na viewport. Uma linha vertical carmesim cresce em `scaleY`
acompanhando o progresso.

### 4. Segredos do Mundo
Três blocos de lore (o Século Vazio, os Poneglyphs, o Governo Mundial). Cada bloco
começa com o texto mascarado e se desvenda por `clip-path` conforme o scroll,
espelhando a lógica de revelação do hero.

### 5. Rodapé
Wordmark, uma linha de crédito da arte, nada mais.

## Design system

```
--void:     #030203   fundo, preto absoluto
--crimson:  #E5153F   acento principal
--glow:     #FF2D55   apenas para brilho/sombra dos olhos
--gold:     #D4A63C   detalhes do trono, filetes
--mist:     #7C93AE   névoa azul do quadro do trono, textos secundários
--parchment:#E8E2D6   texto principal (nunca branco puro)
```

Tipografia: **Instrument Serif** (títulos e display, com italic para ênfase) +
**Inter** com tracking apertado para corpo e labels. Nenhum branco puro em nenhum
elemento — o mais claro é `--parchment`.

## Tratamento de erros

Superfície de erro é mínima (site estático). Os pontos reais:

- **GSAP/ScrollTrigger antes da hidratação:** toda inicialização dentro de
  `useGSAP` com `scope`. Com o palco em `sticky` o `refresh()` pós-load deixou de
  ser necessário; onde a medição depende de conteúdo (a trilha horizontal dos
  Anciães) o valor é passado como função com `invalidateOnRefresh: true`.
- **Falha ao carregar as artes:** o hero degrada para a camada de olhos SVG +
  escuridão, que é auto-suficiente e não depende de nenhum arquivo externo.
- **Lenis indisponível:** o scroll nativo continua funcionando; o ScrollTrigger não
  depende do Lenis para operar, apenas para suavizar.

## Verificação

- `npm run build` sem erros e sem warning de tipo.
- `npm run lint` limpo.
- Hero verificado no navegador em 1440px e em viewport mobile: os seis marcos da
  timeline (olhos → close → trono → raios → espadas → título) acontecem nas
  porcentagens especificadas.
- `prefers-reduced-motion` forçado: página utilizável, sem pin, sem movimento.
- Lighthouse: sem CLS causado pelo pin.

## Fora de escopo desta iteração

- Vídeo gerado por IA no hero (a estrutura em camadas permite trocar depois sem
  refazer as seções).
- Trilha sonora / vento ambiente.
- Múltiplas páginas ou rotas.
