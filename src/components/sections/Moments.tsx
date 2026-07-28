"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MOMENTS } from "@/content/moments";
import { Reveal } from "@/components/ui/Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * A jornada, em linha do tempo.
 *
 * A linha vertical vermelha cresce em `scaleY` acompanhando o progresso do
 * scroll dentro da seção — é o único elemento com scrub aqui; o texto entra
 * com o Reveal padrão, que não amarra leitura ao movimento do dedo.
 */
export function Moments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-spine]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "50% 0%",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: 0.6,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative px-6 py-32 md:px-16"
      aria-label="A jornada"
    >
      <Reveal className="mx-auto mb-24 max-w-4xl">
        <span className="label-caps text-blood">
          De Loguetown até o fim do mapa
        </span>
        <h2 className="display mt-4 text-[clamp(2.5rem,8vw,7rem)]">
          A <span className="text-hollow">Jornada</span>
        </h2>
      </Reveal>

      <div className="relative mx-auto max-w-4xl">
        {/* Trilho de fundo + linha viva que cresce com o scroll. */}
        <div className="bg-parchment/10 absolute top-2 bottom-2 left-[9px] w-px" />
        <div
          data-spine
          className="bg-blood absolute top-2 bottom-2 left-[9px] w-px"
        />

        <ol className="space-y-20">
          {MOMENTS.map((moment, index) => (
            <li key={moment.title} className="relative pl-12 md:pl-16">
              {/* O marcador fica FORA do Reveal de propósito. O Reveal aplica
                  um transform, e elemento transformado vira bloco de contenção
                  para descendentes absolutos — dentro dele o `left-0` passava a
                  valer a partir do padding e o losango caía em cima do texto. */}
              <span
                className={`absolute top-1 left-0 h-5 w-5 rotate-45 border-2 ${
                  moment.ongoing
                    ? "border-fog/50 bg-abyss"
                    : "border-blood bg-blood/30"
                }`}
                aria-hidden="true"
              />
              <Reveal delay={index * 0.03}>
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="label-caps text-gold">{moment.marker}</span>
                  <span className="label-caps text-fog/60">{moment.place}</span>
                </div>
                <h3 className="display mt-3 text-3xl md:text-5xl">
                  {moment.title}
                </h3>
                <p className="text-parchment/75 mt-4 max-w-2xl leading-relaxed">
                  {moment.description}
                </p>
                {moment.ongoing && (
                  <p className="text-fog label-caps mt-5">
                    Ainda em curso na obra
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
