"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ROUTE, ROUTE_PATH } from "@/content/route";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A rota, desenhando-se com o scroll.
 *
 * A linha usa a técnica de `stroke-dasharray`/`dashoffset`: o traço inteiro
 * vira um único "tracinho" do comprimento da curva, deslocado para fora, e o
 * scroll traz o deslocamento a zero. O comprimento é medido no próprio
 * elemento com `getTotalLength()`, então mudar as coordenadas em `route.ts`
 * não exige recalcular nada aqui.
 *
 * As ilhas acendem uma a uma conforme a linha passa por elas. O momento de
 * acender é derivado da posição da ilha no traçado — não de um atraso fixo —
 * senão o ponto acenderia antes ou depois de a linha chegar.
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
          // Fração do traçado em que a ilha aparece. Usa o índice porque a
          // curva passa pelas ilhas em intervalos regulares de segmento.
          const at = index / (ROUTE.length - 1);

          tl.to(
            `[data-island="${island.id}"]`,
            { opacity: 1, scale: 1, duration: 0.02, ease: "back.out(2)" },
            Math.max(0, at - 0.01),
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative h-[420svh] motion-reduce:h-auto"
      aria-label="A rota até o fim do mapa"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-6 md:px-16 motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <header className="mb-8">
          <span className="label-caps text-blood">
            De East Blue até o fim do mapa
          </span>
          <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
            A <span className="text-hollow">Rota</span>
          </h2>
        </header>

        <div className="relative w-full overflow-x-auto">
          {/* A largura manda e o `max-h` é a rede de segurança para telas
              baixas. O viewBox é uma tira larga (1000×320) para casar com o
              espaço que sobra dentro do palco fixo — com uma razão mais alta,
              o SVG era centralizado e desperdiçava metade da largura. */}
          <svg
            viewBox="0 0 1000 320"
            preserveAspectRatio="xMidYMid meet"
            className="h-auto max-h-[52svh] w-full min-w-[880px]"
            role="img"
            aria-label="Mapa da rota dos Chapéus de Palha, de Vila Foosha até Laugh Tale"
          >
            <defs>
              <linearGradient id="routeInk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-surf)" />
                <stop offset="55%" stopColor="var(--color-gold)" />
                <stop offset="100%" stopColor="var(--color-blood)" />
              </linearGradient>
            </defs>

            {/* Traço fantasma: mostra o caminho inteiro desde o início, para
                que a seção não pareça vazia antes do scroll. */}
            <path
              d={ROUTE_PATH}
              fill="none"
              stroke="var(--color-parchment)"
              strokeOpacity="0.08"
              strokeWidth="2"
              strokeDasharray="6 10"
            />

            <path
              data-route
              d={ROUTE_PATH}
              fill="none"
              stroke="url(#routeInk)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {ROUTE.map((island, index) => (
              <g
                key={island.id}
                data-island={island.id}
                className="origin-center opacity-0"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                transform={`translate(${island.x} ${island.y})`}
              >
                <circle
                  r={island.major ? 7 : 4}
                  fill="var(--color-abyss)"
                  stroke={
                    island.major ? "var(--color-gold)" : "var(--color-surf)"
                  }
                  strokeWidth="2.5"
                />
                {/* Marcos sempre acima; os menores alternam acima e abaixo.
                    As ilhas ficam próximas no eixo X e, com todos os rótulos
                    do mesmo lado, o nome de uma caía sobre a legenda da
                    vizinha. */}
                <text
                  y={island.major ? -18 : index % 2 === 0 ? -13 : 21}
                  textAnchor="middle"
                  className="font-display"
                  fill="var(--color-parchment)"
                  fontSize={island.major ? 17 : 12}
                  opacity={island.major ? 0.95 : 0.55}
                >
                  {island.name}
                </text>
                {island.major && (
                  <text
                    y={26}
                    textAnchor="middle"
                    fill="var(--color-fog)"
                    fontSize="11"
                    letterSpacing="1.5"
                  >
                    {island.note}
                  </text>
                )}
              </g>
            ))}

            {/* Navio na ponta da linha. Um triângulo simples: em 12px de tela
                qualquer desenho mais detalhado vira borrão. */}
            <g data-ship>
              <path
                d="M 0 -9 L 7 7 L 0 3 L -7 7 Z"
                fill="var(--color-parchment)"
              />
            </g>
          </svg>
        </div>

        <p className="text-fog mt-8 max-w-xl text-sm leading-relaxed">
          O traçado é ilustrativo — a ordem das ilhas é que é fiel. Laugh Tale
          fica onde ninguém confirmou ainda.
        </p>
      </div>
    </section>
  );
}
