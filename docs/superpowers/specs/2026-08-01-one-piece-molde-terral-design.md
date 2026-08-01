# One Piece no molde TERRAL — redesign editorial em capítulos

**Data:** 2026-08-01
**Projeto:** `projetos/animes` — "One Piece — A história que o mundo tentou apagar"
**Referência:** `projetos/terral` (redesign de 30-31/07/2026) — jornada editorial em
5 capítulos horizontais fixados, tipografia gigante como cena, rodapé-jornal e
página-recompensa escondida.

## Objetivo

Refazer o site do animes na estrutura completa do TERRAL, adaptada ao universo
One Piece, com mídia nova (vídeo + fotografia cinematográfica) gerada no
Higgsfield (~102 créditos disponíveis). Nenhum conteúdo textual se perde: as
seções atuais são remapeadas para dentro dos capítulos.

## Estrutura da página

| Ordem | Seção | Origem |
|---|---|---|
| 1 | Preloader | mantém o atual |
| 2 | Hero — trono em vídeo scrubado + título gigante ONE PIECE no molde terral | `ThroneHero` atual, retrabalhado |
| 3 | Intro/Manifesto no formato do terral (o "ar" antes dos capítulos) | `Manifesto` atual, reescrito |
| 4 | Capítulos 01–05 fixados (sticky, faixa horizontal ~350vw cada) | novo, portado de `terral/chapter.tsx` |
| 5 | As Falas — vitrine editorial pós-capítulos | `Voices` atual no molde de `coffees.tsx` |
| 6 | Rodapé-jornal: letreiro ONE PIECE, marquee, pista escondida | novo, molde `site-footer.tsx` |
| — | `/laugh-tale` — página-recompensa (botão SEGURE de 6s) | novo, molde `casa-do-torrador` |

Seções atuais absorvidas: `Era` → cap 01 · `Crew` → cap 02 · `GrandLineMap` →
cap 03 · `FlagReveal` + `Moments` → cap 04 · `Voices` → vitrine. O `Marquee`
migra pro rodapé-jornal.

## Os cinco capítulos

Cada capítulo segue o contrato do `chapters.ts` do terral: painel de abertura
(título stencil + numeral gigante), painel largo (manchete em 3 linhas com uma
linha "quente" + cluster editorial de 3 fotos), mídia em sangria (vídeo com
poster + 3 stats deslizando por cima) e lead revelado palavra a palavra.

Progressão de cor no padrão terral — campos CHAPADOS e saturados, 4 escuros e o
último CLARO como batida de contraste:

| # | Capítulo | Kicker | Tema | Cor (direção) |
|---|---|---|---|---|
| 01 | A EXECUÇÃO | A palavra | Roger, a frase, os portos soltando navios (`era.ts`) | aço frio de Loguetown, acento sangue |
| 02 | A TRIPULAÇÃO | Os dez | os Chapéus de Palha (`crew.ts`) | ocre palha (o chapéu), tinta creme |
| 03 | A ROTA | O mapa | geografia real do mundo + mergulho de 10.000 m (`route.ts`, SVG atual como painel interno) | azul profundo de mar, acento espuma |
| 04 | AS GUERRAS | As bandeiras | Enies Lobby, Marineford, Wano (`moments.ts` + `FlagReveal`) | vermelho de guerra/brasa |
| 05 | O AMANHECER | A herança | a vontade herdada, o Dawn da obra | CLARO — osso, tinta escura, acento vermelhão |

Manchetes de partida (refináveis na implementação, mantendo 3 linhas + 1 quente):
01 "Uma frase / soltou o mundo / no mar." · 02 "Dez pessoas, / um mastro, / um chapéu." ·
03 "O mapa acaba, / o mar / continua." · 04 "Algumas bandeiras / queimaram / primeiro." ·
05 "O amanhecer / que alguém / prometeu."

Stats de partida: 01 → 22 anos / 1 dia / 3 milhões na praça · 02 → 10 tripulantes /
4 mares de origem / 1 bandeira · 03 → 10.000 m / 21 ilhas / 2 anéis · 04 → 20 anos
de espera / 5 guerras / 0 recuos · 05 → números da herança (definir com o copy).
Números conferidos contra `src/content/` na implementação.

## Mídia — plano Higgsfield (~102 créditos)

Convenção de assets idêntica ao terral: `public/shot/<key>/full.mp4`,
`full.webp` (poster e fallback), `a|b|c.webp` (cluster).

1. **Imagens primeiro** (baratas): 5 posters + 15 clusters no mesmo estilo
   pictórico das 33 artes atuais (consistência com `public/art/`). Gerar,
   aprovar, passar por `scripts/downscale-art.mjs` antes de commitar.
2. **Vídeos depois** (caros): 5 loops curtos e lentos via image-to-video a
   partir dos posters aprovados — mar/execução, bandeira ao vento, tempestade
   da rota, fumaça de guerra, amanhecer.
3. **Fallback de orçamento:** se os créditos apertarem, vídeos são gerados na
   ordem 01→05 e os capítulos restantes ficam com poster + parallax (o layout
   do terral já prevê foto no lugar do vídeo — é o comportamento
   reduced-motion/dados limitados).

As artes existentes continuam nos painéis internos (galeria da crew, momentos,
falas, mapa).

## `/laugh-tale` — a recompensa

Pista escondida no rodapé-jornal (como no terral). A página tem o botão
**SEGURE** de 6 segundos ("a travessia final"); quem segura "chega ao fim do
mapa": peça editorial de recompensa — a risada, a mensagem da herança e as
artes em alta pra download. Sem cupom (não é loja): o tesouro é conteúdo.

## Técnica

- **Mesma arquitetura do terral:** palco `position: sticky` (nunca pin do
  ScrollTrigger — o animes já segue isso), Lenis só em `pointer: fine`, um
  relógio só para scrub.
- **Portar, não reescrever:** `chapter.tsx`, `coffees.tsx`, `site-footer.tsx`,
  `hold-button.tsx`, `svg-word.tsx` e `chapters.ts` copiados do terral e
  adaptados (conteúdo, cores, glifos, cenas). O terral é a fonte da verdade do
  comportamento.
- **Conteúdo em `src/content/`** (padrão do projeto): novo `chapters.ts` do
  lado do conteúdo; componentes não carregam texto.
- **`prefers-reduced-motion`:** quadro final estático, vídeos viram posters,
  galerias viram scroll comum (regra já vigente no projeto).
- **Lições registradas no README continuam valendo:** artes pelo
  `downscale-art.mjs`, nada de `feTurbulence` em tela cheia.
- Stack já compatível (Next 16 + Tailwind 4 + GSAP + Lenis); sem dependência
  nova.

## Fora de escopo

- Loja AKATSUKI (projeto separado) — este site segue sem e-commerce.
- Backend/API — continua estático.
- Deploy: ao final, push pro GitHub **antes** de `vercel --prod` (regra do
  Rick); alias/Deployment Protection seguem os gotchas anotados do terral.

## Critérios de sucesso

- Scroll do topo ao rodapé lê como o terral: ritmo de capítulos, cor por
  capítulo, tipografia gigante, mídia em sangria com stats.
- Verificação VISUAL obrigatória (Playwright, olhar screenshots) — nunca
  aprovar scrub só por code review; repetir contra produção após deploy.
- Lighthouse/performance no nível do projeto atual (as lições de 2K e
  feTurbulence não regridem).
