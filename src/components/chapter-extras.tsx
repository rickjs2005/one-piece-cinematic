import Image from "next/image";
import { CREW } from "@/content/crew";
import { ROUTE, ROUTE_PATH, SEAS, WORLD } from "@/content/route";

/* --------------------------------------------------------------------------
   Painéis extras dos capítulos — CrewPanel e MapPanel.

   Miolo migrado de `sections/Crew.tsx` e `sections/GrandLineMap.tsx`, mas
   SEM nenhuma animação própria: quando entram como `extra` de um capítulo,
   eles vivem DENTRO da faixa fixada (`chapter-track`) e são arrastados pela
   MESMA timeline horizontal do capítulo. Um ScrollTrigger próprio aqui
   dispararia fora de sincronia com o pin do capítulo — por isso a rota já
   nasce traçada e os retratos já nascem no lugar, estáticos.
   -------------------------------------------------------------------------- */

/**
 * A tripulação, em grade — estática.
 *
 * Era uma fileira horizontal de 10 cards de 16rem (`overflow-x-auto`): a
 * 96rem/88vw úteis do painel, isso soma 2848px de conteúdo contra ~1408px de
 * largura visível — 6 tripulantes ficavam escondidos atrás do scroll interno,
 * quebrando a promessa de "nenhum conteúdo se perde". No desktop vira grade
 * 5×2 de cards de 8,5rem: os 10 cabem inteiros, sem scroller aninhado. Só o
 * mobile mantém a fileira com scroll — lá 5 colunas ficariam ilegíveis.
 */
export function CrewPanel() {
  return (
    <div className="flex w-full gap-[1.2rem] overflow-x-auto pb-[0.4rem] lg:grid lg:grid-cols-[repeat(5,8.5rem)] lg:justify-center lg:gap-x-[1.8rem] lg:gap-y-[2.4rem] lg:overflow-visible lg:pb-0">
      {CREW.map((mate) => (
        <article key={mate.id} className="w-[8.5rem] shrink-0">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={mate.portrait}
              alt={`${mate.name}, ${mate.role.toLowerCase()} dos Chapéus de Palha`}
              fill
              sizes="8.5rem"
              className="object-cover object-top"
            />
          </div>
          <p className="t-micro ink-soft mt-[0.6rem] truncate">{mate.name}</p>
          <p
            className="t-cap ink-faint mt-[0.15rem] truncate"
            style={{ fontSize: "0.6rem" }}
          >
            {mate.role} · {mate.dream}
          </p>
        </article>
      ))}
    </div>
  );
}

