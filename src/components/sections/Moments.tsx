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
 * A linha vertical carmesim cresce em `scaleY` acompanhando o progresso do
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
      <Reveal className="mx-auto mb-20 max-w-3xl">
        <span className="label-caps text-crimson">De Loguetown até o fim do mapa</span>
        <h2 className="font-display mt-3 text-[clamp(2rem,5vw,4rem)] leading-none">
          A Jornada
        </h2>
      </Reveal>

      <div className="relative mx-auto max-w-3xl">
        {/* Trilho de fundo + linha viva que cresce com o scroll. */}
        <div className="bg-mist/12 absolute top-2 bottom-2 left-[7px] w-px md:left-[9px]" />
        <div
          data-spine
          className="bg-crimson absolute top-2 bottom-2 left-[7px] w-px md:left-[9px]"
        />

        <ol className="space-y-16">
          {MOMENTS.map((moment, index) => (
            <li key={moment.title} className="relative pl-10 md:pl-14">
              <Reveal delay={index * 0.03}>
                <span
                  className={`absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 md:h-[22px] md:w-[22px] ${
                    moment.ongoing
                      ? "border-mist/40 bg-void"
                      : "border-crimson bg-crimson/25"
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <span className="label-caps text-gold">{moment.marker}</span>
                  <span className="label-caps text-mist/60">{moment.place}</span>
                </div>
                <h3 className="font-display mt-2 text-3xl md:text-4xl">
                  {moment.title}
                </h3>
                <p className="text-parchment/70 mt-3 max-w-xl leading-relaxed">
                  {moment.description}
                </p>
                {moment.ongoing && (
                  <p className="text-mist label-caps mt-4">
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
