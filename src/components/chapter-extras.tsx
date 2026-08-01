import Image from "next/image";
import { CREW } from "@/content/crew";
import { MOMENTS } from "@/content/moments";
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
    <div className="flex w-full gap-[1.2rem] overflow-x-auto pb-[0.4rem] lg:grid lg:grid-cols-[repeat(5,9rem)] lg:justify-center lg:gap-x-[1.6rem] lg:gap-y-[1.8rem] lg:overflow-visible lg:pb-0">
      {CREW.map((mate, i) => (
        /* Cartaz de procurado — papel-pergaminho, moldura dupla e uma
           rotação mínima alternada: dez cartazes pregados num mural, não
           dez cards de interface. Tudo CSS em cima do retrato que já
           existia; texto vivo (nada de arte gerada com texto embutido). */
        <article
          key={mate.id}
          className="w-[9rem] shrink-0 px-[0.55rem] pt-[0.5rem] pb-[0.45rem] text-center shadow-[0_0.4rem_1rem_rgb(0_0_0/0.35)]"
          style={{
            background:
              "linear-gradient(160deg, #efe3c0 0%, #e6d5a8 55%, #d9c48f 100%)",
            border: "1px solid #8a6f3f",
            outline: "1px solid rgb(59 42 24 / 0.55)",
            outlineOffset: "-0.28rem",
            color: "#3b2a18",
            transform: `rotate(${i % 2 === 0 ? -0.7 : 0.7}deg)`,
          }}
        >
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              letterSpacing: "0.04em",
            }}
          >
            WANTED
          </p>
          <div
            className="relative mx-auto mt-[0.35rem] aspect-[4/5] w-full overflow-hidden"
            style={{ border: "1px solid rgb(59 42 24 / 0.5)" }}
          >
            <Image
              src={mate.portrait}
              alt={`Cartaz de procurado de ${mate.name}, ${mate.role.toLowerCase()} dos Chapéus de Palha`}
              fill
              sizes="9rem"
              className="object-cover object-top"
              style={{ filter: "sepia(0.28) contrast(1.05) saturate(0.9)" }}
            />
          </div>
          <p
            className="mt-[0.35rem] leading-none font-semibold"
            style={{ fontSize: "0.5rem", letterSpacing: "0.32em" }}
          >
            DEAD OR ALIVE
          </p>
          <p
            className="mt-[0.3rem] truncate leading-none uppercase"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.78rem",
              letterSpacing: "0.03em",
            }}
          >
            {mate.name}
          </p>
          <p
            className="t-nums mt-[0.3rem] leading-none font-bold"
            style={{ fontSize: "0.72rem" }}
          >
            {/* ฿ é o símbolo do Berry nos cartazes da obra */}
            <span aria-hidden>฿</span> {mate.bounty}
          </p>
          {/* a letra miúda do cartaz guarda o que o card antigo contava */}
          <p
            className="mt-[0.35rem] truncate leading-none"
            style={{ fontSize: "0.48rem", letterSpacing: "0.06em", opacity: 0.75 }}
          >
            {mate.role} · {mate.dream}
          </p>
          <p
            className="mt-[0.3rem] leading-none"
            style={{ fontSize: "0.42rem", letterSpacing: "0.4em", opacity: 0.5 }}
          >
            MARINE
          </p>
        </article>
      ))}
    </div>
  );
}

/**
 * Os oito momentos da jornada — grade estática, sem GSAP/ScrollTrigger
 * próprio (mesma regra do CrewPanel e do MapPanel: nada aqui pode animar por
 * conta própria dentro de uma faixa fixada). Duas fileiras de 4 no desktop —
 * com 8 cards numa fileira só o painel de 100vw ganharia um scroller
 * aninhado, que é exatamente o que a spec proíbe.
 *
 * Todos os 8 momentos têm arte própria (`public/art/moment-*.webp`, sete
 * arquivos, mais `execution.webp` reaproveitado do capítulo 01 pro primeiro
 * momento — a mesma cena, a execução de Roger). `line-clamp` na descrição
 * garante que nenhum card estoura a altura do painel mesmo quando o texto
 * de um momento é mais longo que o de outro.
 */
export function MomentsPanel() {
  return (
    <div className="grid w-full grid-cols-2 gap-x-[1.4rem] gap-y-[1.8rem] sm:grid-cols-4">
      {MOMENTS.map((moment) => (
        <article key={moment.title} className="flex flex-col gap-[0.5rem]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={moment.scene}
              alt=""
              fill
              sizes="(max-width: 991px) 45vw, 22vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="t-micro ink-faint">
              {moment.marker} · {moment.place}
              {moment.ongoing && <span className="normal-case"> · em curso</span>}
            </p>
            <p
              className="t-cap ink-soft mt-[0.25rem] truncate font-semibold"
              style={{ fontSize: "0.8rem" }}
            >
              {moment.title}
            </p>
            <p
              className="line-clamp-3 mt-[0.25rem] text-cream/55"
              style={{ fontSize: "0.66rem", lineHeight: 1.35 }}
            >
              {moment.description}
            </p>
          </div>
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
