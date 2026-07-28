"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ROUTE, ROUTE_PATH, SEAS, WORLD } from "@/content/route";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Carta náutica do mundo, com a rota se desenhando sobre ela.
 *
 * O fundo é o mapa de verdade: a Red Line cortando na vertical (duas vezes,
 * porque é um anel achatado num retângulo), a Grand Line na horizontal, os
 * Calm Belts hachurados de cada lado dela e os quatro Blues nos quadrantes.
 *
 * A linha usa `stroke-dasharray`/`dashoffset`: o traço inteiro vira um único
 * tracinho do comprimento da curva, deslocado para fora, e o scroll traz o
 * deslocamento a zero. O comprimento é medido no próprio elemento com
 * `getTotalLength()`, então mexer nas coordenadas em `route.ts` não exige
 * recalcular nada aqui.
 */
export function GrandLineMap() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path = root.current?.querySelector<SVGPathElement>("[data-route]");
        if (!path) return;

        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });

        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

        // O navio segue a mesma curva, sempre na ponta da linha.
        const ship = root.current?.querySelector<SVGGElement>("[data-ship]");
        if (ship) {
          tl.to(
            {},
            {
              duration: 1,
              ease: "none",
              onUpdate: function () {
                const point = path.getPointAtLength(this.progress() * length);
                gsap.set(ship, { x: point.x, y: point.y });
              },
            },
            0,
          );
        }

        ROUTE.forEach((island, index) => {
          const at = index / (ROUTE.length - 1);
          tl.to(
            `[data-island="${island.id}"]`,
            { opacity: 1, duration: 0.02, ease: "power2.out" },
            Math.max(0, at - 0.012),
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const gl = WORLD.grandLine;

  return (
    <section
      ref={root}
      className="relative h-[420svh] motion-reduce:h-auto"
      aria-label="A rota até o fim do mapa"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-6 md:px-16 motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <span className="label-caps text-blood">
              De East Blue até o fim do mapa
            </span>
            <h2 className="display mt-3 text-[clamp(2rem,6vw,5rem)]">
              A <span className="text-hollow">Rota</span>
            </h2>
          </div>
          <p className="text-fog max-w-sm text-sm leading-relaxed">
            A Grand Line e a Red Line são dois anéis em volta do mundo. Achatar
            isso num retângulo faz a Red Line aparecer duas vezes — é a mesma
            parede.
          </p>
        </header>

        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
            preserveAspectRatio="xMidYMid meet"
            className="h-auto max-h-[58svh] w-full min-w-[900px]"
            role="img"
            aria-label="Mapa do mundo: a Red Line na vertical, a Grand Line na horizontal, os quatro Blues nos quadrantes, e a rota dos Chapéus de Palha de Vila Foosha até Laugh Tale"
          >
            <defs>
              <linearGradient id="routeInk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-surf)" />
                <stop offset="45%" stopColor="var(--color-gold)" />
                <stop offset="100%" stopColor="var(--color-blood)" />
              </linearGradient>

              {/* Hachura dos Calm Belts: mar sem vento e sem corrente, cheio de
                  Reis do Mar. No mapa vira zona proibida. */}
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
            <rect
              width={WORLD.width}
              height={WORLD.height}
              fill="#070d18"
            />

            {/* Graticulado da carta */}
            <g stroke="var(--color-parchment)" strokeOpacity="0.045">
              {Array.from({ length: 19 }, (_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 55}
                  y1="0"
                  x2={i * 55}
                  y2={WORLD.height}
                />
              ))}
              {Array.from({ length: 9 }, (_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 55}
                  x2={WORLD.width}
                  y2={i * 55}
                />
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
                <rect
                  x={wall.left}
                  width={wall.right - wall.left}
                  height={WORLD.height}
                  fill="#2a1c22"
                />
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

            {/* Traço fantasma: o caminho inteiro, para a seção não parecer
                vazia antes de o scroll começar. */}
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="var(--color-parchment)"
              strokeOpacity="0.1"
              strokeWidth="1.5"
              strokeDasharray="5 8"
            />

            <path
              data-route
              d={ROUTE_PATH}
              fill="none"
              stroke="url(#routeInk)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {ROUTE.map((island) => (
              <g
                key={island.id}
                data-island={island.id}
                className="opacity-0"
                transform={`translate(${island.x} ${island.y})`}
              >
                <circle
                  r={island.major ? 5.5 : 3.2}
                  fill="var(--color-abyss)"
                  stroke={
                    island.major ? "var(--color-gold)" : "var(--color-surf)"
                  }
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
                  // A legenda fica sempre do lado oposto ao nome. Antes ela
                  // subia junto quando o nome estava em cima, e as duas linhas
                  // brigavam com o rótulo da ilha vizinha.
                  <text
                    y={island.below ? 30 : 17}
                    textAnchor="middle"
                    fill="var(--color-fog)"
                    fontSize="9"
                    letterSpacing="1"
                  >
                    {island.note}
                  </text>
                )}
              </g>
            ))}

            {/* Navio na ponta da linha. */}
            <g data-ship>
              <path
                d="M 0 -7 L 5.5 5.5 L 0 2.5 L -5.5 5.5 Z"
                fill="var(--color-parchment)"
              />
            </g>
          </svg>
        </div>

        <p className="text-fog mt-5 max-w-3xl text-sm leading-relaxed">
          Em Sabaody a rota não atravessa a Red Line — ela mergulha 10.000
          metros até a Ilha dos Homens-Peixe e sobe do outro lado, já no Novo
          Mundo. Laugh Tale fica no fim da linha, onde ninguém confirmou ainda.
        </p>
      </div>
    </section>
  );
}