/** A carta náutica do mundo, com a rota já traçada — estática. */
export function MapPanel() {
  const gl = WORLD.grandLine;

  return (
    <div className="mx-auto" style={{ width: "min(88vw, 96rem)" }}>
      <svg
        viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full"
        role="img"
        aria-label="Mapa do mundo: a Red Line na vertical, a Grand Line na horizontal, os quatro Blues nos quadrantes, e a rota dos Chapéus de Palha de Vila Foosha até Laugh Tale"
      >
        <defs>
          <linearGradient id="routeInk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-surf)" />
            <stop offset="45%" stopColor="var(--color-gold)" />
            <stop offset="100%" stopColor="var(--color-blood)" />
          </linearGradient>

          {/* Hachura dos Calm Belts: mar sem vento e sem corrente. */}
          <pattern
            id="calmBelt"
            width="10"
            height="10"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="var(--color-parchment)"
              strokeOpacity="0.14"
              strokeWidth="2"
            />
          </pattern>
        </defs>

        {/* Mar */}
        <rect width={WORLD.width} height={WORLD.height} fill="#070d18" />

        {/* Graticulado da carta */}
        <g stroke="var(--color-parchment)" strokeOpacity="0.045">
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`v${i}`} x1={i * 55} y1="0" x2={i * 55} y2={WORLD.height} />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 55} x2={WORLD.width} y2={i * 55} />
          ))}
        </g>

        {/* Calm Belts */}
        {[WORLD.calmBeltTop, WORLD.calmBeltBottom].map((belt, i) => (
          <rect
            key={`belt-${i}`}
            y={belt.top}
            width={WORLD.width}
            height={belt.bottom - belt.top}
            fill="url(#calmBelt)"
          />
        ))}

        {/* Grand Line */}
        <rect
          y={gl.top}
          width={WORLD.width}
          height={gl.bottom - gl.top}
          fill="var(--color-surf)"
          fillOpacity="0.07"
        />
        <line
          x1="0"
          y1={(gl.top + gl.bottom) / 2}
          x2={WORLD.width}
          y2={(gl.top + gl.bottom) / 2}
          stroke="var(--color-surf)"
          strokeOpacity="0.28"
          strokeDasharray="3 7"
        />

        {/* Red Line — a mesma parede, vista dos dois lados do mapa. */}
        {[WORLD.redLineLeft, WORLD.redLineRight].map((wall, i) => (
          <g key={`wall-${i}`}>
            <rect x={wall.left} width={wall.right - wall.left} height={WORLD.height} fill="#2a1c22" />
            <rect
              x={wall.left}
              width={wall.right - wall.left}
              height={WORLD.height}
              fill="var(--color-blood)"
              fillOpacity="0.1"
            />
            <line
              x1={wall.left}
              y1="0"
              x2={wall.left}
              y2={WORLD.height}
              stroke="var(--color-blood)"
              strokeOpacity="0.4"
            />
            <line
              x1={wall.right}
              y1="0"
              x2={wall.right}
              y2={WORLD.height}
              stroke="var(--color-blood)"
              strokeOpacity="0.4"
            />
          </g>
        ))}

        <text
          x={WORLD.redLineRight.left - 12}
          y="34"
          textAnchor="end"
          className="label-caps"
          fill="var(--color-blood)"
          fillOpacity="0.75"
          fontSize="11"
          letterSpacing="3"
        >
          RED LINE
        </text>

        {/* Nomes dos mares */}
        {SEAS.map((sea) => (
          <text
            key={sea.name}
            x={sea.x}
            y={sea.y}
            textAnchor="middle"
            fill="var(--color-fog)"
            fillOpacity="0.45"
            fontSize="14"
            letterSpacing="5"
          >
            {sea.name.toUpperCase()}
          </text>
        ))}

        {/* Metades da Grand Line */}
        <text
          x={(WORLD.redLineLeft.right + WORLD.redLineRight.left) / 2}
          y={gl.top - 12}
          textAnchor="middle"
          fill="var(--color-surf)"
          fillOpacity="0.5"
          fontSize="12"
          letterSpacing="5"
        >
          PARADISE
        </text>
        <text
          x={(WORLD.redLineRight.right + WORLD.width) / 2}
          y={gl.top - 12}
          textAnchor="middle"
          fill="var(--color-blood)"
          fillOpacity="0.6"
          fontSize="12"
          letterSpacing="4"
        >
          NOVO MUNDO
        </text>

        {/* A rota — já inteira e traçada, sem draw-on-scroll. */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="url(#routeInk)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {ROUTE.map((island) => (
          <g key={island.id} transform={`translate(${island.x} ${island.y})`}>
            <circle
              r={island.major ? 5.5 : 3.2}
              fill="var(--color-abyss)"
              stroke={island.major ? "var(--color-gold)" : "var(--color-surf)"}
              strokeWidth="2"
            />
            <text
              y={island.below ? (island.major ? 17 : 14) : island.major ? -13 : -9}
              textAnchor="middle"
              className="font-display"
              fill="var(--color-parchment)"
              fontSize={island.major ? 14 : 10}
              opacity={island.major ? 0.95 : 0.55}
            >
              {island.name}
            </text>
            {island.major && island.note && (
              // Ilhas perto da borda esquerda do viewBox (Vila Foosha, x=55)
              // cortavam a legenda: texto centralizado por x=55 com ~19
              // caracteres de largura ultrapassa x=0 do lado esquerdo e o SVG
              // recorta o que sai do viewBox. Perto da borda, ancora pela
              // esquerda e desloca o rótulo pra a direita do marco em vez de
              // centralizar nele — dá folga sem mexer no viewBox inteiro.
              <text
                x={island.x < 70 ? 10 : 0}
                y={island.below ? 30 : 17}
                textAnchor={island.x < 70 ? "start" : "middle"}
                fill="var(--color-fog)"
                fontSize="9"
                letterSpacing="1"
              >
                {island.note}
              </text>
            )}
          </g>
        ))}

        {/* Navio parado no fim da rota — Laugh Tale, sem confirmar nada. */}
        <g transform={`translate(${ROUTE[ROUTE.length - 1].x} ${ROUTE[ROUTE.length - 1].y - 14})`}>
          <path d="M 0 -7 L 5.5 5.5 L 0 2.5 L -5.5 5.5 Z" fill="var(--color-parchment)" />
        </g>
      </svg>
    </div>
  );
}
